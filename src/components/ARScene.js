import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const boxes = []; // Array to store boxes
  const labels = []; // Array to store labels

  useEffect(() => {
    // Function to handle location updates
    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Remove boxes outside the 30-meter boundary
      boxes.forEach((box) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          box.lat,
          box.long
        );
        if (distance > 30) {
          box.mesh.visible = false; // Hide the box if it's outside the boundary
          if (box.label) {
            box.label.visible = false; // Hide the label if it exists
          }
        } else {
          box.mesh.visible = true; // Show the box if it's within the boundary
          if (box.label) {
            box.label.visible = true; // Show the label if it exists
            // Adjust label position above the box
            box.label.position.set(
              box.mesh.position.x,
              box.mesh.position.y + 2, // Adjust this offset as needed
              box.mesh.position.z
            );
          }
        }
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

            const geom = new THREE.BoxGeometry(1, 1, 1);
            const mtl = new THREE.MeshBasicMaterial({ color: 0x55a1e8 });
            const boxMesh = new THREE.Mesh(geom, mtl);

            // Store box's coordinates
            const boxData = {
              mesh: boxMesh,
              lat: manhole.lat,
              long: manhole.long,
            };
            boxes.push(boxData);

            // Create text label
            const label = createLabel(manhole.name);
            label.position.set(manhole.long, 2, manhole.lat); // Position the label above the box
            labels.push(label); // Store the label
            scene.add(label); // Add the label to the scene

            // Attach label to the box
            boxData.label = label;

            arjs.add(boxMesh, manhole.long, manhole.lat);
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
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
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

    // Clean up function
    return () => {
      navigator.geolocation.clearWatch(watchId); // Stop watching for location updates
    };
  }, []);

  // Function to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d;
  };

  // Function to create text label
  const createLabel = (text) => {
    const canvas = document.createElement("canvas");
    canvas.width = 128; // Set the width of the canvas
    canvas.height = 64; // Set the height of the canvas
    const context = canvas.getContext("2d");
    context.font = "Bold 10px Arial";
    context.fillStyle = "rgba(255,255,255,0.95)";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(30, 15, 1);
    return sprite;
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        backgroundColor: "black",
        width: "100vw", // Viewport height
        height: "100vh", // Viewport width
      }}
    />
  );
};

export default ARScene;
