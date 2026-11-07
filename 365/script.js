/**
 * =============================================================================
 * 💖 ANNIVERSARY WEB APP - SCRIPT.JS
 * =============================================================================
 * A romantic, interactive 12-month anniversary experience built with GSAP & ScrollTrigger.
 * 
 * Flow:
 * - Preloader with pulsing heart
 * - Lock screen with interactive cartoon teddy bear (Password: "Harsh")
 * - Background music begins on unlock (no floating clutter buttons)
 * - Phase 1: Centered Hero "HAPPY ANNIVERSARY BHUMII 💕🎉"
 * - Phase 2: Pinned Horizontal Scroll (Month 01 -> Month 12 scrolls right-to-left as user scrolls down)
 * - Phase 3: Love Letter (lined paper, wax seal, memories) & Grand Confetti Finale
 * =============================================================================
 */

'use strict';

// =============================================================================
// 1. CONFIGURATION OBJECT (EASY TO EDIT)
// =============================================================================
const CONFIG = {
  // Authentication & Names
  PASSWORD: "Harsh",
  HER_NAME: "Bhumii",
  MY_NAME: "Harsh",
  
  // 12 Months Journey Data (Using your 1st.jpeg to 12th.jpeg photos)
  MONTHS: [
    { 
      photo: "1st.jpeg", 
      caption: "Our beginning 🌸", 
      sideText: "Where our little story began 🌸", 
      side: "left" 
    },
    { 
      photo: "2nd.jpeg", 
      caption: "Growing closer 💌", 
      sideText: "You became my favourite notification 💌", 
      side: "right" 
    },
    { 
      photo: "3rd.jpeg", 
      caption: "Comfortable love 🧸", 
      sideText: "Every day with you feels like a soft hug 🧸", 
      side: "left" 
    },
    { 
      photo: "4th.jpeg", 
      caption: "Our happy place 💕", 
      sideText: "You + me = my happy place", 
      side: "right" 
    },
    { 
      photo: "5th.jpeg", 
      caption: "Smiles all around 😊", 
      sideText: "Still smiling because of you 😊", 
      side: "left" 
    },
    { 
      photo: "6th.jpeg", 
      caption: "Silly us 🤪", 
      sideText: "Our silly moments are my treasure", 
      side: "right" 
    },
    { 
      photo: "7th.jpeg", 
      caption: "Together 🤍", 
      sideText: "Hand in hand, always 🤍", 
      side: "left" 
    },
    { 
      photo: "8th.jpeg", 
      caption: "Magic ✨", 
      sideText: "You make ordinary days magical ✨", 
      side: "right" 
    },
    { 
      photo: "9th.jpeg", 
      caption: "Falling deeper 🦋", 
      sideText: "Falling for you, again and again", 
      side: "left" 
    },
    { 
      photo: "10th.jpeg", 
      caption: "Home is you 🏡", 
      sideText: "My heart's address: Bhumii 🏡", 
      side: "right" 
    },
    { 
      photo: "11th.jpeg", 
      caption: "Almost there 🌷", 
      sideText: "Almost a year of loving you", 
      side: "left" 
    },
    { 
      photo: "12th.jpeg", 
      caption: "One year! 💖", 
      sideText: "One year, and forever to go 💖", 
      side: "right" 
    },
  ],

  // Love Letter Content
  LETTER: {
    title: "Dear Bhumii,",
    paragraphs: [
      "Do you remember the first time we talked? I was trying so hard to be cool, but my heart was already doing backflips. From that very moment, I knew there was something about you that I couldn't walk away from. 💕",
      "Our first date still plays in my head like a movie scene. The way you laughed, the way your eyes sparkled — I knew right then that I wanted to see that smile for the rest of my life.",
      "We've had our silly fights too — the ones where we'd both go quiet for a bit, and then one of us would send a meme and everything would be okay again. 😄 Even in those moments, I never stopped loving you for a single second.",
      "You've been my calm on bad days and my excitement on good ones. You make everything better just by being there. Whether we're on a late night call or sending each other voice notes that are way too long — every moment with you is my favorite.",
      "I want you to know that you're not just my girlfriend — you're my best friend, my comfort place, and my whole heart. 🤍",
      "Here's my promise: I'll keep choosing you, every single day. Through every fight, every distance, every high and every low — it's always going to be you.",
      "Happy one year, my love. Here's to a million more little moments with you. I love you more than words on this screen could ever say. 🥺💖"
    ],
    photos: [
      "1st.jpeg",
      "7th.jpeg",
      "12th.jpeg"
    ],
    signature: "Forever yours, Harsh 💗"
  }
};


