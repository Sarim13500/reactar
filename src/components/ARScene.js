import React, { useEffect, useRef } from "react";
import TrionaLogo from "./TrionaLogo";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });

    //options
    // gpsMinDistance is the distance that the gps has to move to rerender/update the components shown
    // gpsMinAccuracy is the accuracy the gps needs before it fetches any objects.
    // Currently set to the default values

    const arjs = new THREEx.LocationBased(scene, camera, {
      gpsMinDistance: 5,
      gpsMinAccuracy: 100,
    });

    const cam = new THREEx.WebcamRenderer(renderer);

    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mtl = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      opacity: 0.8,
      transparent: true,
    });

    const deviceOrientationControls = new THREEx.DeviceOrientationControls(
      camera
    );

    let manholeModels = [];
    arjs.on("gpsupdate", async (pos) => {
      console.log(pos);
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

      //Fetching data from our API
      const manholeApiResponse = await fetch(
        `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
      );
      //deserializing to json
      const responseInJsonFormat = await manholeApiResponse.json(); //unpacks the response object into its json-object form so we can work with the data.

      //pushing to manholeModels object/array
      responseInJsonFormat.forEach((model) => {
        // const box = new THREE.Mesh(geom, mtl);
        // arjs.add(box, model.long, model.lat);

        manholeModels.push(model);
      });

      //Finding boxes within radius
      let withinRadius = [];
      if (manholeModels.length > 0) {
        withinRadius = getBoxesWithinRadius(
          latitude,
          longitude,
          manholeModels,
          100
        );
      }

      // //adding boxes within radius to scene.
      withinRadius.forEach((model) => {
        const box = new THREE.Mesh(geom, mtl);
        arjs.add(box, model.long, model.lat);
      });

      fillManholeModelsWithData({
        manholeModels: withinRadius,
        labels: [],
        scene: scene,
        geom: geom,
        mtl: mtl,
      });

      localStorage.setItem("manholeData", JSON.stringify(manholeModels));
    });

    arjs.startGps();
    requestAnimationFrame(render);

    function render() {
      console.log("We are rendering bois");
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
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: "black", width: "100%", height: "100%" }}
      />
    </>
  );
};

function getBoxesWithinRadius(latitude, longitude, manholeModels, radius) {
  // Remove boxes outside the 30-meter boundary
  let withinRadius = [];
  for (let i = manholeModels.length - 1; i >= 0; i--) {
    const distance = calculateDistance(
      latitude,
      longitude,
      manholeModels[i].lat,
      manholeModels[i].long
    );
    if (distance < radius) {
      withinRadius.push(manholeModels[i]);
    }
  }
  return withinRadius;
}

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

const fillManholeModelsWithData = ({ manholeModels, labels, scene, geom,
  mtl, }) => {
  let boxes;

  const boxMesh = new THREE.Mesh(geom, mtl);

  manholeModels.forEach((manholeModel, boxes, labels, boxMesh) => {
    console.log(manholeModel);
    // Adjust the position of the box based on the manhole's longitude and latitude
    boxMesh.position.set(manholeModel.long, -1, manholeModel.lat); // Note: You might need to adjust this depending on your coordinate system
    // Create and store text label
    const label = createLabel(manholeModel.name);
    labels.push(label); // Store the label
    scene.add(label); // Add the label to the scene
    // Prepare data for rendering
    const boxData = {
      mesh: boxMesh,
      lat: manholeModel.lat,
      long: manholeModel.long,
      label: label,
    };
    boxes.push(boxData);
  });
};

// Function to create text label
const createLabel = (labelText) => {
  const canvas = document.createElement("canvas");
  canvas.width = 128; // Set the width of the canvas
  canvas.height = 64; // Set the height of the canvas
  const context = canvas.getContext("2d");
  context.font = "16px Arial";
  context.fillStyle = "rgba(255,255,255,0.95)";
  context.fillText(labelText, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(30, 15, 1);
  return sprite;
};

export default ARScene;
