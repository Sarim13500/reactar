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

    const deviceOrientationControls = new THREEx.DeviceOrientationControls(
      camera
    );

    arjs.startGps();

    // Define an array of positions for the boxes
    const positions = [
      { lon: 10.758835, lat: 59.908646 },
      { lon: 10.758549, lat: 59.908334 },
      { lon: 10.762562, lat: 59.911696 },
      { lon: 10.762472, lat: 59.910473 },
      { lon: 10.758842, lat: 59.910473 },
    ];

    // Create and add boxes at different positions
    positions.forEach(({ lon, lat }) => {
      const geom = new THREE.BoxGeometry(10, 10, 10);
      const mtl = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });
      const box = new THREE.Mesh(geom, mtl);
      arjs.add(box, lon, lat);
    });

    // Render function
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
      deviceOrientationControls.update();
      cam.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    // Initial render
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
