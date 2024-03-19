import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const allObjects = useRef([]); // useRef to hold all objects across renders
  let scene, camera, renderer, arjs;

  useEffect(() => {
    // Initialize scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Initialize AR.js
    arjs = new THREEx.LocationBased(scene, camera);
    arjs.startGps();

    // Initialize device orientation controls
    const deviceOrientationControls = new THREEx.DeviceOrientationControls(
      camera
    );

    // Start watching for location updates
    const watchId = navigator.geolocation.watchPosition(
      handleLocationUpdate,
      handleError,
      { enableHighAccuracy: true }
    );

    // Render loop
    const render = () => {
      deviceOrientationControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    render();

    // Clean up on component unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
      // Additional cleanup here if necessary
    };
  }, []);

  // Handle location updates
  const handleLocationUpdate = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Optionally, fetch new data based on the updated location
    fetchData(latitude, longitude);

    // Filter objects within 30 meters and update visibility
    allObjects.current.forEach((obj) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        obj.lat,
        obj.long
      );
      const isVisible = distance <= 30;
      obj.mesh.visible = isVisible;
      if (obj.label) {
        obj.label.visible = isVisible;
      }
    });
  };

  // Error handler for geolocation
  const handleError = (error) => {
    console.error("Geolocation error:", error);
  };

  // Fetch data and create objects
  const fetchData = (latitude, longitude) => {
    axios
      .get(
        `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
      )
      .then((response) => {
        response.data.forEach((data) => {
          createObject(data);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Create an object and add it to the scene and allObjects array
  const createObject = (data) => {
    // Create mesh for the new object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x55a1e8 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(data.long, -0.5, data.lat);

    // Create label for the new object
    const label = createLabel(data.name);
    label.position.set(data.long, 0.5, data.lat);

    // Add to scene
    scene.add(mesh);
    scene.add(label);

    // Store object info
    allObjects.current.push({
      mesh: mesh,
      label: label,
      lat: data.lat,
      long: data.long,
    });
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Create a text label
  const createLabel = (text) => {
    // Your existing label creation code
    // Placeholder for label creation code
    const canvas = document.createElement("canvas");
    canvas.width = 256; // Example dimensions, adjust as needed
    canvas.height = 128;
    const context = canvas.getContext("2d");
    context.fillStyle = "#FFFFFF"; // Text color
    context.font = "24px Arial";
    context.fillText(text, 50, 50);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    return sprite;
  };

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default ARScene;
