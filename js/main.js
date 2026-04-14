// ── Scroll nav ──────────────────────────────────────────────────────────────
const nav = document.getElementById("navbar");
if (nav) {
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });
}

// ── Mobile hamburger ────────────────────────────────────────────────────────
const hbg = document.getElementById("hbg");
const mobMenu = document.getElementById("mobMenu");
if (hbg && mobMenu) {
  hbg.addEventListener("click", () => {
    hbg.classList.toggle("active");
    mobMenu.classList.toggle("open");
  });
}

function closeMob() {
  if (hbg) hbg.classList.remove("active");
  if (mobMenu) mobMenu.classList.remove("open");
}

// ── Fade-in observer ────────────────────────────────────────────────────────
const fadeEls = document.querySelectorAll(".fade-in");
if (fadeEls.length) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  fadeEls.forEach((el) => obs.observe(el));
}

// ── Skill bar animation ─────────────────────────────────────────────────────
const skillBars = document.querySelectorAll(".sk-fill");
if (skillBars.length) {
  const sObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.w || "80%";
          sObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillBars.forEach((bar) => sObs.observe(bar));
}

// ── CV download ─────────────────────────────────────────────────────────────
function dlCV(e) {
  e.preventDefault();
  window.open("/images/uploads/Zilpah_Idaa_CV_Updated.pdf", "_blank");
}

// ── Supabase helpers ────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ojwxqnffyksaofvoqiqb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qd3hxbmZmeWtzYW9mdm9xaXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODc2ODUsImV4cCI6MjA5MDI2MzY4NX0.Lrj5q5d2s2MbEKOktfFxz3l4S1TdCARHEQw8JC0addE";

async function sbPost(table, payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal,resolution=ignore-duplicates",
    },
    body: JSON.stringify(payload),
  });
  return res;
}

// ── Contact form → Supabase ─────────────────────────────────────────────────
const cForm = document.getElementById("cForm");
const okMsg = document.getElementById("okMsg");
if (cForm) {
  cForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(cForm);
    const payload = {
      name: data.get("name") || "",
      email: data.get("email") || "",
      message: data.get("message") || "",
    };
    try {
      const res = await sbPost("contact_submissions", payload);
      if (res.ok || res.status === 409) {
        cForm.style.display = "none";
        if (okMsg) { okMsg.style.display = "block"; }
      } else {
        throw new Error("Server error");
      }
    } catch {
      alert("Something went wrong. Please email idaazilpah@gmail.com directly.");
    }
  });
}

// ── Subscribe form → Supabase ───────────────────────────────────────────────
const subForms = document.querySelectorAll(".subscribe-netlify-form");
subForms.forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const msgEl = form.querySelector(".sub-ok-msg");
    const payload = {
      email: data.get("email") || "",
      name: data.get("name") || "",
    };
    try {
      const res = await sbPost("subscribers", payload);
      if (res.ok || res.status === 409) {
        if (msgEl) {
          msgEl.textContent = res.status === 409
            ? "You're already subscribed!"
            : "You're subscribed! Thank you.";
          msgEl.style.display = "block";
        }
        form.reset();
      } else {
        throw new Error("Server error");
      }
    } catch {
      if (msgEl) { msgEl.textContent = "Something went wrong. Try again."; msgEl.style.display = "block"; }
    }
  });
});
