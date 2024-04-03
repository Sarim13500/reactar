import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";
import { ManholeModel } from "../Manhole";

const ARScene = ({ log }) => {
  const canvasRef = useRef(null);
  const boxes = []; // Array to store boxes
  const labels = []; // Array to store labels
  let lastLat = -1;
  let lastLong = -1;

  useEffect(() => {
    // Function to handle location updates
    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Use the provided log function instead of console.log
      log("Latitude: " + latitude);
      log("Longitude: " + longitude);

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
              box.mesh.position.y + 1, // Adjust this offset as needed
              box.mesh.position.z
            );
          }
        }
      });

      // Fetch new data from the API and add objects to the scene
      if (
        Math.abs(latitude - lastLat) > 0.0001 ||
        Math.abs(longitude - lastLong) > 0.0001
      ) {
        lastLat = latitude;
        lastLong = longitude;
        axios
          .get(
            `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
          )
          .then((response) => {
            const manholeModels = response.data.map(
              (manhole) =>
                new ManholeModel({
                  id: manhole.id,
                  featureTypeId: manhole.featureTypeId,
                  name: manhole.name,
                  subSection: manhole.subSection,
                  county: manhole.county,
                  srid: manhole.srid,
                  wkt: manhole.wkt,
                  lat: manhole.lat,
                  long: manhole.long,
                })
            );

            if (manholeModels.length > 0) {
              // Assuming you want to log the distance to the first manhole
              const firstManhole = manholeModels[0];
              const distance = calculateDistance(
                latitude,
                longitude,
                firstManhole.lat,
                firstManhole.long
              );
              log(
                `Distance to ${firstManhole.name}: ${distance.toFixed(
                  2
                )} meters`
              );
            }

            // Now you can use manholeModels, which is an array of ManholeModel instances
            //console.log(manholeModels);

            manholeModels.forEach((manholeModel) => {
              console.log(manholeModel);
              const geom = new THREE.ConeGeometry(5, 20, 32);
              const mtl = new THREE.MeshBasicMaterial({
                color: 0x55a1e8,
                opacity: 0.8,
                transparent: true,
                depthWrite: false, // Add this line
              });
              const boxMesh = new THREE.Mesh(geom, mtl);

              // Adjust the position of the box based on the manhole's longitude and latitude
              boxMesh.position.set(manholeModel.long, -1, manholeModel.lat); // Note: You might need to adjust this depending on your coordinate system

              // Prepare data for rendering
              const boxData = {
                mesh: boxMesh,
                lat: manholeModel.lat,
                long: manholeModel.long,
              };
              boxes.push(boxData);

              // Create and store text label
              const label = createLabel(
                manholeModel.name + " " + distance.toFixed(0) + "m"
              );
              labels.push(label); // Store the label
              scene.add(label); // Add the label to the scene

              // Attach label to the box
              boxData.label = label;

              // Add boxMesh to the scene (adjust according to your AR library usage)
              arjs.add(boxMesh, manholeModel.long, manholeModel.lat);
            });
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    };

    // Start watching for location updates
    const watchId = navigator.geolocation.watchPosition(handleLocationUpdate);

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
    context.font = "8px Arial";
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
