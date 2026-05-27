/**
 * TablePID Landing Page
 * Gen-Z Optimized: GSAP + Three.js Full Overhaul
 */

document.addEventListener('DOMContentLoaded', () => {
  // Core inits
  setTimeout(() => initHeroThreeJS(), 50);
  setTimeout(() => initGlobalParticles(), 150);
  setTimeout(() => initScreenshotsThreeJS(), 250);
  initGSAP();
  initSmoothScroll();
  initMobileMenu();
  initNavbarScroll();
  initScreenshotsCarousel();
  initMagneticButtons();
  initCustomCursor();
  initTextScramble();
  initParallax();
});

/* ========================================
   CUSTOM CURSOR
   ======================================== */
function initCustomCursor() {
  if (window.innerWidth < 1024) return;
  
  const cursor = document.createElement('div');
  const cursorDot = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });
  
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Hover effects
  document.querySelectorAll('a, button, .btn, .thumb, .screenshot-nav-btn, .feature-card, .shortcut-card, .faq-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorDot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorDot.classList.remove('hover');
    });
  });
}

/* ========================================
   MAGNETIC BUTTONS
   ======================================== */
function initMagneticButtons() {
  if (window.innerWidth < 768) return;
  
  document.querySelectorAll('.btn-primary, .nav-github').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ========================================
   TEXT SCRAMBLE EFFECT
   ======================================== */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

function initTextScramble() {
  const heroTitle = document.querySelector('.title-gradient');
  if (!heroTitle) return;
  
  const phrases = [
    'Mulai bangun lebih cepat.',
    'SQL tanpa ribet.',
    'Database made easy.',
    'Ship faster today.',
  ];
  
  const scrambler = new TextScramble(heroTitle);
  let counter = 0;
  
  // Initial scramble
  setTimeout(() => {
    scrambler.setText(phrases[0]);
  }, 800);
  
  // Cycle phrases every 4s
  setInterval(() => {
    counter = (counter + 1) % phrases.length;
    scrambler.setText(phrases[counter]);
  }, 4000);
}

/* ========================================
   PARALLAX SCROLL
   ======================================== */
function initParallax() {
  gsap.registerPlugin(ScrollTrigger);
  
  // Hero parallax - only hero elements, no conflicts
  gsap.to('.hero-content', {
    y: 100,
    opacity: 0.3,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });
  
  gsap.to('.hero-gradient', {
    y: 200,
    scale: 1.5,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });
  
  // Section badges scale - safe, no conflict with scrollReveal
  document.querySelectorAll('.section-badge').forEach(badge => {
    ScrollTrigger.create({
      trigger: badge,
      start: 'top 90%',
      end: 'top 60%',
      scrub: 1,
      animation: gsap.fromTo(badge, 
        { scale: 0.85 }, 
        { scale: 1, ease: 'none' }
      ),
    });
  });
}

/* ========================================
   THREE.JS - Hero Particle Vortex
   ======================================== */
function initHeroThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) {
    canvas.style.display = 'none';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: false,
    powerPreference: 'low-power'
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // --- Particle Vortex ---
  const particleCount = 500;
  const vortexGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1 + Math.random() * 4;
    const y = (Math.random() - 0.5) * 6;
    
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    
    // Purple to cyan gradient
    const t = Math.random();
    colors[i * 3] = 0.55 + t * 0.2;     // R
    colors[i * 3 + 1] = 0.36 - t * 0.1;  // G
    colors[i * 3 + 2] = 0.96 + t * 0.04; // B
    
    sizes[i] = 0.02 + Math.random() * 0.04;
  }
  
  vortexGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  vortexGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  vortexGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const vortexMaterial = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  
  const vortex = new THREE.Points(vortexGeo, vortexMaterial);
  scene.add(vortex);
  
  // --- Neural Network Nodes ---
  const nodes = [];
  const nodeCount = 6;
  const nodePositions = [
    { x: -3, y: 1, z: -2 },
    { x: 3, y: -0.5, z: -2.5 },
    { x: -1.5, y: -1.5, z: -3 },
    { x: 2, y: 1.5, z: -1.5 },
    { x: 0, y: 0.5, z: -2 },
    { x: -2, y: -0.8, z: -1.5 },
  ];
  
  const nodeColors = [0x8b5cf6, 0x3b82f6, 0x22d3ee, 0xa78bfa, 0x60a5fa, 0x06b6d4];
  
  for (let i = 0; i < nodeCount; i++) {
    const geo = new THREE.IcosahedronGeometry(0.15 + Math.random() * 0.1, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: nodeColors[i],
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const node = new THREE.Mesh(geo, mat);
    node.position.set(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
    node.userData = {
      originalY: nodePositions[i].y,
      originalX: nodePositions[i].x,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    };
    scene.add(node);
    nodes.push(node);
  }
  
  // --- Glowing Connections ---
  const connectionMaterial = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.08,
  });
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const geo = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
      scene.add(new THREE.Line(geo, connectionMaterial));
    }
  }
  
  // --- Floating Rings ---
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.RingGeometry(1.5 + i * 0.8, 1.55 + i * 0.8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.05 + i * 0.02,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + i * 0.3;
    ring.rotation.z = i * 0.5;
    ring.position.z = -2;
    scene.add(ring);
    rings.push(ring);
  }
  
  camera.position.z = 5;
  
  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  
  // Throttled animation
  let lastTime = 0;
  const targetFPS = 30;
  const frameInterval = 1000 / targetFPS;
  
  function animate(currentTime) {
    requestAnimationFrame(animate);
    
    const delta = currentTime - lastTime;
    if (delta < frameInterval) return;
    lastTime = currentTime - (delta % frameInterval);
    
    const time = currentTime * 0.001;
    
    // Rotate vortex
    vortex.rotation.y += 0.002;
    vortex.rotation.x = Math.sin(time * 0.2) * 0.1;
    
    // Animate positions in vortex
    const pos = vortex.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const angle = Math.atan2(pos[idx + 2], pos[idx]) + 0.003;
      const radius = Math.sqrt(pos[idx] ** 2 + pos[idx + 2] ** 2);
      pos[idx] = Math.cos(angle) * radius;
      pos[idx + 2] = Math.sin(angle) * radius;
      pos[idx + 1] += Math.sin(time + i * 0.1) * 0.001;
    }
    vortex.geometry.attributes.position.needsUpdate = true;
    
    // Animate nodes
    nodes.forEach(node => {
      node.rotation.x += 0.008;
      node.rotation.y += 0.012;
      node.position.y = node.userData.originalY + Math.sin(time * node.userData.speed + node.userData.phase) * 0.3;
      node.position.x = node.userData.originalX + Math.cos(time * node.userData.speed * 0.7 + node.userData.phase) * 0.15;
    });
    
    // Animate rings
    rings.forEach((ring, i) => {
      ring.rotation.z += 0.002 * (i + 1);
      ring.rotation.x = Math.PI / 2 + Math.sin(time * 0.3 + i) * 0.2;
    });
    
    // Camera follows mouse
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -2);
    
    renderer.render(scene, camera);
  }
  
  animate(0);
  
  // Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 200);
  });
}

