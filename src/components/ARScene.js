import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

function ARScene() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const geom = new THREE.BoxGeometry(20, 20, 20);

    const arjs = new THREEx.LocationBased(scene, camera);

    const cam = new THREEx.WebcamRenderer(renderer, videoRef.current);

    let orientationControls;

    if (isMobile()) {
      orientationControls = new THREEx.DeviceOrientationControls(camera);
    }

    let fake = null;
    let first = true;

    arjs.on("gpsupdate", (pos) => {
      if (first) {
        setupObjects(pos.coords.longitude, pos.coords.latitude);
        first = false;
      }
    });

    arjs.on("gpserror", (code) => {
      alert(`GPS error: code ${code}`);
    });

    if (fake) {
      arjs.fakeGps(fake.lon, fake.lat);
    } else {
      arjs.startGps();
    }

    function isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }

    function render(time) {
      resizeUpdate();
      if (orientationControls) orientationControls.update();
      cam.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function resizeUpdate() {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth,
        height = canvas.clientHeight;
      if (width !== canvas.width || height !== canvas.height) {
        renderer.setSize(width, height, false);
      }
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    function setupObjects(longitude, latitude) {
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const material4 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      arjs.add(new THREE.Mesh(geom, material), longitude, latitude + 0.001); // slightly north
      arjs.add(new THREE.Mesh(geom, material2), longitude, latitude - 0.001); // slightly south
      arjs.add(new THREE.Mesh(geom, material3), longitude - 0.001, latitude); // slightly west
      arjs.add(new THREE.Mesh(geom, material4), longitude + 0.001, latitude); // slightly east
    }

    requestAnimationFrame(render);

    return () => {
      // Clean up event listeners or any resources here if needed
    };
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  return (
    <div>
      <canvas ref={canvasRef} id="canvas1"></canvas>
      <video ref={videoRef} id="video1" autoPlay playsInline></video>
    </div>
  );
}

export default ARScene;
