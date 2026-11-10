/**
 * Personalized Birthday Surprise Website
 * Interactive Logic, Pink Dreamy Aesthetics, Navigation,
 * Web Audio Synthesizer, Confetti Engine & HTML5 Audio Song Player
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // CONFIGURATION & STATE
  // ==========================================
  const CORRECT_PASSWORD = '26072006';
  let isUnlocked = false;
  let currentSlide = 1;
  const totalSlides = 6;
  let soundEnabled = true;

  // Native HTML5 Audio Element (Works 100% locally and offline!)
  const bgAudio = document.getElementById('bg-audio');

  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const stepDots = document.querySelectorAll('.step-dot');
  const passwordInput = document.getElementById('password-input');
  const unlockBtn = document.getElementById('unlock-btn');
  const togglePwBtn = document.getElementById('toggle-pw-visibility');
  const errorMsg = document.getElementById('error-message');
  const passwordCard = document.querySelector('.lock-card');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const revealVideoBtn = document.getElementById('reveal-video-btn');
  const warningContainer = document.getElementById('warning-container');
  const videoFinaleContainer = document.getElementById('video-finale-container');
  const restartBtn = document.getElementById('restart-journey-btn');
  const toastContainer = document.getElementById('toast-container');
  
  // Music Player UI elements
  const musicPill = document.getElementById('music-pill');
  const musicPillBtn = document.getElementById('music-pill-btn');
  const musicStatusText = document.getElementById('music-status-text');
  const musicPillIcon = document.getElementById('music-pill-icon');

  const cardPlaySongBtn = document.getElementById('card-play-song-btn');
  const cardVinylRecord = document.getElementById('card-vinyl-record');
  const cardPlayIcon = document.getElementById('card-play-icon');
  const cardPlayLabel = document.getElementById('card-play-label');
  const songCard = document.getElementById('song-player-card');

  const floatingWidget = document.getElementById('floating-music-widget');
  const widgetPlayBtn = document.getElementById('widget-play-btn');
  const widgetPlayIcon = document.getElementById('widget-play-icon');
  const widgetToggleExpand = document.getElementById('widget-toggle-expand');
  const widgetExpandIcon = document.getElementById('widget-expand-icon');

  const audioCurrentTime = document.getElementById('audio-current-time');
  const audioDuration = document.getElementById('audio-duration');
  const audioProgressFill = document.getElementById('audio-progress-fill');
  const audioProgressContainer = document.getElementById('audio-progress-container');

  // ==========================================
  // AUDIO CONTROLS & SYNCHRONIZATION
  // ==========================================
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateMusicUI(playing) {
    if (playing) {
      if (musicPill) musicPill.classList.add('playing');
      if (musicStatusText) musicStatusText.textContent = 'Now Playing 🎶';
      if (musicPillIcon) musicPillIcon.textContent = '⏸';

      if (floatingWidget) floatingWidget.classList.add('playing');
      if (widgetPlayIcon) widgetPlayIcon.textContent = '⏸';

      if (songCard) songCard.classList.add('playing');
      if (cardVinylRecord) cardVinylRecord.classList.add('playing');
      if (cardPlayIcon) cardPlayIcon.textContent = '⏸';
      if (cardPlayLabel) cardPlayLabel.textContent = 'Pause Song';
    } else {
      if (musicPill) musicPill.classList.remove('playing');
      if (musicStatusText) musicStatusText.textContent = 'Click to Play 🎵';
      if (musicPillIcon) musicPillIcon.textContent = '▶';

      if (floatingWidget) floatingWidget.classList.remove('playing');
      if (widgetPlayIcon) widgetPlayIcon.textContent = '▶';

      if (songCard) songCard.classList.remove('playing');
      if (cardVinylRecord) cardVinylRecord.classList.remove('playing');
      if (cardPlayIcon) cardPlayIcon.textContent = '▶';
      if (cardPlayLabel) cardPlayLabel.textContent = 'Play Song';
    }
  }

  function playSongFromBeginning() {
    if (!bgAudio) return;
    bgAudio.currentTime = 0;
    bgAudio.volume = 1.0;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateMusicUI(true);
      }).catch(err => {
        console.log("Playback interaction requirement:", err);
        updateMusicUI(false);
      });
    }
  }

  function toggleMusic() {
    if (!bgAudio) return;
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        updateMusicUI(true);
        showToast("Playing 'Adhento Gaani' 🎶✨");
      }).catch(err => {
        console.log("Audio play error:", err);
      });
    } else {
      bgAudio.pause();
      updateMusicUI(false);
      showToast("Music paused ⏸");
    }
  }

  // Audio Event Listeners
  if (bgAudio) {
    bgAudio.addEventListener('play', () => updateMusicUI(true));
    bgAudio.addEventListener('pause', () => updateMusicUI(false));
    bgAudio.addEventListener('ended', () => updateMusicUI(false));

    bgAudio.addEventListener('loadedmetadata', () => {
      if (audioDuration) {
        audioDuration.textContent = formatTime(bgAudio.duration);
      }
    });

    bgAudio.addEventListener('timeupdate', () => {
      if (audioCurrentTime) {
        audioCurrentTime.textContent = formatTime(bgAudio.currentTime);
      }
      if (audioDuration && bgAudio.duration) {
        audioDuration.textContent = formatTime(bgAudio.duration);
      }
      if (audioProgressFill && bgAudio.duration) {
        const pct = (bgAudio.currentTime / bgAudio.duration) * 100;
        audioProgressFill.style.width = `${pct}%`;
      }
    });
  }

  // Seeking in progress bar
  if (audioProgressContainer && bgAudio) {
    audioProgressContainer.addEventListener('click', (e) => {
      const rect = audioProgressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const pct = Math.max(0, Math.min(1, clickX / width));
      if (bgAudio.duration) {
        bgAudio.currentTime = pct * bgAudio.duration;
      }
    });
  }

  // Music UI click bindings
  if (musicPill) {
    musicPill.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }
  if (musicPillBtn) {
    musicPillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }
  if (widgetPlayBtn) {
    widgetPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }
  if (cardPlaySongBtn) {
    cardPlaySongBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }
  if (widgetToggleExpand && floatingWidget) {
    widgetToggleExpand.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingWidget.classList.toggle('collapsed');
      const isCollapsed = floatingWidget.classList.contains('collapsed');
      if (widgetExpandIcon) {
        widgetExpandIcon.textContent = isCollapsed ? '▴' : '▾';
      }
    });
  }

  // ==========================================
  // WEB AUDIO API SOUND SYNTHESIZER (FX)
  // ==========================================
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } 
    else if (type === 'unlock') {
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.1);

        gain.gain.setValueAtTime(0, now + index * 0.1);
        gain.gain.linearRampToValueAtTime(0.2, now + index * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.55);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.6);
      });
    } 
    else if (type === 'celebration') {
      const melody = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.12 },
        { f: 1046.50, d: 0.35 }
      ];
      let offset = 0;
      melody.forEach(note => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now + offset);

        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(0.22, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + note.d);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + note.d + 0.05);
        offset += note.d * 0.85;
      });
    } 
    else if (type === 'error') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  // Sound FX toggle button
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const icon = soundToggleBtn.querySelector('.sound-icon');
      const label = soundToggleBtn.querySelector('.sound-label');
      
      if (soundEnabled) {
        if (icon) icon.textContent = '🔔';
        if (label) label.textContent = 'Sound On';
        showToast('Sound effects enabled 🔔');
        playSound('click');
      } else {
        if (icon) icon.textContent = '🔕';
        if (label) label.textContent = 'Sound Off';
        showToast('Sound effects muted 🔕');
      }
    });
  }

  // ==========================================
  // CONFETTI SYSTEM
  // ==========================================
  const canvas = document.getElementById('confetti-canvas');
  let ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let isConfettiRunning = false;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = ['#FF6B95', '#FFA8BF', '#B892FF', '#FFB356', '#FAD02C', '#5EEAD4', '#FF85A2', '#C084FC', '#FFFFFF'];

  function createConfettiBatch(count, originX, originY) {
    const startX = originX !== undefined ? originX : window.innerWidth / 2;
    const startY = originY !== undefined ? originY : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        size: Math.random() * 8 + 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 100 + 80,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!isConfettiRunning) {
      isConfettiRunning = true;
      requestAnimationFrame(renderConfetti);
    }
  }

  function renderConfetti() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.life++;

      const lifeRatio = p.life / p.maxLife;
      if (lifeRatio > 0.7) {
        p.opacity = 1 - (lifeRatio - 0.7) / 0.3;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (p.life >= p.maxLife || p.y > canvas.height + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      requestAnimationFrame(renderConfetti);
    } else {
      isConfettiRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function fireConfettiBurst(x, y) {
    createConfettiBatch(70, x, y);
  }

  function fireCelebrationShower() {
    let bursts = 0;
    const interval = setInterval(() => {
      createConfettiBatch(45, Math.random() * window.innerWidth, window.innerHeight * 0.3);
      bursts++;
      if (bursts >= 9) {
        clearInterval(interval);
      }
    }, 260);
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ==========================================
  // INTERACTIVE CLICK BURST (HEARTS & SPARKLES)
  // ==========================================
  const clickEmojis = ['💖', '💕', '✨', '🌸', '🤍', '⭐', '🫶🏻'];
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, input, a, .progress-bar-container')) return;

    const heart = document.createElement('span');
    heart.className = 'click-heart';
    heart.textContent = clickEmojis[Math.floor(Math.random() * clickEmojis.length)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
  });

  // ==========================================
  // PASSWORD VERIFICATION (SLIDE 1)
  // ==========================================
  const cuteErrorMessages = [
    "Aiyoo pichepilla, wrong password! 😜 Think again!",
    "Reyy! Think about your dairy DOB! 🙂↔️🙂↔️",
    "Nope! That's not the secret code, icepula! 🍦",
    "Wrong guess! Don't tell me you forgot your own dairy DOB! 🤭"
  ];

  function verifyPassword() {
    initAudioContext();
    const entered = (passwordInput.value || '').trim();

    if (!entered) {
      showError("Please enter your password first! 🔐");
      return;
    }

    if (entered === CORRECT_PASSWORD) {
      isUnlocked = true;
      if (errorMsg) {
        errorMsg.textContent = "Yay! Unlocking your surprise... ✨";
        errorMsg.style.color = "#4CAF50";
      }

      playSound('unlock');
      const rect = unlockBtn ? unlockBtn.getBoundingClientRect() : null;
      fireConfettiBurst(rect ? rect.left + rect.width / 2 : undefined, rect ? rect.top : undefined);

      passwordInput.disabled = true;
      if (unlockBtn) unlockBtn.disabled = true;

      // START SONG IMMEDIATELY FROM 0:00 (Direct user click gesture!)
      playSongFromBeginning();

      showToast("Access Granted! Welcome to your surprise! 🎁✨");

      setTimeout(() => {
        goToSlide(2);
      }, 900);

    } else {
      const randomMsg = cuteErrorMessages[Math.floor(Math.random() * cuteErrorMessages.length)];
      showError(randomMsg);
      playSound('error');
    }
  }

  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.style.color = "#FF5A79";
    }

    if (passwordCard) {
      passwordCard.classList.remove('shake');
      void passwordCard.offsetWidth;
      passwordCard.classList.add('shake');
    }

    if (passwordInput) {
      passwordInput.focus();
      passwordInput.select();
    }
  }

  if (unlockBtn) {
    unlockBtn.addEventListener('click', (e) => {
      e.preventDefault();
      verifyPassword();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyPassword();
      }
    });
  }

  if (togglePwBtn && passwordInput) {
    togglePwBtn.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePwBtn.textContent = '🙈';
      } else {
        passwordInput.type = 'password';
        togglePwBtn.textContent = '👁️';
      }
    });
  }

  // ==========================================
  // SLIDE TRANSITION & NAVIGATION LOGIC
  // ==========================================
  function goToSlide(targetSlideNumber) {
    targetSlideNumber = parseInt(targetSlideNumber, 10);
    if (isNaN(targetSlideNumber) || targetSlideNumber < 1 || targetSlideNumber > totalSlides) {
      return;
    }

    if (targetSlideNumber > 1 && !isUnlocked) {
      showError("Please unlock Slide 1 with the password first! 🔒");
      playSound('error');
      return;
    }

    slides.forEach(slide => {
      slide.classList.remove('active');
    });

    const targetSlide = document.getElementById(`slide-${targetSlideNumber}`);
    if (targetSlide) {
      targetSlide.classList.add('active');
    }

    currentSlide = targetSlideNumber;
    updateProgressDots(currentSlide);
    playSound('click');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgressDots(activeStep) {
    stepDots.forEach(dot => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.remove('active', 'completed');

      if (step === activeStep) {
        dot.classList.add('active');
      } else if (step < activeStep) {
        dot.classList.add('completed');
      }
    });
  }

  stepDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      if (step === 1 || isUnlocked) {
        goToSlide(step);
      } else {
        showError("Unlock with your secret password first! 🔐");
        playSound('error');
      }
    });
  });

  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('.nav-btn');
    if (navBtn) {
      const target = navBtn.getAttribute('data-target');
      if (target) {
        goToSlide(parseInt(target, 10));
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    if (!isUnlocked) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
      }
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    if (!isUnlocked) return;
    const diff = touchEndX - touchStartX;
    const threshold = 55;

    if (diff < -threshold) {
      if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
      }
    } else if (diff > threshold) {
      if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
      }
    }
  }

  // ==========================================
  // SLIDE 6: GRAND FINALE SURPRISE REVEAL
  // ==========================================
  if (revealVideoBtn) {
    revealVideoBtn.addEventListener('click', () => {
      initAudioContext();
      playSound('celebration');
      fireCelebrationShower();

      // Ensure the song is playing as she views the surprise
      if (bgAudio && bgAudio.paused) {
        bgAudio.play().then(() => updateMusicUI(true)).catch(() => {});
      }

      // Animate warning out and letter container in
      if (warningContainer) {
        warningContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        warningContainer.style.opacity = '0';
        warningContainer.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          warningContainer.classList.add('hidden');
          if (videoFinaleContainer) {
            videoFinaleContainer.classList.remove('hidden');
            // Enforce centering in DOM
            document.querySelectorAll('.finale-p, .finale-blessing, .finale-title-text, .finale-body').forEach(el => {
              el.style.textAlign = 'center';
            });
            videoFinaleContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showToast("Happy 18th Birthday Ishu! 🎂💖✨");
          }
        }, 400);
      }
    });
  }

  // Restart Journey Button
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      goToSlide(2);
      showToast("Starting memory journey again! ✨");
    });
  }

});
