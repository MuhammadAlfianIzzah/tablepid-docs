/**
 * TablePID Landing Page
 * Enhanced with GSAP + Three.js (Optimized)
 */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Init Three.js after a small delay to not block initial render
  setTimeout(() => initThreeJS(), 100);
  setTimeout(() => initScreenshotsThreeJS(), 200);
  initGSAP();
  initSmoothScroll();
  initMobileMenu();
  initNavbarScroll();
  initScreenshotsCarousel();
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
   THREE.JS - Screenshots Section Particles
   ======================================== */
function initScreenshotsThreeJS() {
  const canvas = document.getElementById('screenshots-canvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const isMobile = window.innerWidth < 768;
  if (isMobile) return;

  const section = document.getElementById('screenshots');
  const rect = section.getBoundingClientRect();
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, rect.width / rect.height, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: false,
    powerPreference: 'low-power'
  });
  
  renderer.setSize(rect.width, rect.height);
  renderer.setPixelRatio(1);
  
  // Floating geometric shapes
  const shapes = [];
  const geometries = [
    new THREE.IcosahedronGeometry(0.15, 0),
    new THREE.OctahedronGeometry(0.12, 0),
    new THREE.TetrahedronGeometry(0.1, 0),
  ];
  
  for (let i = 0; i < 15; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.75 + Math.random() * 0.1, 0.6, 0.5),
      wireframe: true,
      transparent: true,
      opacity: 0.15 + Math.random() * 0.15,
    });
    
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4 - 2
    );
    
    mesh.userData = {
      rotSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02 },
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatPhase: Math.random() * Math.PI * 2,
      originalY: mesh.position.y,
    };
    
    scene.add(mesh);
    shapes.push(mesh);
  }
  
  // Particles
  const particleCount = 50;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 12;
    positions[i + 1] = (Math.random() - 0.5) * 8;
    positions[i + 2] = (Math.random() - 0.5) * 4;
  }
  
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
    size: 0.02,
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.4,
  }));
  scene.add(particles);
  
  camera.position.z = 5;
  
  let lastTime = 0;
  const targetFPS = 30;
  const frameInterval = 1000 / targetFPS;
  
  function animate(currentTime) {
    requestAnimationFrame(animate);
    
    const delta = currentTime - lastTime;
    if (delta < frameInterval) return;
    lastTime = currentTime - (delta % frameInterval);
    
    const time = currentTime * 0.001;
    
    shapes.forEach((shape) => {
      shape.rotation.x += shape.userData.rotSpeed.x;
      shape.rotation.y += shape.userData.rotSpeed.y;
      shape.position.y = shape.userData.originalY + Math.sin(time * shape.userData.floatSpeed + shape.userData.floatPhase) * 0.3;
    });
    
    particles.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
  }
  
  animate(0);
  
  // Resize
  const resizeObserver = new ResizeObserver(() => {
    const newRect = section.getBoundingClientRect();
    camera.aspect = newRect.width / newRect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(newRect.width, newRect.height);
  });
  resizeObserver.observe(section);
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
    '.feature-card, .shortcut-card, .faq-item, .timeline-item, .compare-card, .download-content'
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
  
  // Screenshots section special animation
  const screenshotViewer = document.querySelector('.screenshot-viewer');
  const screenshotThumbs = document.querySelector('.screenshot-thumbs');
  
  if (screenshotViewer) {
    gsap.set(screenshotViewer, { opacity: 0, y: 40, rotateX: 5 });
    
    ScrollTrigger.create({
      trigger: screenshotViewer,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(screenshotViewer, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      },
      once: true,
    });
  }
  
  if (screenshotThumbs) {
    gsap.set(screenshotThumbs, { opacity: 0, y: 20 });
    
    ScrollTrigger.create({
      trigger: screenshotThumbs,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(screenshotThumbs, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          ease: 'power2.out',
        });
        // Stagger animate each thumb
        gsap.from('.thumb', {
          opacity: 0,
          scale: 0.8,
          y: 10,
          duration: 0.4,
          stagger: 0.08,
          delay: 0.4,
          ease: 'back.out(1.5)',
        });
      },
      once: true,
    });
  }
  
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
      gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });
  
  // Thumbnail hover effects
  document.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('mouseenter', () => {
      gsap.to(thumb, { 
        scale: 1.08, 
        y: -4,
        duration: 0.3, 
        ease: 'back.out(1.5)' 
      });
    });
    thumb.addEventListener('mouseleave', () => {
      gsap.to(thumb, { 
        scale: 1, 
        y: 0,
        duration: 0.3, 
        ease: 'power2.out' 
      });
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
  
  // GSAP animation
  gsap.fromTo(lightbox, 
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: 'power2.out' }
  );
  gsap.fromTo(lightboxImg,
    { scale: 0.8, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'back.out(1.5)' }
  );
  gsap.fromTo(lightboxCaption,
    { opacity: 0, y: 10 },
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
  // Auto-advance every 5 seconds
  setInterval(() => {
    if (!isTransitioning) {
      nextScreenshot();
    }
  }, 5000);
  
  // Click on main image opens lightbox
  document.querySelectorAll('.screenshot-slide img').forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });
  });
  
  // Mouse tilt effect on viewer
  const viewer = document.querySelector('.screenshot-viewer');
  if (viewer) {
    viewer.addEventListener('mousemove', (e) => {
      const rect = viewer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(viewer, {
        rotateY: x * 4,
        rotateX: -y * 4,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
    
    viewer.addEventListener('mouseleave', () => {
      gsap.to(viewer, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  }
}

function goToScreenshot(index) {
  if (index === currentSlide || isTransitioning) return;
  isTransitioning = true;
  
  const slides = document.querySelectorAll('.screenshot-slide');
  const thumbs = document.querySelectorAll('.thumb');
  
  // Animate out current
  gsap.to(slides[currentSlide], {
    opacity: 0,
    scale: 1.05,
    duration: 0.4,
    ease: 'power2.in',
  });
  
  // Animate in new
  gsap.fromTo(slides[index],
    { opacity: 0, scale: 0.95 },
    { 
      opacity: 1, 
      scale: 1, 
      duration: 0.5, 
      delay: 0.15,
      ease: 'power2.out',
      onComplete: () => {
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        currentSlide = index;
        isTransitioning = false;
      }
    }
  );
  
  // Update thumbnails
  thumbs.forEach(t => t.classList.remove('active'));
  thumbs[index].classList.add('active');
  
  // Animate active thumb
  gsap.fromTo(thumbs[index],
    { scale: 0.9 },
    { scale: 1, duration: 0.3, ease: 'back.out(2)' }
  );
}

function nextScreenshot() {
  const next = (currentSlide + 1) % totalSlides;
  goToScreenshot(next);
}

function prevScreenshot() {
  const prev = (currentSlide - 1 + totalSlides) % totalSlides;
  goToScreenshot(prev);
}
