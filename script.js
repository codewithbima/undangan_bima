/* ===== KONFIGURASI — ubah semua data di sini (semua nilai di bawah adalah PLACEHOLDER) ===== */
const CONFIG = {
  groomNick: "Bima Tri Yuda, S.Kom.", groomFull: "Bima Tri Yuda, S.Kom.", groomParents: "Bapak Sutrisno & Ibu Sri Wahyuni",
  brideNick: "Ayu Lestari Ningrum, S.Pd.",   brideFull: "Ayu Lestari Ningrum, S.Pd.",    brideParents: "Bapak Slamet Riyadi & Ibu Siti Aminah",
  groomPhoto: "", brideFull_: "",           // contoh: "assets/images/groom.jpg" (kosong = placeholder)
  bridePhoto: "",
  gallery: ["", "", "", "", "", ""],         // contoh: "assets/images/g1.jpg"
  akad:    { title: "Akad Nikah", date: "2027-03-14T08:00:00+07:00", endLabel: "08.00 – 10.00 WIB",
             place: "Kediaman Mempelai Wanita", address: "Jl. Contoh No. 1, Desa Contoh, Kab. Contoh (PLACEHOLDER)",
             maps: "https://maps.google.com/?q=Pendopo+Contoh" },
  resepsi: { title: "Resepsi", date: "2027-03-14T11:00:00+07:00", endLabel: "11.00 – 14.00 WIB",
             place: "Pendopo Agung Contoh", address: "Jl. Pendopo No. 2, Kota Contoh (PLACEHOLDER)",
             maps: "https://maps.google.com/?q=Pendopo+Contoh" },
  story: [
    { t: "Perkenalan",  d: "2019", s: "Kami bertemu pertama kali di sebuah acara kampus. (contoh cerita, silakan ganti)" },
    { t: "Awal Hubungan", d: "2021", s: "Dari teman bercerita, tumbuh rasa saling percaya dan nyaman." },
    { t: "Lamaran",     d: "Desember 2026", s: "Dua keluarga bertemu dan mengikat niat baik kami." },
    { t: "Menuju Pelaminan", d: "14 Maret 2027", s: "Dengan ridha Allah, kami melangkah ke jenjang pernikahan." }
  ],
  info: ["Dress code: nuansa cokelat, krem, atau putih gading.", "Parkir tersedia di halaman pendopo.", "Mohon hadir 15 menit sebelum acara."],
  gifts: [ { bank: "Bank Contoh (PLACEHOLDER)", number: "1234567890", name: "a.n. Bima Tri Yuda" },
           { bank: "E-Wallet Contoh (PLACEHOLDER)", number: "081234567890", name: "a.n. Ayu Lestari Ningrum" } ],
  // URL Google Apps Script Web App (lihat README.md). Kosong = MODE DEMO (data TIDAK tersimpan ke server).
  rsvpEndpoint: "", wishEndpoint: "",
  music: "assets/audio/bim undangan musik.mpeg"            // tombol musik otomatis tersembunyi jika file tidak ada
};
/* ===== AKHIR KONFIGURASI ===== */

const $ = (s, r = document) => r.querySelector(s), esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtDate = (iso, o) => new Date(iso).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", ...o });
const C = CONFIG;

document.querySelectorAll("[data-b]").forEach(e => e.textContent = e.dataset.b === "coverDate" ? fmtDate(C.akad.date, { day: "numeric", month: "long", year: "numeric" }) : C[e.dataset.b]);
document.querySelectorAll("[data-photo]").forEach(e => { const u = C[e.dataset.photo]; if (u) e.style.backgroundImage = `url("${u}")`; });
document.title = `The Wedding of ${C.groomNick} & ${C.brideNick}`;
const guest = new URLSearchParams(location.search).get("to"); if (guest) $("#guestName").textContent = guest;

$("#events").innerHTML = [C.akad, C.resepsi].map(e => `<div class="card"><h3>${esc(e.title)}</h3>
  <p>${fmtDate(e.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}<br>${esc(e.endLabel)}</p>
  <p><b>${esc(e.place)}</b><br>${esc(e.address)}</p><a class="btn" href="${esc(e.maps)}" target="_blank" rel="noopener">Buka Google Maps</a></div>`).join("");

$("#gallery").innerHTML = C.gallery.map((u, i) => `<div ${u ? `style="background-image:url('${esc(u)}')" data-full="${esc(u)}"` : ""} role="img" aria-label="Foto ${i + 1}">${u ? "" : "✿"}</div>`).join("");
$("#gallery").onclick = e => { const u = e.target.dataset.full; if (!u) return; const l = document.createElement("div"); l.id = "lightbox"; l.innerHTML = `<img src="${esc(u)}" alt="">`; l.onclick = () => l.remove(); document.body.append(l); };

