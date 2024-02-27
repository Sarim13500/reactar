import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

const ARScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    const geom = new THREE.BoxGeometry(20, 20, 20);
    const arjs = new THREEx.LocationBased(scene, camera);
    const cam = new THREEx.WebcamRenderer(renderer);

    const mouseStep = THREE.MathUtils.degToRad(5);

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

    let mousedown = false;
    let lastX = 0;

    if (!isMobile()) {
      window.addEventListener("mousedown", (e) => {
        mousedown = true;
      });

      window.addEventListener("mouseup", (e) => {
        mousedown = false;
      });

      window.addEventListener("mousemove", (e) => {
        if (!mousedown) return;
        if (e.clientX < lastX) {
          camera.rotation.y += mouseStep;
          if (camera.rotation.y < 0) {
            camera.rotation.y += 2 * Math.PI;
          }
        } else if (e.clientX > lastX) {
          camera.rotation.y -= mouseStep;
          if (camera.rotation.y > 2 * Math.PI) {
            camera.rotation.y -= 2 * Math.PI;
          }
        }
        lastX = e.clientX;
      });
    }

    function isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }

    function render() {
      resizeUpdate();
      if (orientationControls) orientationControls.update();
      cam.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function resizeUpdate() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width !== canvas.width || height !== canvas.height) {
        renderer.setSize(width, height, false);
      }
      camera.aspect = width / height;
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
      // Cleanup code
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default ARScene;
