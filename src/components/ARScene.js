import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const allObjects = useRef([]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const arjs = new THREEx.LocationBased(scene, camera);
    arjs.startGps();

    const deviceOrientationControls = new THREEx.DeviceOrientationControls(
      camera
    );

    const render = () => {
      deviceOrientationControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    render();

    const watchId = navigator.geolocation.watchPosition(
      handleLocationUpdate,
      handleError,
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleLocationUpdate = (position) => {
    const { latitude, longitude } = position.coords;

    axios
      .get(
        `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
      )
      .then((response) => {
        response.data.forEach((data) => {
          if (!objectAlreadyExists(data.lat, data.long)) {
            const object = createObject(data);
            scene.add(object.mesh);
            if (object.label) scene.add(object.label);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  };

  const handleError = (error) => {
    console.error("Geolocation error:", error);
  };

  const createObject = (data) => {
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(data.long, 0, data.lat);

    const label = createLabel(data.name);
    label.position.set(data.long, 1, data.lat);

    allObjects.current.push({ mesh, label, lat: data.lat, long: data.long });

    return { mesh, label, lat: data.lat, long: data.long };
  };

  const createLabel = (text) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Arial";
    ctx.fillText(text, 0, 24);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(5, 2.5, 1);

    return sprite;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const objectAlreadyExists = (lat, long) => {
    return allObjects.current.some(
      (obj) => obj.lat === lat && obj.long === long
    );
  };

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default ARScene;
