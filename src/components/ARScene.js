import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const boxes = useRef([]); // Array to store boxes
  const labels = useRef([]); // Array to store labels
  const manholesAdded = useRef({}); // Object to track added manholes

  useEffect(() => {
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

    // Function to handle location updates
    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Fetch new data from the API and add objects to the scene
      axios
        .get(
          `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
        )
        .then((response) => {
          response.data.forEach((manhole) => {
            // Check if manhole has already been added
            if (!manholesAdded.current[manhole.id]) {
              const geom = new THREE.BoxGeometry(1, 1, 1);
              const mtl = new THREE.MeshBasicMaterial({ color: 0x55a1e8 });
              const boxMesh = new THREE.Mesh(geom, mtl);

              // Adjust the Y position of the box to lower it
              boxMesh.position.set(manhole.long, -0.5, manhole.lat); // Lowered Y position

              // Store box's coordinates
              const boxData = {
                id: manhole.id,
                mesh: boxMesh,
                lat: manhole.lat,
                long: manhole.long,
                label: null, // This will be set later
              };
              boxes.current.push(boxData);

              // Mark this manhole as added
              manholesAdded.current[manhole.id] = true;

              // Create text label
              const label = createLabel(manhole.name);
              label.position.set(manhole.long, 0.5, manhole.lat); // Adjust label position

              labels.current.push(label); // Store the label
              scene.add(label); // Add the label to the scene

              // Attach label to the box
              boxData.label = label;

              scene.add(boxMesh); // Add the box mesh to the scene
            }
          });

          // Remove or show boxes based on the new location
          boxes.current.forEach((box) => {
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
                  box.mesh.position.y + 1, // Adjust this offset as needed
                  box.mesh.position.z
                );
              }
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    // Function to create text label
    const createLabel = (text) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128; // Set the width of the canvas
      canvas.height = 64; // Set the height of the canvas
      const context = canvas.getContext("2d");
      context.font = "Bold 10px Arial";
      context.fillStyle = "rgba(255,255,255,0.95)";
      context.fillText(text, 50, 50); // Adjust text positioning as needed

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(10, 5, 1); // Adjust sprite size as needed
      return sprite;
    };

    // Initialize Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Start watching for location updates
    const watchId = navigator.geolocation.watchPosition(
      handleLocationUpdate,
      undefined,
      {
        enableHighAccuracy: true,
      }
    );

    // Render function
    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    // Clean up on component unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default ARScene;
