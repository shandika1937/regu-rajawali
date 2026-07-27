// ===== REGU RAJAWALI 1 - Three.js 3D Background =====

(function() {
    'use strict';

    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    const canvas = document.getElementById('three-bg');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // === Floating Geometric Shapes ===
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    // Create abstract shapes
    const geometries = [
        new THREE.IcosahedronGeometry(0.4, 0),
        new THREE.OctahedronGeometry(0.35, 0),
        new THREE.TorusGeometry(0.3, 0.12, 8, 16),
        new THREE.TetrahedronGeometry(0.35, 0),
        new THREE.DodecahedronGeometry(0.3, 0),
        new THREE.BoxGeometry(0.4, 0.4, 0.4)
    ];

    const colors = [0x00d4ff, 0x7c3aed, 0xffd700, 0x0088ff, 0x6c63ff, 0x00f5ff];

    for (let i = 0; i < 25; i++) {
        const geom = geometries[Math.floor(Math.random() * geometries.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.15 + Math.random() * 0.2,
            wireframe: Math.random() > 0.5
        });
        
        const mesh = new THREE.Mesh(geom, material);
        
        // Random position in 3D space
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 15;
        mesh.position.z = (Math.random() - 0.5) * 15 - 5;
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
        mesh.rotation.z = Math.random() * Math.PI * 2;
        
        // Store animation properties
        mesh.userData = {
            speed: 0.1 + Math.random() * 0.3,
            rotSpeedX: (Math.random() - 0.5) * 0.01,
            rotSpeedY: (Math.random() - 0.5) * 0.01,
            rotSpeedZ: (Math.random() - 0.5) * 0.01,
            floatOffset: Math.random() * Math.PI * 2,
            floatSpeed: 0.2 + Math.random() * 0.3,
            floatAmplitude: 0.3 + Math.random() * 0.5
        };
        
        shapesGroup.add(mesh);
    }

    // === Stars / Particles ===
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 50;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;

        const c = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
        starColors[i * 3] = c.r;
        starColors[i * 3 + 1] = c.g;
        starColors[i * 3 + 2] = c.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // === Central Glow ===
    const glowGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.08
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    glowSphere.position.z = -3;
    scene.add(glowSphere);

    // Additional glow rings
    const ringGeom = new THREE.RingGeometry(1.5, 2.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide,
        wireframe: true
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.z = -3;
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    const ring2 = new THREE.Mesh(ringGeom.clone(), ringMat.clone());
    ring2.material.color.setHex(0x7c3aed);
    ring2.material.opacity = 0.03;
    ring2.position.z = -2;
    ring2.rotation.x = -Math.PI / 4;
    ring2.scale.set(1.5, 1.5, 1.5);
    scene.add(ring2);

    camera.position.z = 8;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smooth mouse follow
        targetRotX += (mouseY * 0.05 - targetRotX) * 0.02;
        targetRotY += (mouseX * 0.05 - targetRotY) * 0.02;

        shapesGroup.rotation.x = targetRotX;
        shapesGroup.rotation.y = targetRotY;

        // Animate individual shapes
        shapesGroup.children.forEach((mesh, i) => {
            const data = mesh.userData;
            mesh.rotation.x += data.rotSpeedX;
            mesh.rotation.y += data.rotSpeedY;
            mesh.rotation.z += data.rotSpeedZ;
            
            // Floating motion
            const floatY = Math.sin(time * data.floatSpeed + data.floatOffset) * data.floatAmplitude;
            mesh.position.y += (mesh.position.y + floatY - mesh.position.y) * 0.01;
        });

        // Rotate stars slowly
        stars.rotation.y += 0.0003;
        stars.rotation.x += 0.0001;

        // Pulse glow sphere
        glowSphere.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
        glowSphere.material.opacity = 0.06 + Math.sin(time * 2) * 0.03;

        // Rotate rings
        ring.rotation.z += 0.002;
        ring2.rotation.z -= 0.003;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

})();
