'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MetallicSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number>();
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Intersection Observer to pause animation when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          // If becoming visible again, resume animation
          if (entry.isIntersecting && !animationFrameRef.current) {
            animate();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance', // Prefer performance over quality
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio at 1.5
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create main sphere with metallic material (smaller)
    const geometry = new THREE.SphereGeometry(2.5, 32, 32); // Reduced from 48x48 to 32x32
    
    // Create organic noise texture for Damascus steel effect
    const canvas = document.createElement('canvas');
    canvas.width = 256; // Reduced from 512 to 256
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Generate organic flowing pattern like Damascus steel
    const imageData = ctx.createImageData(256, 256);
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const i = (y * 256 + x) * 4;
        
        // Create flowing, organic pattern
        const scale = 0.015;
        const noise1 = Math.sin(x * scale + Math.cos(y * scale * 0.5) * 3) * 0.5 + 0.5;
        const noise2 = Math.sin(y * scale * 1.3 + Math.cos(x * scale * 0.7) * 2) * 0.5 + 0.5;
        const noise3 = Math.sin((x + y) * scale * 0.8) * 0.5 + 0.5;
        
        // Combine noises for Damascus steel effect
        const combined = (noise1 * 0.4 + noise2 * 0.4 + noise3 * 0.2);
        const value = Math.floor(combined * 120 + 100); // 100-220 range for variation
        
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    
    const noiseTexture = new THREE.CanvasTexture(canvas);
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;
    noiseTexture.repeat.set(2, 2); // Make pattern larger/more visible
    
    // Darker metallic material with surface variation
    const material = new THREE.MeshStandardMaterial({
      color: 0x8B7355, // Darker bronze/gold color
      metalness: 1,
      roughness: 0.3,
      roughnessMap: noiseTexture, // Surface variation
      envMapIntensity: 1.5,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Create smaller droplet spheres around the main sphere
    const droplets: THREE.Mesh[] = [];
    const dropletData = [
      // Medium droplets
      { size: 0.4, x: 4, y: 1.5, z: 2, speedX: 0.4, speedY: 0.3 },
      { size: 0.25, x: -3.5, y: -1, z: 1.5, speedX: 0.5, speedY: 0.4 },
      { size: 0.35, x: 2, y: -2, z: -1, speedX: 0.35, speedY: 0.45 },
      { size: 0.3, x: -2.5, y: 2, z: 2.5, speedX: 0.45, speedY: 0.35 },
      { size: 0.2, x: 3, y: -1.5, z: 3, speedX: 0.38, speedY: 0.42 },
      // Tiny droplets scattered around
      { size: 0.12, x: -5, y: 3, z: 1, speedX: 0.3, speedY: 0.25 },
      { size: 0.1, x: 5.5, y: -2.5, z: 2, speedX: 0.32, speedY: 0.28 },
      { size: 0.15, x: -4, y: -3, z: 0.5, speedX: 0.28, speedY: 0.33 },
      { size: 0.08, x: 6, y: 2, z: 1.5, speedX: 0.35, speedY: 0.3 },
      { size: 0.13, x: -6, y: 0, z: 2.5, speedX: 0.27, speedY: 0.31 },
      { size: 0.11, x: 4.5, y: 3.5, z: 0, speedX: 0.33, speedY: 0.29 },
      { size: 0.09, x: -3, y: -4, z: 3, speedX: 0.31, speedY: 0.26 },
      { size: 0.14, x: 5, y: 0.5, z: -1, speedX: 0.29, speedY: 0.34 },
      { size: 0.1, x: -5.5, y: -2, z: -0.5, speedX: 0.36, speedY: 0.27 },
      { size: 0.12, x: 3.5, y: -3.5, z: 1.5, speedX: 0.34, speedY: 0.32 },
    ];

    dropletData.forEach((data) => {
      const dropletGeometry = new THREE.SphereGeometry(data.size, 12, 12); // Reduced from 16x16 to 12x12 for small droplets
      const dropletMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        metalness: 1,
        roughness: 0.3,
        roughnessMap: noiseTexture,
        envMapIntensity: 1.5,
      });
      const droplet = new THREE.Mesh(dropletGeometry, dropletMaterial);
      droplet.position.set(data.x, data.y, data.z);
      droplet.userData = { 
        originalX: data.x, 
        originalY: data.y, 
        originalZ: data.z,
        speedX: data.speedX,
        speedY: data.speedY,
        originalPositions: new Float32Array(dropletGeometry.attributes.position.array)
      };
      scene.add(droplet);
      droplets.push(droplet);
    });

    // Create "Sun" behind the sphere (eclipse effect)
    const sunGeometry = new THREE.SphereGeometry(4, 16, 16); // Reduced from 24x24 to 16x16
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFE5B4,
      transparent: true,
      opacity: 0.6,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, -8); // Behind the sphere
    scene.add(sun);

    // Sun glow effect
    const glowGeometry = new THREE.SphereGeometry(5, 16, 16); // Reduced from 24x24 to 16x16
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.2,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(0, 0, -8);
    scene.add(glow);

    // Lighting setup for solar eclipse effect
    
    // Very dim ambient light
    const ambientLight = new THREE.AmbientLight(0x1a1a1a, 0.1);
    scene.add(ambientLight);

    // Main "Sun" light - this will rotate around the sphere
    const sunLight = new THREE.DirectionalLight(0xFFE5B4, 3);
    sunLight.position.set(10, 0, 5);
    scene.add(sunLight);

    // Secondary sun light for more dramatic effect
    const sunLight2 = new THREE.PointLight(0xFFD700, 2, 100);
    sunLight2.position.set(10, 0, 5);
    scene.add(sunLight2);

    // Strong rim light on the opposite side for edge glow (eclipse corona effect)
    const rimLight = new THREE.DirectionalLight(0xFFE5B4, 2);
    rimLight.position.set(-10, 0, -5);
    scene.add(rimLight);

    // Additional rim lights for stronger edge definition (corona rays)
    const rimLight2 = new THREE.PointLight(0xFFD700, 1.5, 50);
    rimLight2.position.set(-10, 3, -5);
    scene.add(rimLight2);

    const rimLight3 = new THREE.PointLight(0xFFE5B4, 1.5, 50);
    rimLight3.position.set(-10, -3, -5);
    scene.add(rimLight3);

    // Light rays effect - subtle side lights that pulse
    const rayLight1 = new THREE.PointLight(0xFFE5B4, 0, 80);
    rayLight1.position.set(15, 5, 0);
    scene.add(rayLight1);

    const rayLight2 = new THREE.PointLight(0xFFD700, 0, 80);
    rayLight2.position.set(15, -5, 0);
    scene.add(rayLight2);

    // Animation variables
    let time = 0;
    const orbitRadius = 12; // Distance of light from sphere
    const orbitSpeed = 0.3; // Speed of light rotation

    // Store original positions for deformation
    const positionAttribute = geometry.attributes.position;
    const originalPositions = new Float32Array(positionAttribute.array);

    // Animation loop - sphere rotates slowly, light orbits around it
    const animate = () => {
      // Only continue animation if visible
      if (!isVisibleRef.current) {
        animationFrameRef.current = undefined;
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.005;

      // Slow rotation of sphere around Y axis (like Earth rotating)
      // This creates the effect of surface moving under the light
      sphere.rotation.y += 0.001;

      // Liquid deformation effect
      const positions = positionAttribute.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];

        // Create organic, flowing deformation
        const wave1 = Math.sin(x * 0.8 + time * 0.5) * 0.08;
        const wave2 = Math.cos(y * 0.7 + time * 0.6) * 0.08;
        const wave3 = Math.sin(z * 0.9 + time * 0.4) * 0.08;
        const wave4 = Math.cos((x + y + z) * 0.5 + time * 0.7) * 0.06;

        // Apply deformation
        const deformation = wave1 + wave2 + wave3 + wave4;
        const length = Math.sqrt(x * x + y * y + z * z);
        const normalizedX = x / length;
        const normalizedY = y / length;
        const normalizedZ = z / length;

        positions[i] = x + normalizedX * deformation;
        positions[i + 1] = y + normalizedY * deformation;
        positions[i + 2] = z + normalizedZ * deformation;
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals(); // Recalculate normals for proper lighting

      // Animate droplets - liquid deformation and floating (optimized - only every 3rd frame)
      if (Math.floor(time * 200) % 3 === 0) {
        droplets.forEach((droplet) => {
          const dropletGeometry = droplet.geometry as THREE.SphereGeometry;
          const dropletPositions = dropletGeometry.attributes.position.array;
          const originalDropletPositions = droplet.userData.originalPositions;

          // Apply liquid deformation to droplets
          for (let i = 0; i < dropletPositions.length; i += 3) {
            const x = originalDropletPositions[i];
            const y = originalDropletPositions[i + 1];
            const z = originalDropletPositions[i + 2];

            const wave1 = Math.sin(x * 1.5 + time * 0.7) * 0.06;
            const wave2 = Math.cos(y * 1.3 + time * 0.8) * 0.06;
            const wave3 = Math.sin(z * 1.4 + time * 0.6) * 0.06;

            const deformation = wave1 + wave2 + wave3;
            const length = Math.sqrt(x * x + y * y + z * z);
            const normalizedX = x / length;
            const normalizedY = y / length;
            const normalizedZ = z / length;

            dropletPositions[i] = x + normalizedX * deformation;
            dropletPositions[i + 1] = y + normalizedY * deformation;
            dropletPositions[i + 2] = z + normalizedZ * deformation;
          }

          dropletGeometry.attributes.position.needsUpdate = true;
          dropletGeometry.computeVertexNormals();
        });
      }

      // Floating motion for droplets (every frame)
      droplets.forEach((droplet) => {
        const floatX = Math.sin(time * droplet.userData.speedX) * 0.3;
        const floatY = Math.cos(time * droplet.userData.speedY) * 0.4;
        const floatZ = Math.sin(time * droplet.userData.speedX * 0.7) * 0.2;

        droplet.position.x = droplet.userData.originalX + floatX;
        droplet.position.y = droplet.userData.originalY + floatY;
        droplet.position.z = droplet.userData.originalZ + floatZ;

        // Slow rotation
        droplet.rotation.y += 0.002;
        droplet.rotation.x += 0.001;
      });

      // Orbit the sun light around the sphere (like sun moving around Earth)
      const angle = time * orbitSpeed;
      const lightX = Math.cos(angle) * orbitRadius;
      const lightZ = Math.sin(angle) * orbitRadius;
      const lightY = Math.sin(angle * 0.5) * 3; // Slight vertical movement

      // Update both sun lights to same position
      sunLight.position.set(lightX, lightY, lightZ);
      sunLight2.position.set(lightX, lightY, lightZ);

      // Rim lights stay opposite to sun for edge glow
      rimLight.position.set(-lightX * 0.8, -lightY * 0.5, -lightZ * 0.8);
      rimLight2.position.set(-lightX * 0.9, lightY * 0.3 + 3, -lightZ * 0.9);
      rimLight3.position.set(-lightX * 0.9, lightY * 0.3 - 3, -lightZ * 0.9);

      // Light rays - pulse occasionally
      const rayPulse = Math.max(0, Math.sin(time * 0.8) * 0.5 + 0.3);
      rayLight1.intensity = rayPulse * 1.5;
      rayLight2.intensity = rayPulse * 1.2;
      
      // Position rays near the sun
      rayLight1.position.set(lightX * 1.2, lightY + 5, lightZ * 1.2);
      rayLight2.position.set(lightX * 1.2, lightY - 5, lightZ * 1.2);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose main sphere
      geometry.dispose();
      material.dispose();
      noiseTexture.dispose();
      
      // Dispose droplets
      droplets.forEach((droplet) => {
        droplet.geometry.dispose();
        (droplet.material as THREE.Material).dispose();
      });
      
      // Dispose sun
      sunGeometry.dispose();
      sunMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100%',
        opacity: 0.6,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
