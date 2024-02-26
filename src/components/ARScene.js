import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    const arjs = new THREEx.LocationBased(scene, camera);
    const cam = new THREEx.WebcamRenderer(renderer);

    const geom = new THREE.BoxGeometry(200, 200, 200);
    const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(geom, mtl);

    arjs.add(box, 10.759166, 59.908562);
    arjs.startGps();

    // Function to handle device orientation event
    function handleOrientation(event) {
      const alpha = event.alpha; // rotation around z-axis
      const beta = event.beta; // rotation around x-axis
      const gamma = event.gamma; // rotation around y-axis

      // Convert degrees to radians
      const alphaRad = (alpha * Math.PI) / 180;
      const betaRad = (beta * Math.PI) / 180;
      const gammaRad = (gamma * Math.PI) / 180;

      // Rotate the camera based on device orientation
      camera.rotation.x = betaRad;
      camera.rotation.y = gammaRad;
      camera.rotation.z = alphaRad;

      renderer.render(scene, camera);
    }

    // Listen for device orientation events
    window.addEventListener("deviceorientation", handleOrientation);

    function render() {
      if (
        canvas.width != canvas.clientWidth ||
        canvas.height != canvas.clientHeight
      ) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        const aspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }

      cam.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();

    return () => {
      // Clean up code here (if needed)
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ backgroundColor: "black", width: "100%", height: "100%" }}
    />
  );
};

export default ARScene;
