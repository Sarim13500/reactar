import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const [manholes, setManholes] = useState([]);

  useEffect(() => {
    const boxes = []; // Array to store boxes
    const labels = []; // Array to store labels

    // Function to handle location updates
    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Filter manholes within the 100-meter boundary from cached data
      const filteredManholes = manholes.filter((manhole) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          manhole.lat,
          manhole.long
        );
        return distance <= 100;
      });

      // Add filtered manholes to the scene
      addManholesToScene(filteredManholes, boxes, labels);
    };

    // Function to fetch data from the API and cache it
    const fetchData = (latitude, longitude) => {
      axios
        .get(
          `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
        )
        .then((response) => {
          const data = response.data;
          setManholes(data); // Cache the fetched data
          addManholesToScene(data, [], []); // Add manholes to the scene
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    // Function to add manholes to the scene
    const addManholesToScene = (manholes, boxes, labels) => {
      manholes.forEach((manhole) => {
        const geom = new THREE.BoxGeometry(1, 1, 1);
        const mtl = new THREE.MeshBasicMaterial({ color: 0x55a1e8 });
        const boxMesh = new THREE.Mesh(geom, mtl);
        const boxData = {
          mesh: boxMesh,
          lat: manhole.lat,
          long: manhole.long,
        };
        boxes.push(boxData);

        const label = createLabel(manhole.name);
        label.position.set(manhole.long, 5, manhole.lat);
        labels.push(label);

        // Attach label to the box
        boxData.label = label;

        arjs.add(boxMesh, manhole.long, manhole.lat);
      });
    };

    // Start watching for location updates
    const watchId = navigator.geolocation.watchPosition(handleLocationUpdate);

    // Clean up function
    return () => {
      navigator.geolocation.clearWatch(watchId); // Stop watching for location updates
    };
  }, [manholes]); // Re-run effect when manholes change

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
    context.font = "Bold 20px Arial";
    context.fillStyle = "rgba(255,255,255,0.95)";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(30, 15, 1);
    return sprite;
  };

  // Set up the scene, camera, renderer, and AR components
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    const arjs = new THREEx.LocationBased(scene, camera);
    const cam = new THREEx.WebcamRenderer(renderer);
    const deviceOrientationControls = new THREEx.DeviceOrientationControls(
      camera
    );

    arjs.startGps();

    // Render function
    function render() {
      if (
        canvasRef.current.width !== canvasRef.current.clientWidth ||
        canvasRef.current.height !== canvasRef.current.clientHeight
      ) {
        renderer.setSize(
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight,
          false
        );
        const aspect =
          canvasRef.current.clientWidth / canvasRef.current.clientHeight;
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
      // Clean up scene objects, etc.
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ backgroundColor: "black", width: "100vw", height: "100vh" }}
    />
  );
};

export default ARScene;
