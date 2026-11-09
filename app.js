const GALLERY_ITEMS = [
  {
    src: "images/avatar.jpg",
    caption: "Bùi Ngọc Đức – Tự hào màu áo ngành Điện lực Việt Nam (EVN) • Chuyên nghiệp & Tận tâm"
  },
  {
    src: "images/anh1.jpg",
    caption: "Khoảnh khắc gặp gỡ thân tình cùng những người bạn quý tại không gian 201 Coffee"
  },
  {
    src: "images/anh2.jpg",
    caption: "Hội ngộ rạng rỡ tại An Nhiên Chay – 'Thân Khỏe - Tâm An - Trí Sáng' & 201 Coffee (TP. Việt Trì)"
  },
  {
    src: "images/anh3.jpg",
    caption: "Hành trình về nguồn đầy ý nghĩa tại Khu Di tích Lịch sử Đền Hùng ('Cao Sơn Cảnh Hành')"
  },
  {
    src: "images/anh4.jpg",
    caption: "Nụ cười lạc quan, tràn đầy năng lượng tích cực cùng anh em bạn hữu tại An Nhiên Chay"
  }
];

const MOTTOS = [
  "Thân Khỏe • Tâm An • Trí Sáng",
  "Trân quý từng khoảnh khắc bên gia đình & bằng hữu",
  "Vững vàng chuyên môn • Lan tỏa năng lượng tích cực",
  "Sống trọn đam mê • Yêu thương & Sẻ chia mỗi ngày"
];

let currentSlideIndex = 0;
let slideshowTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  initTypingEffect();
  initLikesFromStorage();
  initGuestbook();
  initAmbientParticles();
});

// 1. TYPING EFFECT
function initTypingEffect() {
  const el = document.getElementById("typingText");
  if (!el) return;
  let mottoIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const current = MOTTOS[mottoIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx >= current.length) {
        deleting = true;
        setTimeout(tick, 2400);
        return;
      }
      setTimeout(tick, 55);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        mottoIdx = (mottoIdx + 1) % MOTTOS.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 28);
    }
  }
  setTimeout(tick, 1200);
}

// 2. GALLERY FILTER
function filterGallery(category, btnEl) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");

  const cards = document.querySelectorAll("#galleryGrid .moment-card");
  cards.forEach(card => {
    const cat = card.getAttribute("data-category");
    if (category === "all" || cat === category) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// 3. LIGHTBOX & SLIDESHOW
function openLightbox(index) {
  currentSlideIndex = (index + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImg");
  const cap = document.getElementById("lightboxCaption");

  img.src = GALLERY_ITEMS[currentSlideIndex].src;
  cap.textContent = GALLERY_ITEMS[currentSlideIndex].caption;
  modal.classList.add("open");
}

function closeLightbox() {
  const modal = document.getElementById("lightboxModal");
  modal.classList.remove("open");
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
    document.getElementById("btnSlideshow").textContent = "▶️";
  }
}

function changeSlide(delta) {
  openLightbox(currentSlideIndex + delta);
}

function startSlideshow() {
  if (slideshowTimer) {
    closeLightbox();
    return;
  }
  document.getElementById("btnSlideshow").textContent = "⏸️";
  openLightbox(0);
  slideshowTimer = setInterval(() => {
    changeSlide(1);
  }, 3200);
}

document.addEventListener("keydown", e => {
  const modal = document.getElementById("lightboxModal");
  if (!modal || !modal.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") changeSlide(1);
  if (e.key === "ArrowLeft") changeSlide(-1);
});

// 4. LIKE BUTTONS
function initLikesFromStorage() {
  document.querySelectorAll(".like-btn").forEach(btn => {
    const onclickAttr = btn.getAttribute("onclick") || "";
    const match = onclickAttr.match(/'([^']+)'/);
    if (!match) return;
    const key = "ngocduc_like_" + match[1];
    const saved = localStorage.getItem(key);
    const countSpan = btn.querySelector(".like-count");
    if (saved && countSpan) {
      countSpan.textContent = saved;
    }
  });
}

function likePhoto(btnEl, keyId) {
  const countSpan = btnEl.querySelector(".like-count");
  if (!countSpan) return;
  let current = parseInt(countSpan.textContent || "80", 10);
  current += 1;
  countSpan.textContent = current;
  localStorage.setItem("ngocduc_like_" + keyId, String(current));
}

// 5. COPY CONTACT INFO
function copyText(text, btnEl) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btnEl.textContent;
    btnEl.textContent = "✅ Đã chép!";
    setTimeout(() => {
      btnEl.textContent = original;
    }, 1800);
  });
}

// 6. THEME TOGGLE (DARK / LIGHT)
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById("btnThemeToggle");
  const current = html.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  btn.textContent = next === "dark" ? "🌙" : "☀️";
}

// 7. GUESTBOOK / WISHES
const DEFAULT_WISHES = [
  {
    name: "Anh chị em Đồng nghiệp & Bạn hữu",
    message: "Chúc anh Ngọc Đức luôn dồi dào sức khỏe, tâm an trí sáng và ngập tràn niềm vui trong cuộc sống!",
    time: "Hôm nay"
  },
  {
    name: "Hội Bạn Thân 201 Coffee & An Nhiên",
    message: "Không gian website tuyệt đẹp! Chúc tình bằng hữu của anh em mình mãi bền chặt theo năm tháng.",
    time: "Hôm nay"
  }
];

function initGuestbook() {
  let wishes = DEFAULT_WISHES;
  try {
    const saved = localStorage.getItem("ngocduc_wishes_v1");
    if (saved) wishes = JSON.parse(saved);
  } catch (e) {}
  renderWishes(wishes);
}

function renderWishes(wishes) {
  const listEl = document.getElementById("wishesList");
  if (!listEl) return;
  listEl.innerHTML = wishes
    .map(
      w => `
      <div class="wish-item">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <strong style="color:var(--accent-amber);">🌟 ${escapeHtml(w.name)}</strong>
          <small style="color:var(--text-muted);">${escapeHtml(w.time)}</small>
        </div>
        <div>${escapeHtml(w.message)}</div>
      </div>
    `
    )
    .join("");
}

function submitWish(e) {
  e.preventDefault();
  const nameInput = document.getElementById("wishName");
  const msgInput = document.getElementById("wishMessage");
  const name = nameInput.value.trim();
  const message = msgInput.value.trim();
  if (!name || !message) return;

  let wishes = DEFAULT_WISHES.slice();
  try {
    const saved = localStorage.getItem("ngocduc_wishes_v1");
    if (saved) wishes = JSON.parse(saved);
  } catch (err) {}

  wishes.unshift({
    name,
    message,
    time: new Date().toLocaleDateString("vi-VN")
  });
  localStorage.setItem("ngocduc_wishes_v1", JSON.stringify(wishes));
  renderWishes(wishes);
  nameInput.value = "";
  msgInput.value = "";
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 8. AMBIENT GOLDEN PARTICLES CANVAS
function initAmbientParticles() {
  const canvas = document.getElementById("ambientCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 42 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2.2 + 0.8,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.55 + 0.2
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}