/* ========================================
   THREE.JS - Global Floating Particles
   ======================================== */
function initGlobalParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;
  
  const canvas = document.createElement('canvas');
  canvas.id = 'global-particles';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4;';
  document.body.prepend(canvas);
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1);
  
  const count = 80;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    
    const c = new THREE.Color().setHSL(0.7 + Math.random() * 0.15, 0.7, 0.6);
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  
  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  }));
  scene.add(points);
  
  camera.position.z = 5;
  
  let lastTime = 0;
  function animate(t) {
    requestAnimationFrame(animate);
    if (t - lastTime < 33) return; // ~30fps
    lastTime = t;
    
    points.rotation.y += 0.0003;
    points.rotation.x += 0.0001;
    
    const positions = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += Math.sin(t * 0.001 + i) * 0.002;
    }
    geo.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
  }
  animate(0);
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ========================================
   THREE.JS - Screenshots Section
   ======================================== */
function initScreenshotsThreeJS() {
  // This is now handled by the global particles + CSS effects
  // Keeping for backward compatibility but making it a subtle glow
  const canvas = document.getElementById('screenshots-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;

  const section = document.getElementById('screenshots');
  const rect = section.getBoundingClientRect();
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, rect.width / rect.height, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setSize(rect.width, rect.height);
  renderer.setPixelRatio(1);
  
  // Floating shapes
  const shapes = [];
  const geos = [
    new THREE.IcosahedronGeometry(0.12, 0),
    new THREE.OctahedronGeometry(0.1, 0),
    new THREE.TetrahedronGeometry(0.08, 0),
  ];
  
  for (let i = 0; i < 12; i++) {
    const g = geos[Math.floor(Math.random() * geos.length)];
    const m = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.72 + Math.random() * 0.12, 0.6, 0.5),
      wireframe: true,
      transparent: true,
      opacity: 0.12 + Math.random() * 0.1,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4 - 2
    );
    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.015,
      ry: (Math.random() - 0.5) * 0.015,
      fs: 0.3 + Math.random() * 0.4,
      fp: Math.random() * Math.PI * 2,
      oy: mesh.position.y,
    };
    scene.add(mesh);
    shapes.push(mesh);
  }
  
  camera.position.z = 5;
  
  let lastTime = 0;
  function animate(t) {
    requestAnimationFrame(animate);
    if (t - lastTime < 33) return;
    lastTime = t;
    const time = t * 0.001;
    
    shapes.forEach(s => {
      s.rotation.x += s.userData.rx;
      s.rotation.y += s.userData.ry;
      s.position.y = s.userData.oy + Math.sin(time * s.userData.fs + s.userData.fp) * 0.3;
    });
    
    renderer.render(scene, camera);
  }
  animate(0);
  
  const ro = new ResizeObserver(() => {
    const nr = section.getBoundingClientRect();
    camera.aspect = nr.width / nr.height;
    camera.updateProjectionMatrix();
    renderer.setSize(nr.width, nr.height);
  });
  ro.observe(section);
}

