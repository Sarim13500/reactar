import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";
import { ManholeModel } from "../Manhole"; // Adjust the import path as necessary

const ARScene = () => {
  const canvasRef = useRef(null);
  const boxesRef = useRef([]); // Use useRef to persist boxes across renders
  const labelsRef = useRef([]); // Use useRef to persist labels across renders
  const [lastLocation, setLastLocation] = useState({ lat: null, long: null }); // Track the last fetched location

  useEffect(() => {
    // Create the scene
    const scene = new THREE.Scene();

    // Setup renderer
    const canvas = canvasRef.current; // Assuming you have a ref to the canvas element
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement); // This line is optional if your canvas is already in the DOM

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5; // Adjust camera position based on your needs

    let lastFetchedLocation = { lat: null, long: null };

    const handleLocationUpdate = async (position) => {
      const { latitude, longitude } = position.coords;

      // Check if we need to fetch new data based on the user's movement
      if (
        !lastFetchedLocation.lat ||
        calculateDistance(
          latitude,
          longitude,
          lastFetchedLocation.lat,
          lastFetchedLocation.long
        ) > 100
      ) {
        lastFetchedLocation = { lat: latitude, long: longitude };

        try {
          const response = await axios.get(
            `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
          );
          const manholeObjects = response.data.map(
            (data) => new ManholeModel(data)
          );
          const nearbyManholes = manholeObjects.filter(
            (manhole) =>
              calculateDistance(
                latitude,
                longitude,
                manhole.lat,
                manhole.long
              ) <= 30
          );

          // Clear previous manholes from the scene
          boxesRef.current.forEach((box) => {
            scene.remove(box.mesh);
            if (box.label) scene.remove(box.label);
          });
          boxesRef.current = [];
          labelsRef.current = [];

          nearbyManholes.forEach((manhole) => {
            const geom = new THREE.BoxGeometry(1, 1, 1);
            const mtl = new THREE.MeshBasicMaterial({ color: 0x55a1e8 });
            const boxMesh = new THREE.Mesh(geom, mtl);

            boxMesh.position.set(manhole.long, -0.5, manhole.lat); // Set the position based on manhole coordinates

            const boxData = {
              mesh: boxMesh,
              lat: manhole.lat,
              long: manhole.long,
            };
            boxesRef.current.push(boxData);

            const label = createLabel(manhole.name);
            labelsRef.current.push(label);
            scene.add(boxMesh);
            scene.add(label);

            boxData.label = label;
            label.position.set(
              boxMesh.position.x,
              boxMesh.position.y + 1,
              boxMesh.position.z
            );
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      // Update visibility based on current location
      boxesRef.current.forEach((box) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          box.lat,
          box.long
        );
        box.mesh.visible = distance <= 30;
        if (box.label) box.label.visible = distance <= 30;
      });
    };

    const watchId = navigator.geolocation.watchPosition(
      handleLocationUpdate,
      (err) => {
        console.error("Error obtaining location", err);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    // Animation loop / render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      // Any animations or updates to objects in your scene
    };
    animate(); // Start the animation loop

    return () => {
      navigator.geolocation.clearWatch(watchId); // Stop watching location
      renderer.dispose(); // Optional: clean up renderer resources
      // Any other cleanup related to Three.js or AR.js
    };
  }, []); // Empty dependency array means this effect runs once on mount

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
      style={{ backgroundColor: "black", width: "100%", height: "100%" }}
    />
  );
};

export default ARScene;
