import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const [currentPositions, setCurrentPositions] = useState([]);
  const [previousPositions, setPreviousPositions] = useState([]);

  useEffect(() => {
    // Function to handle location updates
    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      scene.children.forEach((child) => {
        scene.remove(child);
      });

      // Now you can use latitude and longitude in your API call
      axios
        .get(
          `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
        )
        .then((response) => {
          // Extracting and logging wkt values
          const newPositions = response.data.map((manhole) => ({
            longitude: manhole.long,
            latitude: manhole.lat,
          }));
          console.log(newPositions);

          // Compare current and previous positions
          const addedPositions = newPositions.filter(
            (pos) =>
              !previousPositions.some(
                (prevPos) =>
                  prevPos.latitude === pos.latitude &&
                  prevPos.longitude === pos.longitude
              )
          );
          const removedPositions = previousPositions.filter(
            (prevPos) =>
              !newPositions.some(
                (pos) =>
                  pos.latitude === prevPos.latitude &&
                  pos.longitude === prevPos.longitude
              )
          );

          // Add new boxes for added positions
          addedPositions.forEach((pos) => {
            const geom = new THREE.BoxGeometry(3, 3, 3);
            const mtl = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });
            const box = new THREE.Mesh(geom, mtl);
            arjs.add(box, pos.longitude, pos.latitude);
          });

          // Remove boxes for removed positions
          removedPositions.forEach((pos) => {
            // Implement removal logic here
          });

          // Update previous positions
          setPreviousPositions(newPositions);
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
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
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
