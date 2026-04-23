/* PLUTO Jacks — 3D canoe hull viewer
   Procedural NURBS-esque canoe mesh rendered in a hull-stage canvas.
*/
(function () {
    if (!window.THREE) return;
    const stage = document.querySelector('[data-hull-stage]');
    if (!stage) return;

    const canvas = document.createElement('canvas');
    stage.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(5, 5, 8);
    camera.lookAt(0, 0, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0x6b4ecf, 0.6));
    const key = new THREE.DirectionalLight(0x22d3ee, 1.2);
    key.position.set(5, 8, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xf472b6, 0.8);
    rim.position.set(-6, 3, -4);
    scene.add(rim);
    const gold = new THREE.PointLight(0xfbbf24, 0.8, 20);
    gold.position.set(0, 2, 4);
    scene.add(gold);

    // Procedural hull geometry: parametric surface
    // length ~ 18 ft scaled to 10 units, beam ~ 30", depth ~ 14"
    const hull = new THREE.Group();

    // Hull C — "The Hybrid" — asymmetric conceptual (not to scale for readability)
    // sharp V-bow, flatter stern
    const hullGeo = buildHullGeometry({
        length: 8,
        beam: 1.9,
        depth: 0.85,
        rockerFwd: 0.35,
        rockerAft: 0.18,
        bowSharpness: 1.6,
        sternFlatness: 0.55,
        segLen: 72,
        segRing: 32,
    });

    // Wireframe hull
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
    });
    const wire = new THREE.Mesh(hullGeo, wireMat);
    hull.add(wire);

    // Glow solid hull (inner)
    const solidMat = new THREE.MeshPhongMaterial({
        color: 0x3a1f7a,
        emissive: 0x6b4ecf,
        emissiveIntensity: 0.55,
        shininess: 90,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
    });
    const solid = new THREE.Mesh(hullGeo, solidMat);
    solid.scale.set(0.985, 0.985, 0.985);
    hull.add(solid);

    // Accent edges (top rail) — match asymmetric beam + rocker
    const L = 8, BEAM = 1.9, DEPTH = 0.85, ROCK_FWD = 0.35, ROCK_AFT = 0.18;
    const railPts = [];
    for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const x = (0.5 - u) * L;
        const beamU = Math.sin(Math.PI * Math.min(1, u / 0.55) ** 0.9) *
                      Math.sin(Math.PI * Math.min(1, (1 - u) / 0.45) ** 1.1);
        const beamHere = BEAM * Math.max(0, beamU);
        const rocker = (u < 0.5)
            ? Math.pow((0.5 - u) * 2, 2.0) * ROCK_FWD
            : Math.pow((u - 0.5) * 2, 2.3) * ROCK_AFT;
        const y = DEPTH - rocker;
        railPts.push(new THREE.Vector3(x, y, beamHere / 2));
    }
    const railGeo = new THREE.BufferGeometry().setFromPoints(railPts);
    const railMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.9 });
    hull.add(new THREE.Line(railGeo, railMat));

    const railGeo2 = new THREE.BufferGeometry().setFromPoints(railPts.map(p => new THREE.Vector3(p.x, p.y, -p.z)));
    hull.add(new THREE.Line(railGeo2, railMat));

    hull.scale.set(1, 1.15, 1.2);  // slight depth + beam emphasis for readability at distance
    hull.position.y = -0.1;
    scene.add(hull);

    // Grid plane far below
    const grid = new THREE.GridHelper(30, 30, 0x6b4ecf, 0x1a0f3e);
    grid.position.y = -1.5;
    grid.material.transparent = true;
    grid.material.opacity = 0.15;
    scene.add(grid);

    // Ring of orbiting particles
    const ringGeo = new THREE.BufferGeometry();
    const ringCount = 200;
    const ringPos = new Float32Array(ringCount * 3);
    const ringAngles = [];
    for (let i = 0; i < ringCount; i++) {
        ringAngles.push(Math.random() * Math.PI * 2);
    }
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    const ringMat = new THREE.PointsMaterial({
        color: 0xf472b6,
        size: 0.06,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
    });
    const ringPoints = new THREE.Points(ringGeo, ringMat);
    scene.add(ringPoints);

    // Resize handling
    const ro = new ResizeObserver(() => resize());
    ro.observe(stage);
    function resize() {
        const w = stage.clientWidth;
        const h = stage.clientHeight || (w * 10 / 16);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    }
    resize();

    // Mouse drag rotation
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let targetRotY = -0.35, targetRotX = 0.32;
    let currentRotY = -0.35, currentRotX = 0.32;

    stage.addEventListener('pointerdown', (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
    window.addEventListener('pointerup', () => { isDragging = false; });
    window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        targetRotY += (e.clientX - lastX) * 0.005;
        targetRotX += (e.clientY - lastY) * 0.005;
        targetRotX = Math.max(-0.7, Math.min(0.7, targetRotX));
        lastX = e.clientX; lastY = e.clientY;
    });

    // Auto-spin + animate
    const clock = new THREE.Clock();
    function tick() {
        const t = clock.getElapsedTime();
        if (!isDragging) targetRotY += 0.003;
        currentRotY += (targetRotY - currentRotY) * 0.08;
        currentRotX += (targetRotX - currentRotX) * 0.08;
        hull.rotation.y = currentRotY;
        hull.rotation.x = currentRotX;

        // Animate ring
        for (let i = 0; i < ringCount; i++) {
            const a = ringAngles[i] + t * 0.3;
            const r = 7 + Math.sin(t * 0.5 + i) * 0.4;
            ringPos[i * 3] = Math.cos(a) * r;
            ringPos[i * 3 + 1] = Math.sin(t + i) * 0.3 - 0.5;
            ringPos[i * 3 + 2] = Math.sin(a) * r * 0.4;
        }
        ringGeo.attributes.position.needsUpdate = true;
        ringPoints.rotation.y = t * 0.1;

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
    tick();

    function buildHullGeometry({
        length, beam, depth,
        rockerFwd = 0.3, rockerAft = 0.15,
        bowSharpness = 1.8, sternFlatness = 0.5,
        segLen, segRing
    }) {
        // Asymmetric hull: bow (u=0) sharp V, stern (u=1) flatter, wider aft.
        // u runs from 0 (bow) to 1 (stern). Max beam aft of midship (~0.55).
        const verts = [];
        const idx = [];
        const uvs = [];

        for (let i = 0; i <= segLen; i++) {
            const u = i / segLen;
            const x = (0.5 - u) * length;  // bow at +x/2, stern at -x/2

            // Beam distribution: peaks around u=0.55 (just aft of midship)
            const beamU = Math.sin(Math.PI * Math.min(1, u / 0.55) ** 0.9) *
                          Math.sin(Math.PI * Math.min(1, (1 - u) / 0.45) ** 1.1);
            const beamHere = beam * Math.max(0, beamU);

            // Depth varies: deeper at midship
            const depthU = Math.sin(Math.PI * u) ** 0.8;
            const depthHere = depth * depthU;

            // Rocker: asymmetric (more bow rise than stern)
            const rocker = (u < 0.5)
                ? Math.pow((0.5 - u) * 2, 2.0) * rockerFwd
                : Math.pow((u - 0.5) * 2, 2.3) * rockerAft;
            const yTop = depth - rocker;

            // Cross-section shape morphs from sharp V (bow) to flat-bottom (stern)
            // Lerp factor: 0 at bow (sharp), 1 at stern (flat)
            const crossLerp = Math.pow(u, 1.4);

            for (let j = 0; j <= segRing; j++) {
                const v = j / segRing;
                const theta = Math.PI * v; // 0 → PI across the ring
                // Sharp V cross-section: y drops faster at center
                const vSharp = Math.pow(Math.sin(theta), bowSharpness);
                // Flat cross-section: y stays flat-ish across middle
                const vFlat = 1 - Math.pow(Math.abs(Math.cos(theta)), 1 / sternFlatness);
                const yProfile = vSharp * (1 - crossLerp) + vFlat * crossLerp;

                const y = yTop - depthHere * Math.max(0, yProfile);
                const z = (beamHere / 2) * Math.cos(theta);
                verts.push(x, y, z);
                uvs.push(u, v);
            }
        }
        for (let i = 0; i < segLen; i++) {
            for (let j = 0; j < segRing; j++) {
                const a = i * (segRing + 1) + j;
                const b = a + segRing + 1;
                idx.push(a, b, a + 1);
                idx.push(b, b + 1, a + 1);
            }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        g.setIndex(idx);
        g.computeVertexNormals();
        return g;
    }
})();
