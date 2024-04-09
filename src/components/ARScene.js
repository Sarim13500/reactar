import React, { useEffect, useRef, useState } from "react";
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
  const [isLocationChanged, setLocationChanged] = useState(false);

  useEffect(() => {
    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      if (
        Math.abs(latitude - lastLat) > 0.0001 ||
        Math.abs(longitude - lastLong) > 0.0001
      ) {
        lastLat = latitude;
        lastLong = longitude;
        setLocationChanged(true);
        setTimeout(() => setLocationChanged(false), 5000); // Update every 5 seconds
      }
    };

    const watchId = navigator.geolocation.watchPosition(handleLocationUpdate);

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

    render();

    canvas.addEventListener("click", onCanvasClick, false);

    function onCanvasClick(event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      for (let i = 0; i < intersects.length; i++) {
        const intersectedObject = intersects[i].object;
        if (intersectedObject.isManhole) {
          alert(`Informasjon om manhole: ${intersectedObject.manholeData}`);
        }
      }
    }

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isLocationChanged]);

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

    const d = R * c;
    return d;
  };

  const createLabel = (text) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;

    const context = canvas.getContext("2d");
    context.font = "16px Arial";
    context.fillStyle = "rgba(255,255,255,0.95)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(15, 7.5, 1);
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