// =============================================================================
// GLOBAL STATE & AUDIO SYSTEM
// =============================================================================
let audioElement = null;
let audioCtx = null;
let chimeInterval = null;

/**
 * Romantic Music Box Chime synthesizer fallback
 * Plays sweet, gentle harp/chime tones if assets/music.mp3 is not yet provided
 */
function playRomanticChime() {
  if (chimeInterval) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Pentatonic romantic music box scale notes (C5, D5, E5, G5, A5, C6)
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const sequence = [0, 2, 4, 3, 2, 0, 1, 3, 2, 4, 5, 4];
    let step = 0;

    chimeInterval = setInterval(() => {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[sequence[step % sequence.length]], audioCtx.currentTime);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.4);
        step++;
      } catch (err) {
        // Ignore audio glitch
      }
    }, 650);
  } catch (e) {
    // Silent fail if AudioContext is unsupported
  }
}

function startMusic() {
  if (audioElement && !audioElement.paused) return;

  const audioCandidates = ['bgm.mp3', 'assets/bgm.mp3', 'assets/music.mp3'];
  let idx = 0;

  function tryPlayNext() {
    if (idx >= audioCandidates.length) {
      console.log('No local BGM audio found – playing romantic music-box chimes! 💕');
      playRomanticChime();
      return;
    }

    const path = audioCandidates[idx++];
    audioElement = new Audio(path);
    audioElement.loop = true;
    audioElement.volume = 0;

    audioElement.addEventListener('error', () => {
      console.warn(`Audio ${path} failed to load, trying next...`);
      tryPlayNext();
    }, { once: true });

    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (chimeInterval) {
          clearInterval(chimeInterval);
          chimeInterval = null;
        }
        gsap.to(audioElement, { volume: 0.65, duration: 2.5 });
      }).catch((err) => {
        console.warn(`Playback failed for ${path}:`, err);
        tryPlayNext();
      });
    }
  }

  tryPlayNext();
}


// =============================================================================
// UTILITIES
// =============================================================================
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function createPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'photo-placeholder';
  placeholder.innerHTML = '<span>📷</span><span style="font-size:1rem;font-family:var(--font-handwritten);margin-top:0.5rem;color:var(--deep-berry);">Our photo goes here 💕</span>';
  return placeholder;
}

function createFloatingParticles(container, count = 16, particleSet = ['💕', '✨', '⭐', '🌸', '💗', '🧸']) {
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'floating-particle';
    particle.textContent = randomItem(particleSet);
    
    const startX = randomBetween(5, 95);
    const startY = randomBetween(10, 95);
    const size = randomBetween(1, 2.2);

    particle.style.cssText = `
      position: absolute;
      left: ${startX}%;
      top: ${startY}%;
      font-size: ${size}rem;
      opacity: ${randomBetween(0.3, 0.7)};
      pointer-events: none;
      z-index: 0;
    `;
    container.appendChild(particle);

    gsap.to(particle, {
      y: `-=${randomBetween(60, 150)}`,
      x: `+=${randomBetween(-30, 30)}`,
      rotation: randomBetween(-25, 25),
      duration: randomBetween(4, 9),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: randomBetween(0, 3)
    });
  }
}

