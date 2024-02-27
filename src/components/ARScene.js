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

    const geom = new THREE.BoxGeometry(20, 20, 20);
    const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(geom, mtl);

    // Define a function to handle device orientation changes
    function handleDeviceOrientation(event) {
      const { beta, gamma } = event;

      // Convert degrees to radians
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(gamma);

      // Adjust camera rotation based on device orientation
      camera.rotation.x = betaRad;
      camera.rotation.y = gammaRad;
    }

    // Add event listener for device orientation changes
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    // Make sure to remove the event listener when the component unmounts
    useEffect(() => {
      return () => {
        window.removeEventListener(
          "deviceorientation",
          handleDeviceOrientation
        );
      };
    }, []);

    arjs.add(box, -0.72, 51.051);

    arjs.startGps();

    requestAnimationFrame(render);

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

    //Yanniiiii
    //Yan

    render();

    return () => {
      // Clean up code here (if needed)
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
