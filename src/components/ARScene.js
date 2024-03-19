import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const manholes = useRef(new Map());

  useEffect(() => {
    // Basic setup for AR.js and Three.js
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const arjs = new THREEx.LocationBased(scene, camera);
    arjs.startGps();

    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      axios
        .get(
          `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
        )
        .then((response) => {
          response.data.forEach((manhole) => {
            if (!manholes.current.has(manhole.id)) {
              const geom = new THREE.BoxGeometry(1, 1, 1);
              const mtl = new THREE.MeshBasicMaterial({ color: 0x55a1e8 });
              const boxMesh = new THREE.Mesh(geom, mtl);
              boxMesh.position.set(manhole.long, 0.5, manhole.lat);

              const label = createLabel(manhole.name);
              label.position.set(manhole.long, 1, manhole.lat); // Adjust label position above the box

              scene.add(boxMesh);
              scene.add(label);

              manholes.current.set(manhole.id, { mesh: boxMesh, label: label });
            }
          });
        })
        .catch(console.error);

      // Update visibility
      manholes.current.forEach((manholeData, id) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          manholeData.mesh.position.x,
          manholeData.mesh.position.z
        );
        const isVisible = distance <= 30;
        manholeData.mesh.visible = isVisible;
        if (manholeData.label) {
          manholeData.label.visible = isVisible;
        }
      });
    };

    const watchId = navigator.geolocation.watchPosition(handleLocationUpdate);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const createLabel = (text) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Arial";
    ctx.fillText(text, 50, 64);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(5, 2.5, 1);
    return sprite;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
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

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default ARScene;
