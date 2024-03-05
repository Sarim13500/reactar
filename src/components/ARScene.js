import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    axios
      .get(
        "https://augmented-api.azurewebsites.net/manholes/latlong?latitude=59.907809&longitude=10.758035"
      )
      .then((response) => {
        // Extracting and logging wkt values
        response.data.forEach((manhole) => {
          console.log(manhole);
          console.log("Extracting wkt...");
          console.log(manhole.wkt);
          console.log("Extracting long lat...");
          console.log(manhole.long);
          console.log(manhole.lat);

          // Create a box for each manhole
          const geom = new THREE.BoxGeometry(10, 10, 10);
          const mtl = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });
          const box = new THREE.Mesh(geom, mtl);

          // Add the box to the AR scene at the manhole's coordinates
          arjs.add(box, manhole.long, manhole.lat);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

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
