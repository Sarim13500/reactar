import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const arjs = new THREEx.LocationBased();
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mtl = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });

    arjs.startGps();

    arjs.on("gpsupdate", async (pos) => {
      if (!fetched) {
        try {
          const response = await axios.get(
            `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}`
          );
          response.data.forEach((manhole) => {
            const box = new THREE.Mesh(geom, mtl);
            arjs.add(box, manhole.long, manhole.lat);
          });
          setFetched(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    });

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ canvas });
    const cam = new THREEx.WebcamRenderer(renderer);
    const deviceOrientationControls = new THREEx.DeviceOrientationControls(
      camera
    );

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