$("#story").innerHTML = C.story.map(s => `<li><h3>${esc(s.t)}</h3><small>${esc(s.d)}</small><p>${esc(s.s)}</p></li>`).join("");
$("#infoBox").innerHTML = C.info.map(i => `<p>${esc(i)}</p>`).join("");
$("#gifts").innerHTML = C.gifts.map((g, i) => `<div class="card"><h3>${esc(g.bank)}</h3><p><b>${esc(g.number)}</b><br>${esc(g.name)}</p><button class="btn" data-copy="${i}">Salin Nomor</button></div>`).join("");
$("#gifts").onclick = async e => {
  const i = e.target.dataset.copy; if (i == null) return; const n = C.gifts[i].number;
  try { await navigator.clipboard.writeText(n); } catch { const t = document.createElement("textarea"); t.value = n; document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); }
  e.target.textContent = "Tersalin ✓"; setTimeout(() => e.target.textContent = "Salin Nomor", 2000);
};

/* Countdown */
const units = [["Hari", 864e5], ["Jam", 36e5], ["Menit", 6e4], ["Detik", 1e3]];
function tick() {
  let d = new Date(C.akad.date) - Date.now();
  if (d <= 0) { $("#count").innerHTML = `<p style="grid-column:1/-1">Hari bahagia telah tiba 🤍</p>`; return clearInterval(tm); }
  $("#count").innerHTML = units.map(([l, ms]) => { const v = Math.floor(d / ms); d -= v * ms; return `<div><b>${String(v).padStart(2, "0")}</b>${l}</div>`; }).join("");
}
const tm = setInterval(tick, 1000); tick();

/* Form: kirim ke endpoint atau mode demo */
async function submit(form, endpoint, msgEl, type, onDemo) {
  msgEl.className = "msg";
  if (!form.checkValidity()) { msgEl.classList.add("err"); msgEl.textContent = "Lengkapi semua isian dengan benar."; form.reportValidity(); return; }
  const data = Object.fromEntries(new FormData(form)); data.type = type; data.time = new Date().toISOString();
  if (!endpoint) { onDemo(data); msgEl.classList.add("ok"); msgEl.textContent = "MODE DEMO: data hanya tampil di layar ini dan belum tersimpan ke server."; form.reset(); return; }
  try { await fetch(endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(data) });
    msgEl.classList.add("ok"); msgEl.textContent = "Terima kasih, data terkirim."; onDemo(data); form.reset();
  } catch { msgEl.classList.add("err"); msgEl.textContent = "Gagal mengirim. Periksa koneksi lalu coba lagi."; }
}
function addWish(d) { if (!d.text) return; $("#wishes").insertAdjacentHTML("afterbegin", `<div class="card"><b>${esc(d.name)}</b><p>${esc(d.text)}</p></div>`); }
$("#rsvpForm").onsubmit = e => { e.preventDefault(); submit(e.target, C.rsvpEndpoint, $("#rsvpMsg"), "rsvp", () => {}); };
$("#wishForm").onsubmit = e => { e.preventDefault(); submit(e.target, C.wishEndpoint, $("#wishMsg"), "wish", addWish); };

const audio = $("#bgm"); // Diperbaiki: sebelumnya keliru menunjuk #topBtn.
const mb = $("#musicBtn");

audio.src = C.music;
audio.loop = true;
audio.preload = "auto";

audio.addEventListener("canplay", () => {
  if ($("#cover").classList.contains("open")) {
    mb.hidden = false;
  }
});

audio.addEventListener("error", () => {
  mb.hidden = true;
});

mb.onclick = async () => {
  try {
    if (audio.paused) {
      await audio.play();
      mb.classList.add("playing");
    } else {
      audio.pause();
      mb.classList.remove("playing");
    }
  } catch (error) {
    console.warn("Musik gagal diputar:", error);
  }
};

$("#openBtn").onclick = async () => {
  $("#cover").classList.add("open");
  document.body.classList.remove("locked");

  $("#main").hidden = false;
  $("#nav").hidden = false;

  scrollTo(0, 0);

  // Memulai musik langsung dari klik pengguna.
  try {
    await audio.play();
    mb.hidden = false;
    mb.classList.add("playing");
  } catch (error) {
    console.warn("Musik gagal diputar:", error);
    mb.hidden = false;
  }

  observe();
};

/* ==========================================================
   FITUR BARU SELESAI
   ========================================================== */


/* ===== NAVIGASI DAN SCROLL — FUNGSI ASLI DIPERTAHANKAN ===== */
const topBtn = $("#topBtn");

onscroll = () => {
  topBtn.hidden = scrollY < 500 || $("#main").hidden;
};

topBtn.onclick = () => {
  scrollTo({ top: 0, behavior: "smooth" });
};

function observe() {
  const io = new IntersectionObserver(
    es => es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
    { threshold: .12 }
  );

  document.querySelectorAll(".rv").forEach(el => io.observe(el));
}