function createHeartBurst(container, count = 28) {
  if (!container) return;
  const hearts = ['💖', '💕', '💗', '🌸', '✨'];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.textContent = randomItem(hearts);
    heart.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: ${randomBetween(1.2, 2.2)}rem;
      pointer-events: none;
      z-index: 250;
      transform: translate(-50%, -50%);
    `;
    container.appendChild(heart);

    gsap.to(heart, {
      x: randomBetween(-180, 180),
      y: randomBetween(-240, 120),
      rotation: randomBetween(-180, 180),
      scale: randomBetween(0.8, 1.6),
      opacity: 0,
      duration: randomBetween(1.2, 2),
      ease: 'power2.out',
      onComplete: () => heart.remove()
    });
  }
}

function createConfetti() {
  const container = $('#confetti-container') || document.body;
  const shapes = ['💖', '🎉', '✨', '💕', '🩷', '🎊', '⭐', '🌸'];

  for (let i = 0; i < 70; i++) {
    const confetti = document.createElement('span');
    confetti.textContent = randomItem(shapes);
    confetti.style.cssText = `
      position: fixed;
      top: -10%;
      left: ${randomBetween(0, 100)}%;
      font-size: ${randomBetween(1.2, 2.4)}rem;
      pointer-events: none;
      z-index: 1001;
      user-select: none;
    `;
    container.appendChild(confetti);

    gsap.to(confetti, {
      y: window.innerHeight * 1.25,
      x: randomBetween(-100, 100),
      rotation: randomBetween(-360, 360),
      duration: randomBetween(2.5, 5),
      ease: 'power1.in',
      delay: randomBetween(0, 2),
      onComplete: () => confetti.remove()
    });
  }
}


// =============================================================================
// AUTHENTICATION & LOCK SCREEN
// =============================================================================
function initAuth() {
  const input = $('#password-input');
  const btn = $('#unlock-btn');
  const msg = $('#auth-message');
  const welcome = $('#welcome-message');

  if (!input || !btn) return;

  let isAuthenticating = false;

  btn.addEventListener('click', handleUnlock);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUnlock();
  });

  function handleUnlock() {
    if (isAuthenticating) return;

    const value = input.value.trim().replace(/\s+/g, ' ');

    if (value.toLowerCase() === CONFIG.PASSWORD.toLowerCase()) {
      isAuthenticating = true;

      if (msg) {
        msg.textContent = '';
        msg.className = 'auth-message success';
      }

      // Teddy bear excited hug
      gsap.to('#teddy-main', { 
        scale: 1.12, 
        duration: 0.45, 
        yoyo: true, 
        repeat: 1, 
        ease: 'power2.out' 
      });

      createHeartBurst($('#lock-screen'));

      setTimeout(() => {
        if (welcome) {
          welcome.textContent = `Welcome, ${CONFIG.HER_NAME} 💖`;
          welcome.style.display = 'flex';
          welcome.classList.add('visible');
        }

        // Auto start background music on unlock
        startMusic();

        setTimeout(() => {
          const lockScreen = $('#lock-screen');
          if (lockScreen) lockScreen.classList.add('authenticated');
          if (welcome) welcome.classList.remove('visible');
          document.body.classList.remove('locked');

          setTimeout(() => {
            if (lockScreen) lockScreen.style.display = 'none';
            
            const mainContent = $('#main-content');
            if (mainContent) {
              mainContent.style.display = 'block';
              gsap.fromTo(mainContent, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'power2.out' });
            }

            // Launch the main experience
            initMainSite();
          }, 800);
        }, 1800);
      }, 700);

    } else {
      if (msg) {
        msg.textContent = "Hmm, try again, cutie 🥺";
        msg.className = 'auth-message error';
      }

      gsap.to('#teddy-main', { 
        x: -10, 
        duration: 0.08, 
        repeat: 5, 
        yoyo: true, 
        onComplete: () => gsap.set('#teddy-main', { x: 0 }) 
      });

      gsap.to(input, { 
        x: -8, 
        duration: 0.06, 
        repeat: 7, 
        yoyo: true, 
        onComplete: () => gsap.set(input, { x: 0 }) 
      });
    }
  }
}


// =============================================================================
// PHASE 2: 12-MONTH HORIZONTAL MEMORIES TRACK (SCROLLS RIGHT TO LEFT)
// =============================================================================
function populateAndInitMemories() {
  const track = $('#memories-track');
  if (!track) return;

  track.innerHTML = '';
  const stickerIcons = ['🌸', '🧸', '✨', '💕', '⭐', '🦋', '🌷', '🎀'];

  CONFIG.MONTHS.forEach((month, i) => {
    const monthNum = String(i + 1).padStart(2, '0');
    const tilt = randomBetween(-3.5, 3.5);

    const slide = document.createElement('div');
    slide.className = 'memory-slide';
    slide.dataset.month = i + 1;

    slide.innerHTML = `
      <div class="memory-month-label">Month ${monthNum}</div>
      <div class="memory-card-wrap">
        <div class="polaroid-frame" style="--tilt: ${tilt}deg;">
          <div class="washi-tape"></div>
          <img class="month-photo" src="${month.photo}" alt="Month ${monthNum} Memory">
          <div class="polaroid-caption">${month.caption}</div>
        </div>
        <div class="memory-quote-box">
          <span style="font-size: 1.4rem;">💌</span> ${month.sideText}
        </div>
      </div>
      <span class="sticker" style="top: ${randomBetween(12, 28)}%; left: ${randomBetween(6, 18)}%;">${randomItem(stickerIcons)}</span>
      <span class="sticker" style="bottom: ${randomBetween(14, 26)}%; right: ${randomBetween(6, 18)}%;">${randomItem(stickerIcons)}</span>
    `;

    // Handle missing photo fallback with smart path retry
    const img = slide.querySelector('.month-photo');
    let retry = 0;
    img.onerror = function() {
      if (retry === 0) {
        retry++;
        this.src = `assets/photos/${month.photo}`;
      } else if (retry === 1) {
        retry++;
        this.src = `assets/photos/month-${monthNum}.jpg`;
      } else {
        const placeholder = createPlaceholder();
        if (this.parentNode) {
          this.parentNode.replaceChild(placeholder, this);
        }
      }
    };

    track.appendChild(slide);
  });

  // GSAP Horizontal Scroll Pinning
  initHorizontalScroll();
}

function initHorizontalScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const section = $('#journey-section');
  const track = $('#memories-track');
  const progressFill = $('.progress-fill');
  const progressText = $('.progress-text');
  const slides = $$('.memory-slide');

  if (!section || !track || slides.length === 0) return;

  // Calculate the total horizontal distance needed
  const getScrollAmount = () => track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x: () => -getScrollAmount(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: "top top",
      end: () => "+=" + getScrollAmount(),
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        if (progressFill) progressFill.style.width = `${Math.min(100, Math.max(8, p * 100))}%`;
        const currentMonth = Math.min(12, Math.floor(p * 11.99) + 1);
        if (progressText) progressText.textContent = `Month ${String(currentMonth).padStart(2, '0')} / 12`;
      }
    }
  });

  // Refresh ScrollTrigger after layouts calculate
  ScrollTrigger.refresh();
}


// =============================================================================
// PHASE 3: LOVE LETTER & FINALE
// =============================================================================
function populateLetter() {
  const body = $('#letter-body');
  if (!body) return;

  body.innerHTML = '';
  let photoIndex = 0;

  CONFIG.LETTER.paragraphs.forEach((para, i) => {
    const p = document.createElement('p');
    p.textContent = para;
    body.appendChild(p);

    // Insert inline taped polaroid photo or video clip
    if ((i + 1) % 3 === 0 && CONFIG.LETTER.photos && CONFIG.LETTER.photos[photoIndex]) {
      const mediaSrc = CONFIG.LETTER.photos[photoIndex];
      const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(mediaSrc);

      let mediaElem;
      if (isVideo) {
        mediaElem = document.createElement('video');
        mediaElem.className = 'letter-photo';
        mediaElem.src = mediaSrc;
        mediaElem.controls = true;
        mediaElem.playsInline = true;
        mediaElem.muted = true;
        mediaElem.onerror = function() { this.style.display = 'none'; };
      } else {
        mediaElem = document.createElement('img');
        mediaElem.className = 'letter-photo';
        mediaElem.src = mediaSrc;
        mediaElem.alt = 'Our special memory 💕';
        let letterRetry = 0;
        mediaElem.onerror = function() {
          if (letterRetry === 0) {
            letterRetry++;
            this.src = `assets/photos/${mediaSrc}`;
          } else if (letterRetry === 1) {
            letterRetry++;
            this.src = `assets/letter-photos/${mediaSrc}`;
          } else {
            this.style.display = 'none';
          }
        };
      }

      body.appendChild(mediaElem);
      photoIndex++;
    }
  });

  // ScrollTrigger: When user reaches Finale Section, first run fast countdown 8 Nov 2025 -> 8 Nov 2026, then reveal celebration text!
  ScrollTrigger.create({
    trigger: '#finale-section',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      runFinaleCountdown();
    }
  });
}

/**
 * Runs rapid date countdown/calendar ticker from 8 Nov 2025 to 8 Nov 2026
 * Once complete, launches confetti and reveals the anniversary celebration text!
 */
function runFinaleCountdown() {
  const ticker = $('#countdown-ticker');
  const number = $('#countdown-number');
  const box = $('#finale-countdown-box');
  const celebration = $('#finale-celebration-content');

  if (!ticker || !number) return;

  // Start Date: 8 Nov 2025 -> End Date: 8 Nov 2026 (Month 10 is November in JS 0-indexed months)
  const startDate = new Date(2025, 10, 8).getTime();
  const endDate = new Date(2026, 10, 8).getTime();
  const totalDays = 365;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const countObj = { progress: 0 };

  // Rapid ticker running over 2.4 seconds
  gsap.to(countObj, {
    progress: 1,
    duration: 2.4,
    ease: "power2.inOut",
    onUpdate: () => {
      const currentMs = startDate + (endDate - startDate) * countObj.progress;
      const curDate = new Date(currentMs);

      const d = curDate.getDate();
      const m = monthNames[curDate.getMonth()];
      const y = curDate.getFullYear();
      const dayCount = Math.min(totalDays, Math.floor(countObj.progress * (totalDays - 1)) + 1);

      ticker.textContent = `${d} ${m} ${y}`;
      number.textContent = `Day ${dayCount}`;
    },
    onComplete: () => {
      // Land exactly on 8 Nov 2026 & Day 365
      ticker.textContent = "8 Nov 2026";
      number.textContent = "Day 365 / 365";

      if (box) box.classList.add('completed');

      // Heart burst explosion & celebratory confetti rain!
      createHeartBurst($('#finale-section'), 45);
      createConfetti();

      // Smoothly animate in the anniversary celebration text
      if (celebration) {
        celebration.style.pointerEvents = 'auto';
        gsap.to(celebration, {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'back.out(1.8)'
        });
      }
    }
  });
}


// =============================================================================
// CUSTOM CURSOR & TAP SPARKLES
// =============================================================================
function initCustomCursor() {
  const dot = $('#cursor-dot');
  const trail = $('#cursor-trail');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && dot && trail) {
    dot.style.display = 'block';
    trail.style.display = 'block';

    window.addEventListener('mousemove', (e) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power2.out' });
      gsap.to(trail, { x: e.clientX, y: e.clientY, duration: 0.28, ease: 'power2.out' });
    });
  }
}


// =============================================================================
// MAIN SITE INITIALIZATION
// =============================================================================
function initMainSite() {
  populateAndInitMemories();
  populateLetter();
  initCustomCursor();

  // Ambient floating decorations
  createFloatingParticles($('#hero-section'), 12);
  createFloatingParticles($('#letter-section'), 14);

  // Recalculate ScrollTrigger on window resize and image load
  window.addEventListener('resize', () => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 600);
}


// =============================================================================
// BOOTSTRAP
// =============================================================================
function bootstrap() {
  document.body.classList.add('locked');
  console.log(`💕 Anniversary site loaded - Made with love by ${CONFIG.MY_NAME}`);

  createFloatingParticles($('#floating-hearts-container'), 16, ['💕', '💗', '💖', '🌸']);
  initAuth();

  // Preloader timeout
  const minLoadTime = 1200;
  const startTime = Date.now();

  function dismissPreloader() {
    const preloader = $('#preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => { preloader.style.display = 'none'; }, 650);
    }
  }

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minLoadTime - elapsed);
    setTimeout(dismissPreloader, remaining);
  });

  setTimeout(dismissPreloader, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
