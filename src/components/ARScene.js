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
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let scene; // Declare scene variable outside useEffect to make it accessible

  useEffect(() => {
    let camera, renderer, arjs, cam, deviceOrientationControls;

    // Function to handle location updates
    const handleLocationUpdate = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        // Remove existing boxes and labels from the scene
        boxes.forEach((box) => scene.remove(box.mesh));
        labels.forEach((label) => scene.remove(label));
        boxes.length = 0; // Clear the boxes array
        labels.length = 0; // Clear the labels array

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
                  type: manhole.type,
                  sistModifisert: manhole.sistModifisert,
                })
            );

            localStorage.setItem("manholeData", JSON.stringify(manholeModels));

            manholeModels.forEach((manholeModel) => {
              const distance = calculateDistance(
                latitude,
                longitude,
                manholeModel.lat,
                manholeModel.long
              );

              const geom = new THREE.CylinderGeometry(1, 1, 0.5, 8);
              const mtl = new THREE.MeshBasicMaterial({
                color: 0x55a1e8,
                opacity: 0.8,
                transparent: true,
              });
              const boxMesh = new THREE.Mesh(geom, mtl);

              boxMesh.isManhole = true;
              boxMesh.manholeData = `Kumlokk ID: ${manholeModel.id}, Navn: ${manholeModel.name}, Bruksmateriale: ${manholeModel.bruksmateriale}`;

              // Adjust the position of the box based on the manhole's longitude and latitude
              boxMesh.position.set(manholeModel.lat, -1, manholeModel.long);

              const boxData = {
                mesh: boxMesh,
                lat: manholeModel.lat,
                long: manholeModel.long,
              };
              boxes.push(boxData);

              // Create and store text label
              const label = createLabel(
                `${manholeModel.name} ${distance.toFixed(0)}m`
              );
              labels.push(label);
              scene.add(label);

              // Attach label to the box
              boxData.label = label;

              // Add boxMesh to the scene
              scene.add(boxMesh);
            });
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      });
    };

    // Start watching for location updates every 5 seconds
    const intervalId = setInterval(handleLocationUpdate, 5000);

    // Set up the scene, camera, renderer, and AR components
    const canvas = canvasRef.current;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    renderer = new THREE.WebGLRenderer({ canvas });
    arjs = new THREEx.LocationBased(scene, camera);
    cam = new THREEx.WebcamRenderer(renderer);
    deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);

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

    // Add event listener for canvas click
    canvas.addEventListener("click", onCanvasClick, false);

    function onCanvasClick(event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      // Iterate over all intersections to find "manhole" objects
      for (let i = 0; i < intersects.length; i++) {
        const intersectedObject = intersects[i].object;
        if (intersectedObject.isManhole) {
          alert(`Informasjon om manhole: ${intersectedObject.manholeData}`);
        }
      }
    }

    // Clean up function
    return () => {
      clearInterval(intervalId); // Clear interval when component unmounts
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
    // Increase canvas resolution for better clarity
    canvas.width = 256; // Higher resolution
    canvas.height = 128;

    const context = canvas.getContext("2d");
    // Adjust for high resolution canvas to keep text small but clear
    context.font = "16px Arial"; // Slightly larger font for clarity, adjusted for higher resolution
    context.fillStyle = "rgba(255,255,255,0.95)";
    context.textAlign = "center"; // Ensure text is centered
    context.textBaseline = "middle"; // Vertically align text in the middle
    context.fillText(text, canvas.width / 2, canvas.height / 2); // Draw text in the center of canvas

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    // Adjust sprite scale to fit the text comfortably above the box
    // Scale down to make the label appear smaller in the scene
    sprite.scale.set(15, 7.5, 1); // Adjusted scale for better legibility and size
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