/* ========================================
   GSAP ANIMATIONS
   ======================================== */
function initGSAP() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-buttons, .hero-databases').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  
  initHeroAnimations();
  initScrollReveal();
  initHoverEffects();
}

/* Hero Animations - Cinematic */
function initHeroAnimations() {
  const tl = gsap.timeline({ 
    defaults: { ease: 'power3.out' },
    delay: 0.2
  });
  
  tl.from('.hero-badge', {
    opacity: 0,
    scale: 0.5,
    y: 30,
    duration: 0.7,
    ease: 'back.out(2)',
  })
  .from('.hero-title .title-line', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power4.out',
  }, '-=0.3')
  .from('.hero-title .title-gradient', {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.8,
  }, '-=0.5')
  .from('.hero-description', {
    opacity: 0,
    y: 30,
    duration: 0.6,
  }, '-=0.4')
  .from('.hero-buttons .btn', {
    opacity: 0,
    y: 25,
    scale: 0.9,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.5)',
  }, '-=0.3')
  .from('.hero-databases', {
    opacity: 0,
    y: 20,
    duration: 0.5,
  }, '-=0.2')
  .from('.db-badge', {
    opacity: 0,
    scale: 0.7,
    y: 10,
    duration: 0.4,
    stagger: 0.06,
    ease: 'back.out(2)',
  }, '-=0.3');
  
  // Floating badge pulse
  gsap.to('.badge-dot', {
    scale: 1.5,
    opacity: 0.3,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

/* Scroll Reveal */
function initScrollReveal() {
  // --- Feature cards ---
  gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 40, scale: 0.97, rotateX: -5 });
    
    ScrollTrigger.create({
      trigger: card,
      start: 'top 92%',
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.7,
          delay: (i % 3) * 0.08,
          ease: 'power3.out',
        });
      },
      once: true,
    });
  });
  
  // --- Shortcut cards ---
  gsap.utils.toArray('.shortcut-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 25, scale: 0.9 });
    
    ScrollTrigger.create({
      trigger: card,
      start: 'top 92%',
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          delay: (i % 3) * 0.06,
          ease: 'back.out(1.8)',
        });
      },
      once: true,
    });
  });
  
  // --- FAQ items ---
  gsap.utils.toArray('.faq-item').forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 25 });
    
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: (i % 2) * 0.08,
          ease: 'power3.out',
        });
      },
      once: true,
    });
  });
  
  // --- Timeline items ---
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.set(item, { opacity: 0, x: i % 2 === 0 ? -40 : 40 });
    
    ScrollTrigger.create({
      trigger: item,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(item, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power3.out',
        });
      },
      once: true,
    });
  });
  
  // --- Compare cards ---
  const compareOld = document.querySelector('.compare-card.old');
  const compareNew = document.querySelector('.compare-card.new');
  const compareVs = document.querySelector('.compare-vs');
  
  if (compareOld) {
    gsap.set(compareOld, { opacity: 0, x: -60 });
    ScrollTrigger.create({
      trigger: '.compare-grid',
      start: 'top 85%',
      onEnter: () => {
        gsap.to(compareOld, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
      },
      once: true,
    });
  }
  
  if (compareNew) {
    gsap.set(compareNew, { opacity: 0, x: 60 });
    ScrollTrigger.create({
      trigger: '.compare-grid',
      start: 'top 85%',
      onEnter: () => {
        gsap.to(compareNew, { opacity: 1, x: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' });
      },
      once: true,
    });
  }
  
  if (compareVs) {
    gsap.set(compareVs, { opacity: 0, scale: 0, rotation: 180 });
    ScrollTrigger.create({
      trigger: '.compare-grid',
      start: 'top 85%',
      onEnter: () => {
        gsap.to(compareVs, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, delay: 0.2, ease: 'back.out(2)' });
      },
      once: true,
    });
  }
  
  // --- Download section ---
  const downloadContent = document.querySelector('.download-content');
  if (downloadContent) {
    gsap.set(downloadContent, { opacity: 0, scale: 0.95, y: 30 });
    
    ScrollTrigger.create({
      trigger: '.download',
      start: 'top 80%',
      onEnter: () => {
        gsap.to(downloadContent, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      },
      once: true,
    });
  }
  
  // --- Section headers ---
  document.querySelectorAll('.section-header').forEach(header => {
    const children = header.children;
    gsap.set(children, { opacity: 0, y: 25 });
    
    ScrollTrigger.create({
      trigger: header,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
        });
      },
      once: true,
    });
  });
  
  // Screenshots viewer
  const viewer = document.querySelector('.screenshot-viewer');
  if (viewer) {
    gsap.set(viewer, { opacity: 0, y: 60, rotateX: 8, scale: 0.95 });
    
    ScrollTrigger.create({
      trigger: viewer,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(viewer, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          ease: 'power4.out',
        });
      },
      once: true,
    });
  }
  
  // Thumbnails stagger
  const thumbs = document.querySelector('.screenshot-thumbs');
  if (thumbs) {
    gsap.set(thumbs, { opacity: 0, y: 20 });
    
    ScrollTrigger.create({
      trigger: thumbs,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(thumbs, { opacity: 1, y: 0, duration: 0.5, delay: 0.4, ease: 'power2.out' });
        gsap.from('.thumb', {
          opacity: 0,
          scale: 0.7,
          y: 15,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.5,
          ease: 'back.out(2)',
        });
      },
      once: true,
    });
  }
  
  // AI section
  const aiSection = document.querySelector('.ai-content');
  if (aiSection) {
    gsap.set('.ai-text', { opacity: 0, x: -50 });
    gsap.set('.ai-demo', { opacity: 0, x: 50, rotateY: -10 });
    
    ScrollTrigger.create({
      trigger: aiSection,
      start: 'top 80%',
      onEnter: () => {
        gsap.to('.ai-text', { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
        gsap.to('.ai-demo', { opacity: 1, x: 0, rotateY: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' });
      },
      once: true,
    });
  }
  
  // Demo typing animation
  const demoCode = document.querySelector('.demo-code code');
  if (demoCode) {
    const fullText = demoCode.textContent;
    demoCode.textContent = '';
    
    ScrollTrigger.create({
      trigger: demoCode,
      start: 'top 85%',
      onEnter: () => {
        let i = 0;
        const typeInterval = setInterval(() => {
          demoCode.textContent += fullText[i];
          i++;
          if (i >= fullText.length) clearInterval(typeInterval);
        }, 25);
      },
      once: true,
    });
  }
}

/* Hover Effects */
function initHoverEffects() {
  // Feature cards glow
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { 
        scale: 1.03, 
        boxShadow: '0 0 30px rgba(139, 92, 246, 0.15), 0 20px 40px rgba(0,0,0,0.3)',
        duration: 0.35, 
        ease: 'power2.out' 
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { 
        scale: 1, 
        boxShadow: '0 0 0px rgba(139, 92, 246, 0), 0 0 0px rgba(0,0,0,0)',
        duration: 0.35, 
        ease: 'power2.out' 
      });
    });
  });
  
  // Thumbnail bounce
  document.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('mouseenter', () => {
      gsap.to(thumb, { scale: 1.1, y: -6, duration: 0.3, ease: 'back.out(2)' });
    });
    thumb.addEventListener('mouseleave', () => {
      gsap.to(thumb, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    });
  });
  
  // Shortcut cards
  document.querySelectorAll('.shortcut-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.05, y: -4, duration: 0.3, ease: 'back.out(1.5)' });
      gsap.to(card.querySelector('kbd'), { scale: 1.1, duration: 0.2, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to(card.querySelector('kbd'), { scale: 1, duration: 0.2, ease: 'power2.out' });
    });
  });
  
  // FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item, { 
        x: 8, 
        borderColor: 'rgba(139, 92, 246, 0.5)',
        duration: 0.3, 
        ease: 'power2.out' 
      });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item, { 
        x: 0, 
        borderColor: 'rgba(39, 39, 42, 1)',
        duration: 0.3, 
        ease: 'power2.out' 
      });
    });
  });
  
  // DB badges
  document.querySelectorAll('.db-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      gsap.to(badge, { scale: 1.1, y: -3, duration: 0.25, ease: 'back.out(2)' });
    });
    badge.addEventListener('mouseleave', () => {
      gsap.to(badge, { scale: 1, y: 0, duration: 0.25, ease: 'power2.out' });
    });
  });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenu');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

