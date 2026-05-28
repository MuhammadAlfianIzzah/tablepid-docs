/**
 * TablePID — Premium Landing Experience
 * Three.js + GSAP Motion System
 */

(function () {
  'use strict';

  // ============================================================
  // INIT
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
  });

  function initApp() {
    initCursor();
    initNav();
    initMobileMenu();
    initScrollProgress();
    initHeroThreeJS();
    initGSAP();
    initCarousel();
    initMagnetic();
    initSmoothScroll();
    initTextSwap();
  }

  // ============================================================
  // LOADER
  // ============================================================
  function initLoader() {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loaderBar');
    const status = document.getElementById('loaderStatus');
    if (!loader) { initApp(); return; }

    const steps = [
      { pct: 20, label: 'Memuat aset...' },
      { pct: 50, label: 'Membangun scene 3D...' },
      { pct: 75, label: 'Menyiapkan animasi...' },
      { pct: 100, label: 'Siap.' },
    ];

    let i = 0;
    function step() {
      if (i >= steps.length) {
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
          initApp();
        }, 300);
        return;
      }
      bar.style.width = steps[i].pct + '%';
      status.textContent = steps[i].label;
      i++;
      setTimeout(step, 250 + Math.random() * 200);
    }

    document.body.style.overflow = 'hidden';
    step();

    // Safety fallback
    setTimeout(() => {
      if (!loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initApp();
      }
    }, 3000);
  }

  // ============================================================
  // CURSOR
  // ============================================================
  function initCursor() {
    if (window.innerWidth < 1024) return;

    const c = document.getElementById('cursor');
    const d = document.getElementById('cursorDot');
    if (!c || !d) return;

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      d.style.left = mx + 'px';
      d.style.top = my + 'px';
    });

    (function loop() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      c.style.left = cx + 'px';
      c.style.top = cy + 'px';
      requestAnimationFrame(loop);
    })();

    const targets = document.querySelectorAll('a, button, .btn, .thumb, .feature-card, .faq-item, .compare-card, .roadmap-card');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => { c.classList.add('hover'); d.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { c.classList.remove('hover'); d.classList.remove('hover'); });
    });
  }

  // ============================================================
  // NAV
  // ============================================================
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.pageYOffset > 40);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ============================================================
  // MOBILE MENU
  // ============================================================
  function initMobileMenu() {
    const burger = document.getElementById('navBurger');
    const overlay = document.getElementById('mobileOverlay');
    if (!burger || !overlay) return;

    burger.addEventListener('click', () => {
      const active = burger.classList.toggle('active');
      overlay.classList.toggle('active', active);
      document.body.style.overflow = active ? 'hidden' : '';
      burger.setAttribute('aria-expanded', active);
    });

    overlay.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // SCROLL PROGRESS
  // ============================================================
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = (scrollTop / scrollHeight) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ============================================================
  // MAGNETIC BUTTONS
  // ============================================================
  function initMagnetic() {
    if (window.innerWidth < 768 || typeof gsap === 'undefined') return;

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - 72;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================================
  // TEXT SWAP (Hero accent word)
  // ============================================================
  function initTextSwap() {
    const el = document.getElementById('heroAccent');
    if (!el) return;

    const words = ['cerdas', 'cepat', 'cantik', 'gratis', 'modern'];
    let idx = 0;

    function swap() {
      idx = (idx + 1) % words.length;
      gsap.to(el, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          el.textContent = words[idx];
          gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
        }
      });
    }

    setInterval(swap, 3000);
  }

  // ============================================================
  // THREE.JS — Hero Scene
  // ============================================================
  function initHeroThreeJS() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      canvas.style.display = 'none';
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // --- Particle Field ---
    const pCount = isMobile ? 200 : 600;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    const pVel = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const i3 = i * 3;
      pPos[i3] = (Math.random() - 0.5) * 30;
      pPos[i3 + 1] = (Math.random() - 0.5) * 20;
      pPos[i3 + 2] = (Math.random() - 0.5) * 20 - 5;

      const t = Math.random();
      pCol[i3] = 0.55 + t * 0.2;
      pCol[i3 + 1] = 0.3 - t * 0.15;
      pCol[i3 + 2] = 0.96 + t * 0.04;

      pVel[i3] = (Math.random() - 0.5) * 0.002;
      pVel[i3 + 1] = (Math.random() - 0.5) * 0.002;
      pVel[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: isMobile ? 0.02 : 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // --- Database Nodes (floating icosahedrons) ---
    const nodes = [];
    const nodeData = [
      { pos: [-4, 2, -6], color: 0x8b5cf6, size: 0.2 },
      { pos: [4, -1, -7], color: 0x3b82f6, size: 0.18 },
      { pos: [-2, -2, -5], color: 0x22d3ee, size: 0.15 },
      { pos: [3, 2.5, -8], color: 0xa78bfa, size: 0.16 },
      { pos: [0, 0.5, -4], color: 0x60a5fa, size: 0.22 },
      { pos: [-3, -0.5, -9], color: 0x06b6d4, size: 0.14 },
      { pos: [5, -2, -6], color: 0x8b5cf6, size: 0.12 },
      { pos: [-5, 1, -7], color: 0xec4899, size: 0.13 },
    ];

    nodeData.forEach((d, i) => {
      const geo = new THREE.IcosahedronGeometry(d.size, 1);
      const mat = new THREE.MeshBasicMaterial({
        color: d.color,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...d.pos);
      mesh.userData = {
        oy: d.pos[1],
        ox: d.pos[0],
        speed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: 0.005 + Math.random() * 0.01,
      };
      scene.add(mesh);
      nodes.push(mesh);
    });

    // --- Connection Lines ---
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.06,
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 8) {
          const geo = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position,
          ]);
          scene.add(new THREE.Line(geo, lineMat));
        }
      }
    }

    // --- Orbital Rings ---
    const rings = [];
    for (let i = 0; i < 4; i++) {
      const rGeo = new THREE.RingGeometry(2 + i * 1.2, 2.02 + i * 1.2, 80);
      const rMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x8b5cf6 : 0x22d3ee,
        transparent: true,
        opacity: 0.03 + i * 0.01,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI / 2 + i * 0.4;
      ring.rotation.z = i * 0.6;
      ring.position.z = -6;
      scene.add(ring);
      rings.push(ring);
    }

    // --- Holographic Grid Plane ---
    const gridGeo = new THREE.PlaneGeometry(40, 40, 40, 40);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.02,
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -4;
    grid.position.z = -5;
    scene.add(grid);

    camera.position.z = 6;

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Throttled animation loop
    let lastTime = 0;
    const interval = 1000 / 30; // ~30fps

    function animate(now) {
      requestAnimationFrame(animate);
      const delta = now - lastTime;
      if (delta < interval) return;
      lastTime = now - (delta % interval);

      const t = now * 0.001;

      // Particles drift
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        const i3 = i * 3;
        pos[i3] += pVel[i3];
        pos[i3 + 1] += pVel[i3 + 1] + Math.sin(t + i * 0.05) * 0.001;
        pos[i3 + 2] += pVel[i3 + 2];

        // Wrap around
        if (pos[i3] > 15) pos[i3] = -15;
        if (pos[i3] < -15) pos[i3] = 15;
        if (pos[i3 + 1] > 10) pos[i3 + 1] = -10;
        if (pos[i3 + 1] < -10) pos[i3 + 1] = 10;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Particles slow rotation
      particles.rotation.y += 0.0003;
      particles.rotation.x = Math.sin(t * 0.1) * 0.05;

      // Nodes float and rotate
      nodes.forEach(n => {
        n.rotation.x += n.userData.rotSpeed;
        n.rotation.y += n.userData.rotSpeed * 1.3;
        n.position.y = n.userData.oy + Math.sin(t * n.userData.speed + n.userData.phase) * 0.4;
        n.position.x = n.userData.ox + Math.cos(t * n.userData.speed * 0.6 + n.userData.phase) * 0.2;
      });

      // Rings orbit
      rings.forEach((r, i) => {
        r.rotation.z += 0.001 * (i + 1);
        r.rotation.x = Math.PI / 2 + Math.sin(t * 0.2 + i) * 0.15;
      });

      // Grid wave
      const gPos = gridGeo.attributes.position.array;
      for (let i = 0; i < gPos.length; i += 3) {
        const x = gPos[i];
        const y = gPos[i + 1];
        gPos[i + 2] = Math.sin(x * 0.3 + t) * 0.2 + Math.sin(y * 0.3 + t * 0.7) * 0.2;
      }
      gridGeo.attributes.position.needsUpdate = true;

      // Camera follows mouse smoothly
      camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, -5);

      renderer.render(scene, camera);
    }

    animate(0);

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 200);
    });
  }

  // ============================================================
  // GSAP — Full Motion System
  // ============================================================
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.anim-hero, .reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    heroEntrance();
    scrollReveals();
    hoverEffects();
    parallaxSections();
  }

  // --- Hero Cinematic Entrance ---
  function heroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.anim-hero', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      delay: 0.2,
    });

    // Terminal typing cursor
    const cursor = document.querySelector('.terminal-cursor');
    if (cursor) {
      tl.to(cursor, { opacity: 1, duration: 0.1 }, '-=0.3');
    }
  }

  // --- Scroll Reveal ---
  function scrollReveals() {
    // Section headers
    document.querySelectorAll('.section-head').forEach(head => {
      const kids = head.querySelectorAll('.reveal');
      gsap.set(kids, { opacity: 0, y: 25 });

      ScrollTrigger.create({
        trigger: head,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(kids, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
          });
        },
        once: true,
      });
    });

    // Feature cards stagger
    const featureCards = gsap.utils.toArray('.feature-card.reveal');
    featureCards.forEach((card, i) => {
      gsap.set(card, { opacity: 0, y: 40, scale: 0.97 });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: (i % 3) * 0.08,
            ease: 'power3.out',
          });
        },
        once: true,
      });
    });

    // Showcase viewer
    const viewer = document.querySelector('.showcase-viewer');
    if (viewer) {
      gsap.set(viewer, { opacity: 0, y: 50, scale: 0.97 });

      ScrollTrigger.create({
        trigger: viewer,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(viewer, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power4.out',
          });
        },
        once: true,
      });
    }

    // AI section split
    const aiLeft = document.querySelector('.ai-left');
    const aiRight = document.querySelector('.ai-right');
    if (aiLeft && aiRight) {
      gsap.set(aiLeft, { opacity: 0, x: -40 });
      gsap.set(aiRight, { opacity: 0, x: 40 });

      ScrollTrigger.create({
        trigger: '.ai-split',
        start: 'top 80%',
        onEnter: () => {
          gsap.to(aiLeft, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
          gsap.to(aiRight, { opacity: 1, x: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' });
        },
        once: true,
      });
    }

    // AI benefits stagger
    const aiItems = document.querySelectorAll('.ai-benefits .reveal');
    aiItems.forEach((item, i) => {
      gsap.set(item, { opacity: 0, x: -20 });

      ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(item, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: i * 0.08,
            ease: 'power3.out',
          });
        },
        once: true,
      });
    });

    // Compare cards
    const oldCard = document.querySelector('.compare-old');
    const newCard = document.querySelector('.compare-new');
    const vsEl = document.querySelector('.compare-vs');

    if (oldCard) {
      gsap.set(oldCard, { opacity: 0, x: -50 });
      ScrollTrigger.create({
        trigger: '.compare-grid',
        start: 'top 85%',
        onEnter: () => gsap.to(oldCard, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }),
        once: true,
      });
    }
    if (newCard) {
      gsap.set(newCard, { opacity: 0, x: 50 });
      ScrollTrigger.create({
        trigger: '.compare-grid',
        start: 'top 85%',
        onEnter: () => gsap.to(newCard, { opacity: 1, x: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' }),
        once: true,
      });
    }
    if (vsEl) {
      gsap.set(vsEl, { opacity: 0, scale: 0, rotation: 180 });
      ScrollTrigger.create({
        trigger: '.compare-grid',
        start: 'top 85%',
        onEnter: () => gsap.to(vsEl, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, delay: 0.2, ease: 'back.out(2)' }),
        once: true,
      });
    }

    // Roadmap items
    document.querySelectorAll('.roadmap-item.reveal').forEach((item, i) => {
      gsap.set(item, { opacity: 0, x: i % 2 === 0 ? -30 : 30 });
      ScrollTrigger.create({
        trigger: item,
        start: 'top 88%',
        onEnter: () => gsap.to(item, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }),
        once: true,
      });
    });

    // FAQ items
    document.querySelectorAll('.faq-item.reveal').forEach((item, i) => {
      gsap.set(item, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        onEnter: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.5, delay: (i % 2) * 0.06, ease: 'power3.out' }),
        once: true,
      });
    });

    // Download card
    const dlCard = document.querySelector('.download-card');
    if (dlCard) {
      gsap.set(dlCard, { opacity: 0, scale: 0.96, y: 30 });
      ScrollTrigger.create({
        trigger: '.download-section',
        start: 'top 80%',
        onEnter: () => gsap.to(dlCard, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }),
        once: true,
      });
    }
  }

  // --- Parallax ---
  function parallaxSections() {
    // Hero content parallax on scroll
    gsap.to('.hero-content', {
      y: 80,
      opacity: 0.2,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    gsap.to('.hero-terminal', {
      y: 60,
      opacity: 0.1,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Glow parallax
    gsap.to('.hero-glow-1', {
      y: 150,
      scale: 1.3,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // --- Hover Effects ---
  function hoverEffects() {
    if (window.innerWidth < 768) return;

    // Feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.02, duration: 0.35, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, duration: 0.35, ease: 'power2.out' });
      });
    });

    // Meta items
    document.querySelectorAll('.meta-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { scale: 1.08, y: -2, duration: 0.25, ease: 'back.out(2)' });
        gsap.to(item.querySelector('.meta-val'), { scale: 1.1, duration: 0.2, ease: 'power2.out' });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { scale: 1, y: 0, duration: 0.25, ease: 'power2.out' });
        gsap.to(item.querySelector('.meta-val'), { scale: 1, duration: 0.2, ease: 'power2.out' });
      });
    });

    // FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { x: 5, duration: 0.3, ease: 'power2.out' });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { x: 0, duration: 0.3, ease: 'power2.out' });
      });
    });

    // Viewers tilt on mouse
    const viewer = document.querySelector('.showcase-viewer');
    if (viewer && window.innerWidth >= 768) {
      viewer.addEventListener('mousemove', e => {
        const r = viewer.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(viewer, { rotateY: x * 4, rotateX: -y * 3, duration: 0.5, ease: 'power2.out' });
      });
      viewer.addEventListener('mouseleave', () => {
        gsap.to(viewer, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    }
  }

  // ============================================================
  // CAROUSEL
  // ============================================================
  let currentSlide = 0;
  let sliding = false;
  const slideCount = 5;

  function initCarousel() {
    setInterval(() => {
      if (!sliding) nextSlide();
    }, 5000);

    document.querySelectorAll('.slide img').forEach(img => {
      img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });
  }

  function goSlide(idx) {
    if (idx === currentSlide || sliding) return;
    sliding = true;

    const slides = document.querySelectorAll('.slide');
    const thumbs = document.querySelectorAll('.thumb');

    gsap.to(slides[currentSlide], {
      opacity: 0,
      scale: 1.04,
      filter: 'blur(4px)',
      duration: 0.4,
      ease: 'power2.in',
    });

    gsap.fromTo(slides[idx],
      { opacity: 0, scale: 0.96, filter: 'blur(4px)' },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        delay: 0.1,
        ease: 'power3.out',
        onComplete: () => {
          slides[currentSlide].classList.remove('active');
          slides[idx].classList.add('active');
          currentSlide = idx;
          sliding = false;
        },
      }
    );

    thumbs.forEach(t => t.classList.remove('active'));
    thumbs[idx].classList.add('active');

    gsap.fromTo(thumbs[idx], { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
  }

  window.goSlide = goSlide;

  window.nextSlide = function () {
    goSlide((currentSlide + 1) % slideCount);
  };

  window.prevSlide = function () {
    goSlide((currentSlide - 1 + slideCount) % slideCount);
  };

  // ============================================================
  // LIGHTBOX
  // ============================================================
  function openLightbox(src, alt) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if (!lb || !img) return;

    img.src = src;
    img.alt = alt || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.openLightbox = openLightbox;

  window.closeLightbox = function () {
    const lb = document.getElementById('lightbox');
    if (lb) {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.closeLightbox();
  });

  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) window.closeLightbox();
  });

})();
