import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let intervalId; // Variable to hold the interval id

    // Function to handle location updates
    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Remove all existing objects from the scene
      scene.children.forEach((child) => {
        scene.remove(child);
      });

      // Fetch new data from the API and add objects to the scene
      axios
        .get(
          `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
        )
        .then((response) => {
          response.data.forEach((manhole) => {
            console.log(manhole);
            console.log("Extracting wkt...");
            console.log(manhole.wkt);
            console.log("Extracting long lat...");
            console.log(manhole.long);
            console.log(manhole.lat);

            const geom = new THREE.BoxGeometry(3, 3, 3);
            const mtl = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });
            const box = new THREE.Mesh(geom, mtl);

            arjs.add(box, manhole.long, manhole.lat);
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    // Start watching for location updates
    const watchId = navigator.geolocation.watchPosition(handleLocationUpdate);

    // Set up the scene, camera, renderer, and AR components
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

    // Start the render loop
    render();

    // Set up the interval to clear objects every 10 seconds
    intervalId = setInterval(() => {
      console.log("removing");
      scene.children.forEach((child) => {
        scene.remove(child);
      });
    }, 10000);

    // Clean up function
    return () => {
      clearInterval(intervalId); // Clear the interval when unmounting
      navigator.geolocation.clearWatch(watchId); // Stop watching for location updates
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