/* ========================================
   NAVBAR SCROLL
   ======================================== */
function initNavbarScroll() {
  const nav = document.querySelector('.nav');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset > 50;
        nav.style.background = scrolled ? 'rgba(9, 9, 11, 0.95)' : 'rgba(9, 9, 11, 0.6)';
        nav.style.boxShadow = scrolled ? '0 4px 30px rgba(139, 92, 246, 0.1)' : 'none';
        nav.style.borderBottomColor = scrolled ? 'rgba(139, 92, 246, 0.15)' : 'rgba(39, 39, 42, 1)';
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ========================================
   LIGHTBOX
   ======================================== */
function openLightbox(src, caption) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  lightboxImg.src = src;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  gsap.fromTo(lightbox, 
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: 'power2.out' }
  );
  gsap.fromTo(lightboxImg,
    { scale: 0.7, opacity: 0, rotateY: 15 },
    { scale: 1, opacity: 1, rotateY: 0, duration: 0.6, delay: 0.1, ease: 'back.out(1.2)' }
  );
  gsap.fromTo(lightboxCaption,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, delay: 0.3, ease: 'power2.out' }
  );
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  
  gsap.to(lightbox, {
    opacity: 0,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ========================================
   SCREENSHOT CAROUSEL
   ======================================== */
let currentSlide = 0;
let isTransitioning = false;
const totalSlides = 5;

function initScreenshotsCarousel() {
  setInterval(() => {
    if (!isTransitioning) nextScreenshot();
  }, 5000);
  
  document.querySelectorAll('.screenshot-slide img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });
  
  // Mouse tilt on viewer
  const viewer = document.querySelector('.screenshot-viewer');
  if (viewer && window.innerWidth >= 768) {
    viewer.addEventListener('mousemove', (e) => {
      const rect = viewer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(viewer, {
        rotateY: x * 6,
        rotateX: -y * 4,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
    
    viewer.addEventListener('mouseleave', () => {
      gsap.to(viewer, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  }
}

function goToScreenshot(index) {
  if (index === currentSlide || isTransitioning) return;
  isTransitioning = true;
  
  const slides = document.querySelectorAll('.screenshot-slide');
  const thumbs = document.querySelectorAll('.thumb');
  
  gsap.to(slides[currentSlide], {
    opacity: 0,
    scale: 1.08,
    filter: 'blur(4px)',
    duration: 0.45,
    ease: 'power2.in',
  });
  
  gsap.fromTo(slides[index],
    { opacity: 0, scale: 0.92, filter: 'blur(4px)' },
    { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)',
      duration: 0.55, 
      delay: 0.15,
      ease: 'power3.out',
      onComplete: () => {
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        currentSlide = index;
        isTransitioning = false;
      }
    }
  );
  
  thumbs.forEach(t => t.classList.remove('active'));
  thumbs[index].classList.add('active');
  
  gsap.fromTo(thumbs[index],
    { scale: 0.85 },
    { scale: 1, duration: 0.4, ease: 'back.out(2.5)' }
  );
}

function nextScreenshot() {
  goToScreenshot((currentSlide + 1) % totalSlides);
}

function prevScreenshot() {
  goToScreenshot((currentSlide - 1 + totalSlides) % totalSlides);
}
