import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const boxesRef = useRef([]); // Ref to store the added boxes

  useEffect(() => {
    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      axios
        .get(
          `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
        )
        .then((response) => {
          const newManholes = response.data;

          // Remove old boxes that are no longer within the new bounding box
          const oldBoxes = boxesRef.current;
          oldBoxes.forEach((box) => {
            if (
              !newManholes.some((manhole) => manhole.id === box.userData.id)
            ) {
              scene.remove(box);
            }
          });
          boxesRef.current = [];

          // Add new boxes for the current manholes
          newManholes.forEach((manhole) => {
            const geom = new THREE.BoxGeometry(3, 3, 3);
            const mtl = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });
            const box = new THREE.Mesh(geom, mtl);
            box.position.set(manhole.long, manhole.lat, 0); // Set position

            scene.add(box);
            boxesRef.current.push(box); // Add to boxesRef
            box.userData.id = manhole.id; // Assign an id for tracking
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    // Request permission to access location and watch for updates
    const watchId = navigator.geolocation.watchPosition(handleLocationUpdate);

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
      navigator.geolocation.clearWatch(watchId); // Stop watching for location updates when unmounting
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
