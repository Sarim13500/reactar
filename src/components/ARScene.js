import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  // Using a Map object to keep track of manholes by their IDs
  const manholes = useRef(new Map());

  useEffect(() => {
    // Function to handle location updates
    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      axios
        .get(
          `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
        )
        .then((response) => {
          response.data.forEach((manhole) => {
            // Use manhole.Id as the unique identifier
            if (!manholes.current.has(manhole.Id)) {
              // Manhole is not yet tracked, add it
              const geom = new THREE.BoxGeometry(1, 1, 1);
              const mtl = new THREE.MeshBasicMaterial({ color: 0x55a1e8 });
              const boxMesh = new THREE.Mesh(geom, mtl);
              boxMesh.position.set(manhole.long, -0.5, manhole.lat);

              const label = createLabel(manhole.name);
              scene.add(label);

              // Store box and label with the manhole.Id
              manholes.current.set(manhole.Id, { mesh: boxMesh, label: label });

              arjs.add(boxMesh, manhole.long, manhole.lat);
            } else {
              // Manhole already exists, update visibility if necessary
              const manholeData = manholes.current.get(manhole.Id);
              const distance = calculateDistance(
                latitude,
                longitude,
                manhole.lat,
                manhole.long
              );
              const isVisible = distance <= 30;
              manholeData.mesh.visible = isVisible;
              manholeData.label.visible = isVisible;
              if (isVisible) {
                // Update label position if needed
                manholeData.label.position.set(
                  manholeData.mesh.position.x,
                  manholeData.mesh.position.y + 1,
                  manholeData.mesh.position.z
                );
              }
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    // Set up the scene, camera, renderer, and AR components
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
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

    // Start watching for location updates
    const watchId = navigator.geolocation.watchPosition(handleLocationUpdate);

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
      style={{ backgroundColor: "black", width: "100%", height: "100%" }}
    />
  );
};

export default ARScene;
