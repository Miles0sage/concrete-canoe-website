/* PLUTO Jacks — Cosmos background
   Three.js starfield + nebula shader. Runs on fixed canvas #cosmos.
*/
(function () {
    if (!window.THREE) return;
    const canvas = document.getElementById('cosmos');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    // ---- Starfield ----
    const starCount = 3000;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const palette = [
        new THREE.Color(0xffffff),
        new THREE.Color(0xc4b5fd),
        new THREE.Color(0x67e8f9),
        new THREE.Color(0xfbbf24),
        new THREE.Color(0xf472b6),
    ];

    for (let i = 0; i < starCount; i++) {
        const r = 200 * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi) - 200;

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            varying float vSize;
            uniform float uTime;
            void main() {
                vColor = color;
                vSize = size;
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mv;
                float twinkle = 0.5 + 0.5 * sin(uTime * 2.0 + position.x * 0.3 + position.y * 0.7);
                gl_PointSize = size * (1.0 + twinkle * 0.6) * (300.0 / -mv.z);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                vec2 c = gl_PointCoord - 0.5;
                float d = length(c);
                if (d > 0.5) discard;
                float a = smoothstep(0.5, 0.0, d);
                a = pow(a, 1.6);
                gl_FragColor = vec4(vColor, a);
            }
        `,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ---- Nebula sprites (soft blurred quads) ----
    function makeNebulaTexture(color) {
        const sz = 256;
        const c = document.createElement('canvas');
        c.width = sz; c.height = sz;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2);
        g.addColorStop(0, color + 'cc');
        g.addColorStop(0.3, color + '55');
        g.addColorStop(1, color + '00');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, sz, sz);
        return new THREE.CanvasTexture(c);
    }

    const nebulae = [
        { tex: makeNebulaTexture('#a855f7'), x: -80, y: 40, z: -120, s: 140 },
        { tex: makeNebulaTexture('#22d3ee'), x: 90, y: -50, z: -150, s: 160 },
        { tex: makeNebulaTexture('#f472b6'), x: 20, y: 70, z: -180, s: 120 },
        { tex: makeNebulaTexture('#fbbf24'), x: -50, y: -60, z: -200, s: 100 },
    ];
    nebulae.forEach(n => {
        const m = new THREE.SpriteMaterial({ map: n.tex, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
        const s = new THREE.Sprite(m);
        s.position.set(n.x, n.y, n.z);
        s.scale.set(n.s, n.s, 1);
        scene.add(s);
    });

    // ---- Animation ----
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();
    function loop() {
        const t = clock.getElapsedTime();
        starMat.uniforms.uTime.value = t;
        stars.rotation.y = t * 0.015 + mouseX * 0.08;
        stars.rotation.x = t * 0.005 + mouseY * 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
