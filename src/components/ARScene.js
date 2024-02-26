import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    const arjs = new THREEx.LocationBased(scene, camera);
    const cam = new THREEx.WebcamRenderer(renderer);

    const geom = new THREE.BoxGeometry(200, 200, 200);
    const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(geom, mtl);

    // Create the device orientation tracker
    const deviceOrientationControls = new THREEx.DeviceOrientationControls(
      camera
    );

    arjs.add(box, 10.759166, 59.908562);

    const startGPSTracking = () => {
      const handlePositionUpdate = (position) => {
        const { latitude, longitude } = position.coords;
        arjs.updateLocation(latitude, longitude);
      };

      const handlePositionError = (error) => {
        console.error("Error getting geolocation:", error);
      };

      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          maximumAge: 0,
        };
        const watchId = navigator.geolocation.watchPosition(
          handlePositionUpdate,
          handlePositionError,
          options
        );
        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const cleanupGPSTracking = startGPSTracking();

    function render() {
      if (
        canvas.width != canvas.clientWidth ||
        canvas.height != canvas.clientHeight
      ) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        const aspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }

      // Update the scene using the latest sensor readings
      deviceOrientationControls.update();

      cam.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    //Yanniiiii
    //Yan

    render();

    return () => {
      cleanupGPSTracking();
      // Clean up code here (if needed)
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ backgroundColor: "black", width: "100%", height: "100%" }}
    />
  );
};

export default ARScene;
