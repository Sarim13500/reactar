import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as THREE from "three";
import { ManholeModel } from "../Manhole";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);
  const boxes = useRef([]); // Bruker useRef for å lagre tilstanden over renderinger
  const labels = useRef([]); // Bruker useRef for å lagre tilstanden over renderinger

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      160,
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

    const handleLocationUpdate = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Fjerne kummer utenfor 30m radius fra scenen
      boxes.current.forEach((box) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          box.manhole.lat,
          box.manhole.long
        );
        if (distance > 30) {
          scene.remove(box.mesh); // Fjerner box fra scenen
          if (box.label) {
            scene.remove(box.label); // Fjerner label fra scenen
          }
        }
      });

      // Fjerne elementene fra arrays som er utenfor 30m
      boxes.current = boxes.current.filter((box) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          box.manhole.lat,
          box.manhole.long
        );
        return distance <= 30;
      });

      labels.current = labels.current.filter((label) =>
        scene.children.includes(label)
      ); // Beholder kun labels som fortsatt er i scenen

      // Henter nye data fra API og legger til objekter i scenen
      axios
        .get(
          `https://augmented-api.azurewebsites.net/manholes/latlong?latitude=${latitude}&longitude=${longitude}`
        )
        .then((response) => {
          response.data.forEach((manholeData) => {
            const distance = calculateDistance(
              latitude,
              longitude,
              manholeData.lat,
              manholeData.long
            );
            if (distance <= 30) {
              // Sjekker at kummen er innenfor 30 meters radius
              const manhole = new ManholeModel(manholeData);

              // Oppretter mesh for kummen
              const geom = new THREE.BoxGeometry(1, 1, 1);
              const mtl = new THREE.MeshBasicMaterial({ color: 0x55a1e8 });
              const boxMesh = new THREE.Mesh(geom, mtl);
              boxes.current.push({
                mesh: boxMesh,
                manhole: manhole,
              });

              // Oppretter tekstetikett
              const label = createLabel(manhole.name);
              label.position.set(manhole.long, 2, manhole.lat);
              labels.current.push(label);
              scene.add(label);
              scene.add(boxMesh);
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const watchId = navigator.geolocation.watchPosition(handleLocationUpdate);

    arjs.startGps();
    render();

    // Rendringsfunksjon
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
        camera.aspect =
          canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        camera.updateProjectionMatrix();
      }
      deviceOrientationControls.update();
      cam.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Beregningsfunksjon for avstand
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

  // Funksjon for å opprette tekstetikett
  const createLabel = (text) => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
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
