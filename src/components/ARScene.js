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

    const arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: "webcam",
    });

    const onResize = () => {
      arToolkitSource.onResizeElement();
      arToolkitSource.copyElementSizeTo(renderer.domElement);
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    };

    arToolkitSource.init(() => {
      onResize();
    });

    window.addEventListener("resize", () => {
      onResize();
    });

    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: "data/camera_para.dat",
      detectionMode: "mono",
    });

    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    const markerRoot = new THREE.Group();
    scene.add(markerRoot);

    const markerControls = new THREEx.ArMarkerControls(
      arToolkitContext,
      markerRoot,
      {
        type: "pattern",
        patternUrl: "data/hiro.patt",
      }
    );

    const loader = new THREE.FontLoader();
    loader.load("fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeo = new THREE.TextGeometry("Hello, AR!", {
        font: font,
        size: 0.1,
        height: 0.01,
      });
      const textMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const textMesh = new THREE.Mesh(textGeo, textMat);
      textMesh.position.set(0, 0.05, 0);
      textMesh.rotation.x = -Math.PI / 2;
      markerRoot.add(textMesh);
    });

    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
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
