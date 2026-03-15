/* ═══════════════════════════════════════
   VANCROX — script.js
   Particles · Tilt · Reveal · Slider
═══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", function() {

  /* ── YEAR ── */
  var y = document.getElementById("year");
  if (y) y.innerText = new Date().getFullYear();

  /* ════════════════════════════════════
     PARTICLES CANVAS
  ════════════════════════════════════ */
  var canvas = document.getElementById("particles");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var W, H;
    function resizeCanvas() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    var dots = [];
    for (var i = 0; i < 85; i++) {
      dots.push({
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        r:  Math.random() * 1.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        a:  Math.random() * 0.7 + 0.2
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      for (var d = 0; d < dots.length; d++) {
        var p = dots[d];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238," + p.a + ")";
        ctx.fill();
      }
      for (var ii = 0; ii < dots.length; ii++) {
        for (var jj = ii + 1; jj < dots.length; jj++) {
          var a = dots[ii], b = dots[jj];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(59,130,246," + ((1 - dist / 130) * 0.12) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ════════════════════════════════════
     SCROLL REVEAL
  ════════════════════════════════════ */
  var revealEls = document.querySelectorAll(".reveal");
  if (window.IntersectionObserver) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function(el) { io.observe(el); });
  } else {
    revealEls.forEach(function(el) { el.classList.add("in"); });
  }

  /* ════════════════════════════════════
     TILT EFFECT
  ════════════════════════════════════ */
  function makeTilt(el, strength) {
    el.addEventListener("mousemove", function(e) {
      var r = el.getBoundingClientRect();
      var rx = ((e.clientY - r.top)  / r.height - 0.5) * -strength;
      var ry = ((e.clientX - r.left) / r.width  - 0.5) *  strength;
      el.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-2px)";
    });
    el.addEventListener("mouseleave", function() {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  }
  document.querySelectorAll(".tilt").forEach(function(el)      { makeTilt(el, 11); });
  document.querySelectorAll(".tilt-mini").forEach(function(el) { makeTilt(el, 7);  });

  /* ════════════════════════════════════
     HERO SLIDER — AI ↔ Human (4s auto)
  ════════════════════════════════════ */
  var slides  = document.querySelectorAll(".slide");
  var titleEl = document.getElementById("slideTitle");
  var titles  = ["AI-Powered Trading Engine", "Elite Trader Network"];
  var current = 0;

  if (slides.length > 0) {

    function goSlide(next) {
      slides[current].classList.remove("active");
      slides[current].classList.add("exit");
      (function(old) {
        setTimeout(function() { slides[old].classList.remove("exit"); }, 700);
      })(current);
      current = next;
      slides[current].classList.add("active");
      if (titleEl) titleEl.textContent = titles[current] || "";
      updateDots();
    }

    /* Dots */
    var dotsWrap = document.createElement("div");
    dotsWrap.className = "slide-dots";
    for (var di = 0; di < slides.length; di++) {
      (function(idx) {
        var d = document.createElement("div");
        d.className = "sdot" + (idx === 0 ? " on" : "");
        d.onclick = function() {
          clearInterval(autoInt);
          goSlide(idx);
          startAuto();
        };
        dotsWrap.appendChild(d);
      })(di);
    }
    var sliderWrap = document.querySelector(".slider-wrap");
    if (sliderWrap && sliderWrap.parentNode) {
      sliderWrap.parentNode.insertBefore(dotsWrap, sliderWrap.nextSibling);
    }

    function updateDots() {
      document.querySelectorAll(".sdot").forEach(function(d, i) {
        d.classList.toggle("on", i === current);
      });
    }

    var autoInt;
    function startAuto() {
      autoInt = setInterval(function() {
        goSlide((current + 1) % slides.length);
      }, 4000);
    }
    startAuto();
  }

}); // end DOMContentLoaded
