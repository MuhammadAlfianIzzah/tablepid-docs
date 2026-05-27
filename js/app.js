/**
 * TablePID Landing Page
 * Enhanced with GSAP + Three.js (Optimized)
 */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Init Three.js after a small delay to not block initial render
  setTimeout(() => initThreeJS(), 100);
  initGSAP();
  initSmoothScroll();
  initMobileMenu();
  initNavbarScroll();
});

/* ========================================
   THREE.JS - Floating Database Network
   Optimized for performance
   ======================================== */
function initThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Check if mobile - skip Three.js on low-end devices
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    canvas.style.display = 'none';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: false, // Disable for performance
    powerPreference: 'low-power'
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1); // Fixed pixel ratio for performance
  
  // Simple nodes - reduced complexity
  const nodes = [];
  const nodePositions = [
    { x: -2.5, y: 0.8, z: -2 },
    { x: 2.5, y: -0.4, z: -2.5 },
    { x: -1.2, y: -1.2, z: -3 },
    { x: 1.5, y: 1.2, z: -2 },
  ];
  
  const nodeColors = [0x336791, 0x4479A1, 0x003B57, 0x003545];
  
  // Create simple nodes
  for (let i = 0; i < 4; i++) {
    const geometry = new THREE.OctahedronGeometry(0.25, 0); // Simpler geometry
    const material = new THREE.MeshBasicMaterial({
      color: nodeColors[i],
      transparent: true,
      opacity: 0.5,
      wireframe: true,
    });
    const node = new THREE.Mesh(geometry, material);
    node.position.set(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
    node.userData = { 
      originalY: nodePositions[i].y,
      speed: 0.3 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2
    };
    scene.add(node);
    nodes.push(node);
  }
  
  // Simple connections
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0x8b5cf6, 
    transparent: true, 
    opacity: 0.1 
  });
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const geometry = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
      scene.add(new THREE.Line(geometry, lineMaterial));
    }
  }
  
  // Minimal particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 30;
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 8;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particles = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({
    size: 0.03,
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.3,
  }));
  scene.add(particles);
  
  camera.position.z = 4;
  
  // Throttled animation
  let lastTime = 0;
  const targetFPS = 30;
  const frameInterval = 1000 / targetFPS;
  
  function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Throttle to 30fps
    const delta = currentTime - lastTime;
    if (delta < frameInterval) return;
    lastTime = currentTime - (delta % frameInterval);
    
    const time = currentTime * 0.001;
    
    // Simple animations
    nodes.forEach((node, i) => {
      node.rotation.y += 0.01;
      node.position.y = node.userData.originalY + Math.sin(time * node.userData.speed + node.userData.phase) * 0.2;
    });
    
    particles.rotation.y += 0.001;
    
    renderer.render(scene, camera);
  }
  
  animate(0);
  
  // Resize handler with debounce
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
   GSAP ANIMATIONS
   ======================================== */
function initGSAP() {
  // Check for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-buttons, .hero-databases').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Hero animations
  initHeroAnimations();
  
  // Scroll reveal - optimized
  initScrollReveal();
  
  // Simple hover effects
  initHoverEffects();
}

/* Hero Animations */
function initHeroAnimations() {
  const tl = gsap.timeline({ 
    defaults: { ease: 'power2.out' },
    delay: 0.1
  });
  
  tl.from('.hero-badge', {
    opacity: 0,
    y: 15,
    duration: 0.5,
  })
  .from('.hero-title .title-line', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
  }, '-=0.2')
  .from('.hero-title .title-gradient', {
    opacity: 0,
    y: 30,
    duration: 0.6,
  }, '-=0.4')
  .from('.hero-description', {
    opacity: 0,
    y: 20,
    duration: 0.5,
  }, '-=0.3')
  .from('.hero-buttons .btn', {
    opacity: 0,
    y: 15,
    duration: 0.4,
    stagger: 0.08,
  }, '-=0.2')
  .from('.hero-databases', {
    opacity: 0,
    y: 15,
    duration: 0.4,
  }, '-=0.1')
  .from('.db-badge', {
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    stagger: 0.05,
  }, '-=0.2');
}

/* Scroll Reveal - Optimized with batch processing */
function initScrollReveal() {
  // Use batch for better performance
  const revealElements = document.querySelectorAll(
    '.feature-card, .screenshot-item, .screenshot-main, .shortcut-card, .faq-item, .timeline-item, .compare-card, .download-content'
  );
  
  // Simple scroll reveal
  revealElements.forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 20 });
    
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: (i % 3) * 0.05,
          ease: 'power2.out',
        });
      },
      once: true,
    });
  });
  
  // Section headers
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.set(header.children, { opacity: 0, y: 15 });
    
    ScrollTrigger.create({
      trigger: header,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(header.children, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        });
      },
      once: true,
    });
  });
  
  // AI section special animation
  const aiSection = document.querySelector('.ai-content');
  if (aiSection) {
    gsap.set('.ai-text', { opacity: 0, x: -30 });
    gsap.set('.ai-demo', { opacity: 0, x: 30 });
    
    ScrollTrigger.create({
      trigger: aiSection,
      start: 'top 85%',
      onEnter: () => {
        gsap.to('.ai-text', { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
        gsap.to('.ai-demo', { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' });
      },
      once: true,
    });
  }
}

/* Simple Hover Effects */
function initHoverEffects() {
  // Feature cards - CSS handles most, just add GSAP for smooth scale
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.01, duration: 0.2, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.2, ease: 'power2.out' });
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
        nav.style.background = scrolled ? 'rgba(9, 9, 11, 0.95)' : 'rgba(9, 9, 11, 0.8)';
        nav.style.boxShadow = scrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none';
        ticking = false;
      });
      ticking = true;
    }
  });
}
