// DAFTAR ISI: 1. Pengaturan Umum, 2. Sistem Progres, 3. Gambar Segitiga, 4. Data Soal, 5. Soal Adaptif, 6. Drag & Geser, 7. Tangga Tepat, 8. Jurnal Refleksi, 9. Aksesibilitas

/* ========== [BAGIAN: 1. PENGATURAN UMUM] ========== */

// UBAH DI SINI: Batas minimal kelulusan Gerbang Proyek & Ujian Sertifikasi (dalam persen)
const BATAS_LULUS = 70;

// Kunci penyimpanan di localStorage browser
const KUNCI_PENYIMPANAN = "misiArsitekMuda_dataProgres_v1";

// Urutan halaman proyek untuk pengecekan akses bertahap
const URUTAN_PROYEK = [
  { id: "beranda", file: "index.html", nama: "Kantor Proyek", nomorUrut: 0 },
  { id: "proyek1", file: "materi1.html", nama: "Proyek 1: Fondasi", nomorUrut: 1 },
  { id: "proyek2", file: "materi2.html", nama: "Proyek 2: Rangka Baja", nomorUrut: 2 },
  { id: "proyek3", file: "materi3.html", nama: "Proyek 3: Atap & Tangga", nomorUrut: 3 },
  { id: "lapangan", file: "latihan.html", nama: "Lapangan Proyek", nomorUrut: 4 },
  { id: "ujian", file: "kuis.html", nama: "Ujian Sertifikasi", nomorUrut: 5 },
  { id: "tentang", file: "tentang.html", nama: "Tentang & Panduan", nomorUrut: 0 }
];

/**
 * Fungsi formatAngka: Membulatkan angka maksimal 2 desimal dan menghapus .00 jika bulat.
 * Masukan: nilai (Number)
 * Hasil: String angka yang rapi (contoh: 5, 3.46)
 */
function formatAngka(nilai) {
  const angka = Number(nilai);
  if (!Number.isFinite(angka)) return "0";
  return Number(angka.toFixed(2)).toString();
}

/**
 * Fungsi hitungSisiMiring: Menghitung hipotenusa c dari sisi siku-siku a dan b.
 * Masukan: a (Number), b (Number)
 * Hasil: Number panjang sisi miring c
 */
function hitungSisiMiring(a, b) {
  const nilaiA = Number(a);
  const nilaiB = Number(b);
  if (!Number.isFinite(nilaiA) || !Number.isFinite(nilaiB) || nilaiA <= 0 || nilaiB <= 0) {
    return 0;
  }
  return Math.sqrt(nilaiA * nilaiA + nilaiB * nilaiB);
}

/**
 * Fungsi buatSvgMaskot: Menghasilkan kode SVG maskot Insinyur Berhelm sesuai ekspresi.
 * Masukan: ekspresi ("senang" | "semangat" | "standar")
 * Hasil: String markup SVG
 */
function buatSvgMaskot(ekspresi = "standar") {
  let mulut = `<path d="M 24 42 Q 32 48 40 42" stroke="#0B2A4A" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  if (ekspresi === "senang") {
    mulut = `<path d="M 22 40 Q 32 50 42 40 Z" fill="#C62828" stroke="#0B2A4A" stroke-width="2"/>`;
  } else if (ekspresi === "semangat") {
    mulut = `<path d="M 25 44 Q 32 40 39 44" stroke="#0B2A4A" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }

  return `
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      <!-- Wajah -->
      <circle cx="32" cy="36" r="18" fill="#FDE68A" stroke="#0B2A4A" stroke-width="2.5"/>
      <!-- Mata -->
      <circle cx="25" cy="34" r="2.5" fill="#0B2A4A"/>
      <circle cx="39" cy="34" r="2.5" fill="#0B2A4A"/>
      <!-- Mulut -->
      ${mulut}
      <!-- Helm Proyek Kuning -->
      <path d="M 12 28 C 12 14, 52 14, 52 28 Z" fill="#FFC107" stroke="#0B2A4A" stroke-width="2.5"/>
      <rect x="28" y="13" width="8" height="12" rx="2" fill="#F59E0B" stroke="#0B2A4A" stroke-width="1.8"/>
      <path d="M 9 28 L 55 28" stroke="#0B2A4A" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  `;
}


/* ========== [BAGIAN: 2. SISTEM PROGRES] ========== */

// Struktur data default untuk siswa baru
function buatDataProgresAwal() {
  return {
    namaArsitek: "Arsitek Muda",
    skorSiswa: 0,
    comboSaatIni: 0,
    comboTerbaik: 0,
    proyekTerbukaMaksimal: 1, // 1 = Proyek 1 terbuka dari awal
    proyekSelesai: {
      proyek1: false,
      proyek2: false,
      proyek3: false,
      lapangan: false,
      ujian: false
    },
    skorGerbang: {
      proyek1: 0,
      proyek2: 0,
      proyek3: 0,
      lapangan: 0,
      ujian: 0
    },
    riwayatSoal: {},
    jurnalRefleksi: {},
    tantanganHarianSelesai: "",
    ukuranFont: 16,
    modeGelap: false
  };
}

/**
 * Fungsi ambilProgresBelajar: Mengambil data progres siswa dari localStorage.
 * Hasil: Objek progresBelajar
 */
function ambilProgresBelajar() {
  try {
    const dataTersimpan = localStorage.getItem(KUNCI_PENYIMPANAN);
    if (!dataTersimpan) {
      const awal = buatDataProgresAwal();
      simpanProgresBelajar(awal);
      return awal;
    }
    return { ...buatDataProgresAwal(), ...JSON.parse(dataTersimpan) };
  } catch (err) {
    return buatDataProgresAwal();
  }
}

/**
 * Fungsi simpanProgresBelajar: Menyimpan objek progres ke localStorage.
 * Masukan: dataProgres (Object)
 */
function simpanProgresBelajar(dataProgres) {
  try {
    localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(dataProgres));
  } catch (err) {
    console.warn("Gagal menyimpan ke localStorage:", err);
  }
}

/**
 * Fungsi tentukanPangkatArsitek: Menentukan gelar pangkat berdasarkan skorSiswa dan proyek.
 * Masukan: skor (Number), proyekTerbuka (Number)
 * Hasil: String nama pangkat
 */
function tentukanPangkatArsitek(skor, proyekTerbuka) {
  if (proyekTerbuka >= 5 && skor >= 350) return "Arsitek Utama";
  if (proyekTerbuka >= 3 || skor >= 200) return "Arsitek Junior";
  if (proyekTerbuka >= 2 || skor >= 80) return "Drafter";
  return "Magang";
}

/**
 * Fungsi catatHasilSoal: Mencatat hasil pengerjaan soal, menambah skor & combo.
 * Masukan: idSoal (String), apakahBenar (Boolean), poinDasar (Number)
 * Hasil: Objek status pembaruan skor
 */
function catatHasilSoal(idSoal, apakahBenar, poinDasar = 15) {
  const progres = ambilProgresBelajar();
  const sudahPernahBenar = progres.riwayatSoal[idSoal] === true;

  if (apakahBenar) {
    progres.comboSaatIni += 1;
    if (progres.comboSaatIni > progres.comboTerbaik) {
      progres.comboTerbaik = progres.comboSaatIni;
    }
    // Berikan poin penuh jika baru pertama kali benar, atau bonus latihan jika diulang
    const tambahanCombo = progres.comboSaatIni >= 3 ? 5 : 0;
    const poinDiterima = sudahPernahBenar ? 5 : (poinDasar + tambahanCombo);
    progres.skorSiswa += poinDiterima;
    progres.riwayatSoal[idSoal] = true;
    simpanProgresBelajar(progres);
    perbaruiTampilanBarAtas();
    return { poinDiterima, combo: progres.comboSaatIni, totalSkor: progres.skorSiswa };
  } else {
    progres.comboSaatIni = 0;
    if (!sudahPernahBenar) {
      progres.riwayatSoal[idSoal] = false;
    }
    simpanProgresBelajar(progres);
    perbaruiTampilanBarAtas();
    return { poinDiterima: 0, combo: 0, totalSkor: progres.skorSiswa };
  }
}

/**
 * Fungsi bukaProyekBerikutnya: Membuka akses ke proyek selanjutnya setelah lulus Gerbang Proyek.
 * Masukan: nomorProyekSaatIni (Number 1..5), skorGerbang (Number 0..100)
 */
function bukaProyekBerikutnya(nomorProyekSaatIni, skorGerbang) {
  const progres = ambilProgresBelajar();
  const petaId = { 1: "proyek1", 2: "proyek2", 3: "proyek3", 4: "lapangan", 5: "ujian" };
  const idProyek = petaId[nomorProyekSaatIni];

  if (idProyek) {
    progres.skorGerbang[idProyek] = Math.max(progres.skorGerbang[idProyek] || 0, Math.round(skorGerbang));
  }

  if (skorGerbang >= BATAS_LULUS) {
    if (idProyek && !progres.proyekSelesai[idProyek]) {
      progres.proyekSelesai[idProyek] = true;
      progres.skorSiswa += 50; // Bonus kelulusan proyek
    }
    if (nomorProyekSaatIni + 1 > progres.proyekTerbukaMaksimal) {
      progres.proyekTerbukaMaksimal = Math.min(5, nomorProyekSaatIni + 1);
    }
  }
  simpanProgresBelajar(progres);
  perbaruiTampilanBarAtas();
  renderMenuNavigasi();
}

/**
 * Fungsi cekAksesHalaman: Memastikan siswa tidak melompati proyek yang masih terkunci lewat URL.
 * Jika terkunci, otomatis dialihkan ke proyek terakhir yang boleh diakses.
 */
function cekAksesHalaman() {
  const namaFile = window.location.pathname.split("/").pop() || "index.html";
  const infoHalaman = URUTAN_PROYEK.find(p => p.file === namaFile) || URUTAN_PROYEK[0];
  const progres = ambilProgresBelajar();

  if (infoHalaman.nomorUrut > progres.proyekTerbukaMaksimal) {
    const halamanTerakhir = URUTAN_PROYEK.find(
      p => p.nomorUrut === progres.proyekTerbukaMaksimal
    ) || URUTAN_PROYEK[1];

    sessionStorage.setItem(
      "pesanAlihProyek",
      `Selesaikan ${halamanTerakhir.nama} dengan minimal skor ${BATAS_LULUS}% dulu ya, Arsitek!`
    );
    window.location.href = halamanTerakhir.file;
    return false;
  }
  return true;
}

/**
 * Fungsi tampilkanNotifikasiMaskot: Menampilkan pesan pop-up maskot saat menu terkunci diklik.
 * Masukan: teksPesan (String), ekspresi ("standar" | "semangat" | "senang")
 */
function tampilkanNotifikasiMaskot(teksPesan, ekspresi = "semangat") {
  let elemenNotif = document.getElementById("notifikasi-maskot-global");
  if (!elemenNotif) {
    elemenNotif = document.createElement("div");
    elemenNotif.id = "notifikasi-maskot-global";
    elemenNotif.className = "notifikasi-maskot-melayang";
    document.body.appendChild(elemenNotif);
  }

  elemenNotif.innerHTML = `
    <div class="ikon-maskot-wadah" style="width:52px;height:52px;">
      ${buatSvgMaskot(ekspresi)}
    </div>
    <div>
      <div class="nama-maskot">Ir. Bima (Maskot Proyek)</div>
      <div style="font-size:0.88rem;">${teksPesan}</div>
    </div>
  `;

  elemenNotif.classList.add("tampil");
  clearTimeout(window.timerNotifMaskot);
  window.timerNotifMaskot = setTimeout(() => {
    elemenNotif.classList.remove("tampil");
  }, 4000);
}

/**
 * Fungsi renderMenuNavigasi: Menampilkan daftar menu proyek beserta ikon gembok/centang.
 */
function renderMenuNavigasi() {
  const wadahMenu = document.getElementById("daftar-menu-navigasi");
  if (!wadahMenu) return;

  const progres = ambilProgresBelajar();
  const namaFileAktif = window.location.pathname.split("/").pop() || "index.html";

  wadahMenu.innerHTML = URUTAN_PROYEK.map(item => {
    const apakahAktif = namaFileAktif === item.file;
    const apakahTerkunci = item.nomorUrut > progres.proyekTerbukaMaksimal;
    const apakahSelesai = item.nomorUrut > 0 && progres.proyekSelesai[item.id];

    let ikonStatus = "📐";
    let kelasTambahan = "";

    if (item.id === "beranda") ikonStatus = "🏢";
    else if (item.id === "tentang") ikonStatus = "📘";
    else if (apakahSelesai) {
      ikonStatus = "✅";
      kelasTambahan = "status-selesai";
    } else if (apakahTerkunci) {
      ikonStatus = "🔒";
      kelasTambahan = "status-terkunci";
    } else {
      ikonStatus = "🔓";
    }

    if (apakahAktif) kelasTambahan += " aktif";

    if (apakahTerkunci) {
      const namaProyekSebelumnya = URUTAN_PROYEK.find(
        p => p.nomorUrut === progres.proyekTerbukaMaksimal
      )?.nama || "Proyek sebelumnya";
      return `
        <li class="item-menu-navigasi">
          <a href="javascript:void(0)" class="${kelasTambahan.trim()}"
             onclick="tampilkanNotifikasiMaskot('Selesaikan ${namaProyekSebelumnya} dulu ya, Arsitek! Minimal skor Gerbang Proyek ${BATAS_LULUS}%.', 'semangat')"
             title="Terkunci: Selesaikan proyek sebelumnya">
            <span>${ikonStatus}</span>
            <span>${item.nama}</span>
          </a>
        </li>
      `;
    }

    return `
      <li class="item-menu-navigasi">
        <a href="${item.file}" class="${kelasTambahan.trim()}">
          <span>${ikonStatus}</span>
          <span>${item.nama}</span>
        </a>
      </li>
    `;
  }).join("");
}

/**
 * Fungsi resetProgresBelajar: Menghapus progres belajar setelah konfirmasi pengguna.
 */
function resetProgresBelajar() {
  const setuju = window.confirm(
    "Apakah kamu yakin ingin mereset seluruh progres proyek, lencana, dan skor Arsitek ke awal?"
  );
  if (setuju) {
    localStorage.removeItem(KUNCI_PENYIMPANAN);
    window.location.href = "index.html";
  }
}


/* ========== [BAGIAN: 3. GAMBAR SEGITIGA (ANTI ERROR & KONSISTEN)] ========== */

/**
 * Fungsi putarTitik2D: Memutar titik (x, y) sebesar sudutDerajat terhadap titik pusat (pusatX, pusatY).
 * Menggunakan rumus trigonometri murni.
 */
function putarTitik2D(x, y, sudutDerajat, pusatX = 0, pusatY = 0) {
  const radian = (Number(sudutDerajat) || 0) * (Math.PI / 180);
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  const geserX = x - pusatX;
  const geserY = y - pusatY;
  return {
    x: pusatX + (geserX * cos - geserY * sin),
    y: pusatY + (geserX * sin + geserY * cos)
  };
}

/**
 * Fungsi gambarSegitigaSiku: Fungsi PUSAT untuk menggambar segitiga siku-siku dengan SVG.
 * Masukan:
 *  - wadah: Elemen DOM atau ID string tempat SVG digambar
 *  - sisiA: Panjang sisi tegak (angka 1 - 20)
 *  - sisiB: Panjang sisi alas (angka 1 - 20)
 *  - opsi: { rotasi, tampilkanPersegi, labelA, labelB, labelC, interaktifSisi, klikSisiCallback }
 * Hasil: Objek { valid, sisiA, sisiB, sisiC, faktorSkala }
 */
function gambarSegitigaSiku(wadah, sisiA, sisiB, opsi = {}) {
  const elemenWadah = typeof wadah === "string" ? document.getElementById(wadah) : wadah;
  if (!elemenWadah) return { valid: false, alasan: "Wadah tidak ditemukan" };

  // 4. Menghapus gambar lama sebelum menggambar ulang
  elemenWadah.innerHTML = "";

  const batasMin = opsi.batasMin || 1;
  const batasMaks = opsi.batasMaks || 20;
  const angkaA = Number(sisiA);
  const angkaB = Number(sisiB);

  // Validasi input ketat: harus angka > 0 dan dalam rentang batasMin..batasMaks
  if (
    sisiA === "" || sisiB === "" ||
    sisiA === null || sisiB === null ||
    !Number.isFinite(angkaA) || !Number.isFinite(angkaB) ||
    angkaA < batasMin || angkaA > batasMaks ||
    angkaB < batasMin || angkaB > batasMaks
  ) {
    elemenWadah.innerHTML = `
      <div class="pesan-error-svg" role="alert">
        ⚠️ Ukuran sisi harus berupa angka valid antara <strong>${batasMin}</strong> sampai <strong>${batasMaks}</strong> satuan ya, Arsitek!
      </div>
    `;
    return { valid: false, alasan: "Input di luar rentang atau bukan angka" };
  }

  const angkaC = hitungSisiMiring(angkaA, angkaB);
  const sudutRotasi = Number(opsi.rotasi) || 0;
  const tampilkanPersegi = Boolean(opsi.tampilkanPersegi);

  // 1. Titik sudut lokal matematika (C di kiri bawah (0,0), B di kanan bawah (b,0), A di kiri atas (0,a))
  // Di layar SVG sumbu Y ke bawah, maka dalam koordinat lokal Pra-Skala:
  // C = (0, 0), B = (angkaB, 0), A = (0, -angkaA)
  const titikAwal = {
    C: { x: 0, y: 0 },
    B: { x: angkaB, y: 0 },
    A: { x: 0, y: -angkaA }
  };

  // Titik pusat segitiga (centroid) sebagai poros rotasi
  const pusatSegitiga = {
    x: (titikAwal.A.x + titikAwal.B.x + titikAwal.C.x) / 3,
    y: (titikAwal.A.y + titikAwal.B.y + titikAwal.C.y) / 3
  };

  // Persegi di tiap sisi (jika tampilkanPersegi = true) dalam koordinat lokal
  // Persegi sisi A (di sebelah kiri segmen CA): keluar ke arah X negatif
  const persegiA_lokal = [
    titikAwal.C,
    titikAwal.A,
    { x: -angkaA, y: -angkaA },
    { x: -angkaA, y: 0 }
  ];

  // Persegi sisi B (di sebelah bawah segmen CB): keluar ke arah Y positif
  const persegiB_lokal = [
    titikAwal.C,
    titikAwal.B,
    { x: angkaB, y: angkaB },
    { x: 0, y: angkaB }
  ];

  // Persegi sisi C (di luar segmen miring AB): vektor AB = (b, a), normal luar = (a, -b)
  const persegiC_lokal = [
    titikAwal.A,
    titikAwal.B,
    { x: titikAwal.B.x + angkaA, y: titikAwal.B.y - angkaB },
    { x: titikAwal.A.x + angkaA, y: titikAwal.A.y - angkaB }
  ];

  // Rotasikan semua titik terhadap pusatSegitiga
  const C_rot = putarTitik2D(titikAwal.C.x, titikAwal.C.y, sudutRotasi, pusatSegitiga.x, pusatSegitiga.y);
  const B_rot = putarTitik2D(titikAwal.B.x, titikAwal.B.y, sudutRotasi, pusatSegitiga.x, pusatSegitiga.y);
  const A_rot = putarTitik2D(titikAwal.A.x, titikAwal.A.y, sudutRotasi, pusatSegitiga.x, pusatSegitiga.y);

  const pA_rot = persegiA_lokal.map(p => putarTitik2D(p.x, p.y, sudutRotasi, pusatSegitiga.x, pusatSegitiga.y));
  const pB_rot = persegiB_lokal.map(p => putarTitik2D(p.x, p.y, sudutRotasi, pusatSegitiga.x, pusatSegitiga.y));
  const pC_rot = persegiC_lokal.map(p => putarTitik2D(p.x, p.y, sudutRotasi, pusatSegitiga.x, pusatSegitiga.y));

  // Kumpulkan semua titik yang harus muat di viewBox untuk menghitung skala otomatis
  let semuaTitik = [A_rot, B_rot, C_rot];
  if (tampilkanPersegi) {
    semuaTitik = semuaTitik.concat(pA_rot, pB_rot, pC_rot);
  }

  const daftarX = semuaTitik.map(p => p.x);
  const daftarY = semuaTitik.map(p => p.y);
  const minX = Math.min(...daftarX);
  const maxX = Math.max(...daftarX);
  const minY = Math.min(...daftarY);
  const maxY = Math.max(...daftarY);

  const lebarBentuk = Math.max(maxX - minX, 0.5);
  const tinggiBentuk = Math.max(maxY - minY, 0.5);

  // 2. Menghitung skala otomatis (faktorSkala) agar selalu muat di viewBox 400x300 dengan margin
  const lebarViewBox = 400;
  const tinggiViewBox = 300;
  const margin = tampilkanPersegi ? 36 : 48;

  const skalaX = (lebarViewBox - margin * 2) / lebarBentuk;
  const skalaY = (tinggiViewBox - margin * 2) / tinggiBentuk;
  const faktorSkala = Math.min(skalaX, skalaY);

  const tengahLokalX = (minX + maxX) / 2;
  const tengahLokalY = (minY + maxY) / 2;

  // Fungsi konversi titik lokal terotasi ke titik layar SVG (pusat 200, 150)
  function keSvg(titik) {
    return {
      x: 200 + (titik.x - tengahLokalX) * faktorSkala,
      y: 150 + (titik.y - tengahLokalY) * faktorSkala
    };
  }

  const A = keSvg(A_rot);
  const B = keSvg(B_rot);
  const C = keSvg(C_rot);

  // Hitung tanda siku-siku kecil di titik C menggunakan vektor satuan menuju A dan B
  const panjangSiku = Math.min(18, Math.max(9, Math.min(angkaA, angkaB) * faktorSkala * 0.25));
  const panjangCA = Math.hypot(A.x - C.x, A.y - C.y) || 1;
  const panjangCB = Math.hypot(B.x - C.x, B.y - C.y) || 1;
  const uCA = { x: (A.x - C.x) / panjangCA, y: (A.y - C.y) / panjangCA };
  const uCB = { x: (B.x - C.x) / panjangCB, y: (B.y - C.y) / panjangCB };

  const siku1 = { x: C.x + uCA.x * panjangSiku, y: C.y + uCA.y * panjangSiku };
  const siku2 = {
    x: C.x + uCA.x * panjangSiku + uCB.x * panjangSiku,
    y: C.y + uCA.y * panjangSiku + uCB.y * panjangSiku
  };
  const siku3 = { x: C.x + uCB.x * panjangSiku, y: C.y + uCB.y * panjangSiku };

  // Fungsi mencari posisi label di luar sisi menggunakan vektor menjauhi centroid segitiga
  const centroidSvg = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
      function posisiLabelLuar(titik1, titik2, jarakOffset = 8, teks = "", ukuranFont = 13) {
    const tengah = { x: (titik1.x + titik2.x) / 2, y: (titik1.y + titik2.y) / 2 };
    const dx = titik2.x - titik1.x;
    const dy = titik2.y - titik1.y;
    const len = Math.hypot(dx, dy) || 1;
    let n1 = { x: -dy / len, y: dx / len };
    const vektorDariPusat = { x: tengah.x - centroidSvg.x, y: tengah.y - centroidSvg.y };
    if (n1.x * vektorDariPusat.x + n1.y * vektorDariPusat.y < 0) {
      n1 = { x: -n1.x, y: -n1.y };
    }

    const lebarTeks = String(teks).length * ukuranFont * 0.6;
    const tinggiTeks = ukuranFont * 1.2;

    function hitung(n) {
      const jarak = jarakOffset + Math.abs(n.x) * (lebarTeks / 2) + Math.abs(n.y) * (tinggiTeks / 2);
      return { x: tengah.x + n.x * jarak, y: tengah.y + n.y * jarak };
    }
    function muat(p) {
      return p.x - lebarTeks / 2 >= 4 && p.x + lebarTeks / 2 <= 396 &&
             p.y - tinggiTeks / 2 >= 4 && p.y + tinggiTeks / 2 <= 296;
    }

    // 1) Coba di luar segitiga. 2) Kalau terpotong, coba di dalam. 3) Terakhir, geser agar tetap di dalam gambar.
    const luar = hitung(n1);
    if (muat(luar)) return luar;
    const dalam = hitung({ x: -n1.x, y: -n1.y });
    if (muat(dalam)) return dalam;
    return {
      x: Math.min(Math.max(luar.x, 4 + lebarTeks / 2), 396 - lebarTeks / 2),
      y: Math.min(Math.max(luar.y, 4 + tinggiTeks / 2), 296 - tinggiTeks / 2)
    };
  }

  let elemenPersegiHtml = "";
  if (tampilkanPersegi) {
    const polyA = pA_rot.map(keSvg);
    const polyB = pB_rot.map(keSvg);
    const polyC = pC_rot.map(keSvg);

    const pusatPersegi = poly => ({
      x: (poly[0].x + poly[2].x) / 2,
      y: (poly[0].y + poly[2].y) / 2
    });

    const pusatPA = pusatPersegi(polyA);
    const pusatPB = pusatPersegi(polyB);
    const pusatPC = pusatPersegi(polyC);

          elemenPersegiHtml = `
      <!-- Persegi Sisi a -->
      <polygon points="${polyA.map(p => `${formatAngka(p.x)},${formatAngka(p.y)}`).join(" ")}"
               fill="rgba(56, 189, 248, 0.25)" stroke="#38BDF8" stroke-width="1.8" stroke-dasharray="4 2"/>
      <text x="${formatAngka(pusatPA.x)}" y="${formatAngka(pusatPA.y)}" fill="#E0F2FE"
            font-size="12" font-weight="700" text-anchor="middle" dominant-baseline="middle">
        <tspan x="${formatAngka(pusatPA.x)}" dy="-0.3em">a = ${formatAngka(angkaA)}</tspan>
        <tspan x="${formatAngka(pusatPA.x)}" dy="1.3em">a² = ${formatAngka(angkaA * angkaA)}</tspan>
      </text>

      <!-- Persegi Sisi b -->
      <polygon points="${polyB.map(p => `${formatAngka(p.x)},${formatAngka(p.y)}`).join(" ")}"
               fill="rgba(74, 222, 128, 0.25)" stroke="#4ADE80" stroke-width="1.8" stroke-dasharray="4 2"/>
      <text x="${formatAngka(pusatPB.x)}" y="${formatAngka(pusatPB.y)}" fill="#DCFCE7"
            font-size="12" font-weight="700" text-anchor="middle" dominant-baseline="middle">
        <tspan x="${formatAngka(pusatPB.x)}" dy="-0.3em">b = ${formatAngka(angkaB)}</tspan>
        <tspan x="${formatAngka(pusatPB.x)}" dy="1.3em">b² = ${formatAngka(angkaB * angkaB)}</tspan>
      </text>

      <!-- Persegi Sisi c -->
      <polygon points="${polyC.map(p => `${formatAngka(p.x)},${formatAngka(p.y)}`).join(" ")}"
               fill="rgba(255, 193, 7, 0.28)" stroke="#FFC107" stroke-width="2"/>
      <text x="${formatAngka(pusatPC.x)}" y="${formatAngka(pusatPC.y)}" fill="#FEF08A"
            font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="middle">
        <tspan x="${formatAngka(pusatPC.x)}" dy="-0.3em">c = ${formatAngka(angkaC)}</tspan>
        <tspan x="${formatAngka(pusatPC.x)}" dy="1.3em">c² = ${formatAngka(angkaA * angkaA + angkaB * angkaB)}</tspan>
      </text>
    `;
  }

  const teksLabelA = opsi.labelA !== undefined ? opsi.labelA : `a = ${formatAngka(angkaA)}`;
  const teksLabelB = opsi.labelB !== undefined ? opsi.labelB : `b = ${formatAngka(angkaB)}`;
  const teksLabelC = opsi.labelC !== undefined ? opsi.labelC : `c = ${formatAngka(angkaC)}`;

  const posLabelA = posisiLabelLuar(C, A, 8, teksLabelA, 13);
  const posLabelB = posisiLabelLuar(C, B, 8, teksLabelB, 13);
  const posLabelC = posisiLabelLuar(A, B, 8, teksLabelC, 13.5);

  // Jika mode interaktif memilih sisi diaktifkan (misal latihan "Kenali Sisi Miring")
  let elemenInteraktifSisi = "";
  if (opsi.interaktifSisi) {
    elemenInteraktifSisi = `
      <line x1="${formatAngka(C.x)}" y1="${formatAngka(C.y)}" x2="${formatAngka(A.x)}" y2="${formatAngka(A.y)}"
            stroke="transparent" stroke-width="22" style="cursor:pointer" data-sisi="a"/>
      <line x1="${formatAngka(C.x)}" y1="${formatAngka(C.y)}" x2="${formatAngka(B.x)}" y2="${formatAngka(B.y)}"
            stroke="transparent" stroke-width="22" style="cursor:pointer" data-sisi="b"/>
      <line x1="${formatAngka(A.x)}" y1="${formatAngka(A.y)}" x2="${formatAngka(B.x)}" y2="${formatAngka(B.y)}"
            stroke="transparent" stroke-width="22" style="cursor:pointer" data-sisi="c"/>
    `;
  }

  // 3. Menggambar SVG utuh dengan viewBox tetap 0 0 400 300
  elemenWadah.innerHTML = `
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" role="img"
         aria-label="Segitiga siku-siku dengan sisi a ${formatAngka(angkaA)}, sisi b ${formatAngka(angkaB)}, dan sisi miring c ${formatAngka(angkaC)}">
      ${elemenPersegiHtml}

      <!-- Polygon Segitiga Siku-Siku -->
      <polygon points="${formatAngka(C.x)},${formatAngka(C.y)} ${formatAngka(B.x)},${formatAngka(B.y)} ${formatAngka(A.x)},${formatAngka(A.y)}"
               fill="rgba(255, 255, 255, 0.12)" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/>

      <!-- Tanda Siku-Siku Kecil di Sudut C -->
      <polyline points="${formatAngka(siku1.x)},${formatAngka(siku1.y)} ${formatAngka(siku2.x)},${formatAngka(siku2.y)} ${formatAngka(siku3.x)},${formatAngka(siku3.y)}"
                fill="none" stroke="#FFC107" stroke-width="2.2"/>

      <!-- Garis Sisi Miring dengan Aksen Kuning -->
      <line x1="${formatAngka(A.x)}" y1="${formatAngka(A.y)}" x2="${formatAngka(B.x)}" y2="${formatAngka(B.y)}"
            stroke="${opsi.interaktifSisi ? '#FFFFFF' : '#FFC107'}" stroke-width="3.2" stroke-linecap="round"/>

      <!-- Titik Sudut -->
      <circle cx="${formatAngka(A.x)}" cy="${formatAngka(A.y)}" r="4.5" fill="#FFC107"/>
      <circle cx="${formatAngka(B.x)}" cy="${formatAngka(B.y)}" r="4.5" fill="#FFC107"/>
      <circle cx="${formatAngka(C.x)}" cy="${formatAngka(C.y)}" r="4.5" fill="#38BDF8"/>

      <!-- Label Sisi a, b, c -->
            <text visibility="${tampilkanPersegi ? 'hidden' : 'visible'}" x="${formatAngka(posLabelA.x)}" y="${formatAngka(posLabelA.y)}"
            fill="#7DD3FC" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="middle">${teksLabelA}</text>
      <text visibility="${tampilkanPersegi ? 'hidden' : 'visible'}" x="${formatAngka(posLabelB.x)}" y="${formatAngka(posLabelB.y)}"
            fill="#86EFAC" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="middle">${teksLabelB}</text>
      <text visibility="${tampilkanPersegi ? 'hidden' : 'visible'}" x="${formatAngka(posLabelC.x)}" y="${formatAngka(posLabelC.y)}"
            fill="#FDE047" font-size="13.5" font-weight="700" text-anchor="middle" dominant-baseline="middle">${teksLabelC}</text>

      ${elemenInteraktifSisi}
    </svg>
  `;

  if (opsi.interaktifSisi && typeof opsi.klikSisiCallback === "function") {
    const garisInteraktif = elemenWadah.querySelectorAll("line[data-sisi]");
    garisInteraktif.forEach(garis => {
      garis.addEventListener("pointerdown", () => {
        opsi.klikSisiCallback(garis.getAttribute("data-sisi"));
      });
    });
  }

  return {
    valid: true,
    sisiA: angkaA,
    sisiB: angkaB,
    sisiC: angkaC,
    faktorSkala
  };
}

/**
 * Fungsi gambarSegitigaIstimewa: Menggambar segitiga sudut istimewa (45-45-90 atau 30-60-90)
 * dengan perbandingan sisi tetap.
 * Masukan: wadah (DOM/String), jenis ("45-45-90" | "30-60-90"), pengali (Number)
 */
function gambarSegitigaIstimewa(wadah, jenis = "45-45-90", pengali = 1) {
  const k = Math.max(1, Math.min(20, Number(pengali) || 1));
  if (jenis === "45-45-90") {
    return gambarSegitigaSiku(wadah, 5, 5, {
      labelA: `${formatAngka(k)}`,
      labelB: `${formatAngka(k)}`,
      labelC: `${formatAngka(k)}√2 (≈ ${formatAngka(k * Math.SQRT2)})`
    });
  } else {
    // 30-60-90: perbandingan 1 : √3 : 2
    return gambarSegitigaSiku(wadah, 5, 5 * Math.sqrt(3), {
      labelA: `${formatAngka(k)} (depan 30°)`,
      labelB: `${formatAngka(k)}√3 (depan 60°)`,
      labelC: `${formatAngka(2 * k)} (miring)`
    });
  }
}

/**
 * Fungsi ujiGambarSegitigaMandiri: Menjalankan pengecekan otomatis untuk kasus uji
 * (3,4), (5,12), (1,20), (20,1), dan nilai kosong/huruf di memori tersembunyi.
 */
function ujiGambarSegitigaMandiri() {
  const wadahUji = document.createElement("div");
  const hasilUji = {
    kasus_3_4: gambarSegitigaSiku(wadahUji, 3, 4, { tampilkanPersegi: true }),
    kasus_5_12: gambarSegitigaSiku(wadahUji, 5, 12),
    kasus_1_20: gambarSegitigaSiku(wadahUji, 1, 20),
    kasus_20_1: gambarSegitigaSiku(wadahUji, 20, 1),
    kasus_kosong: gambarSegitigaSiku(wadahUji, "", 4),
    kasus_huruf: gambarSegitigaSiku(wadahUji, "abc", 5)
  };
  console.info("[Pengecekan Mandiri gambarSegitigaSiku]:", hasilUji);
  return hasilUji;
}


/* ========== [BAGIAN: 4. DATA SOAL] ========== */

// UBAH DI SINI: Anda dapat menambah atau mengedit soal pada array daftarSoal di bawah ini.
// Struktur setiap objek soal seragam: { id, proyek, jenis, level, pertanyaan, data, kunci, petunjuk1, petunjuk2, kesalahanUmum, penjelasan }
const daftarSoal = [
  // --- SOAL TANTANGAN HARIAN ---
  {
    id: "harian-1",
    proyek: "harian",
    jenis: "isian-angka",
    level: 1,
    pertanyaan: "Tiang bendera upacara di halaman SMP memiliki tinggi 8 meter. Tali pengerek bendera ditarik dari puncak tiang ke patok di tanah yang berjarak 6 meter dari kaki tiang. Berapa meter panjang tali pengerek bendera tersebut?",
    data: { sisiA: 8, sisiB: 6 },
    kunci: 10,
    petunjuk1: "Tinggi tiang (a = 8 m) dan jarak patok di tanah (b = 6 m) membentuk sudut siku-siku. Tali bendera adalah sisi miring (c).",
    petunjuk2: "Gunakan rumus c² = a² + b² = 8² + 6² = 64 + 36.",
    kesalahanUmum: {
      "14": "Kamu menjumlahkan langsung 8 + 6 = 14. Ingat, kuadratkan dulu masing-masing sisi (8² + 6²) lalu tarik akarnya ya!",
      "100": "100 adalah nilai c² (64 + 36). Jangan lupa diakarkan (√100) untuk mendapatkan panjang c!",
      "196": "Kamu menghitung (8 + 6)² = 14² = 196. Seharusnya 8² + 6² dihitung terpisah terlebih dahulu."
    },
    penjelasan: "Panjang tali adalah sisi miring: c = √(8² + 6²) = √(64 + 36) = √100 = 10 meter."
  },
  {
    id: "harian-2",
    proyek: "harian",
    jenis: "isian-angka",
    level: 2,
    pertanyaan: "Sebuah tangga kayu sepanjang 5 meter disandarkan pada dinding rumah. Jika jarak ujung bawah tangga ke dinding adalah 3 meter, berapa meter tinggi dinding yang dicapai ujung atas tangga?",
    data: { sisiA: 4, sisiB: 3 },
    kunci: 4,
    petunjuk1: "Panjang tangga (5 m) adalah sisi miring (c), sedangkan jarak kaki tangga (3 m) adalah sisi alas (b).",
    petunjuk2: "Karena mencari sisi tegak (a), gunakan pengurangan: a² = c² - b² = 5² - 3².",
    kesalahanUmum: {
      "16": "16 adalah nilai a² (25 - 9). Tarik akar kuadrat dari 16 untuk memperoleh tinggi dinding!",
      "5.83": "Kamu menjumlahkan 5² + 3². Karena 5 m adalah sisi miring (tangga), seharusnya dikurangi: 5² - 3²."
    },
    penjelasan: "Tinggi dinding: a = √(c² - b²) = √(5² - 3²) = √(25 - 9) = √16 = 4 meter."
  },
  {
    id: "harian-3",
    proyek: "harian",
    jenis: "isian-angka",
    level: 2,
    pertanyaan: "Lapangan futsal sekolah berbentuk persegi panjang dengan ukuran panjang 12 meter dan lebar 5 meter. Berapa meter panjang garis diagonal lapangan futsal tersebut?",
    data: { sisiA: 5, sisiB: 12 },
    kunci: 13,
    petunjuk1: "Garis diagonal membagi persegi panjang menjadi dua segitiga siku-siku dengan sisi siku-siku 12 m dan 5 m.",
    petunjuk2: "Hitung c = √(12² + 5²) = √(144 + 25).",
    kesalahanUmum: {
      "17": "Kamu menjumlahkan 12 + 5 = 17 tanpa menguadratkan terlebih dahulu.",
      "169": "169 adalah nilai c². Jangan lupa menarik akar kuadrat √169!"
    },
    penjelasan: "Diagonal lapangan adalah hipotenusa: c = √(12² + 5²) = √(144 + 25) = √169 = 13 meter."
  },

  // --- SOAL GERBANG PROYEK 1 (FONDASI TEOREMA PYTHAGORAS) ---
  {
    id: "gp1-1",
    proyek: "proyek1",
    jenis: "pilihan-ganda",
    level: 1,
    pertanyaan: "Pada segitiga siku-siku yang memiliki sisi siku-siku a dan b serta sisi miring (hipotenusa) c, manakah pernyataan Teorema Pythagoras yang tepat?",
    pilihan: [
      "a + b = c",
      "a² + b² = c²",
      "(a + b)² = c²",
      "a² - b² = c²"
    ],
    kunci: 1,
    petunjuk1: "Ingat kembali simulasi luas persegi di ketiga sisi segitiga siku-siku tadi.",
    petunjuk2: "Jumlah luas dua persegi pada sisi siku-siku sama dengan luas persegi pada sisi miring.",
    kesalahanUmum: {
      "0": "Panjang sisi tidak bisa dijumlahkan langsung tanpa dikuadratkan.",
      "2": "Hati-hati! (a + b)² berbeda nilainya dengan a² + b²."
    },
    penjelasan: "Teorema Pythagoras menyatakan bahwa kuadrat sisi miring sama dengan jumlah kuadrat kedua sisi siku-sikunya: a² + b² = c²."
  },
  {
    id: "gp1-2",
    proyek: "proyek1",
    jenis: "isian-angka",
    level: 1,
    pertanyaan: "Arsitek sedang membuat kuda-kuda atap rumah berbentuk segitiga siku-siku dengan tinggi 3 meter dan lebar alas 4 meter. Berapa meter panjang kemiringan atap (sisi miring) tersebut?",
    kunci: 5,
    petunjuk1: "Sisi tegak a = 3 m dan sisi alas b = 4 m. Kamu mencari sisi miring c.",
    petunjuk2: "c² = 3² + 4² = 9 + 16 = 25. Berapakah √25?",
    kesalahanUmum: {
      "7": "Kamu menjumlahkan 3 + 4 = 7. Kuadratkan dulu masing-masing sisi!",
      "25": "25 masih berupa nilai c². Jangan lupa diakarkan menjadi √25!",
      "49": "Kamu menghitung (3 + 4)² = 7² = 49. Seharusnya 3² + 4²."
    },
    penjelasan: "c = √(3² + 4²) = √(9 + 16) = √25 = 5 meter."
  },
  {
    id: "gp1-3",
    proyek: "proyek1",
    jenis: "isian-angka",
    level: 2,
    pertanyaan: "Seorang siswa menerbangkan layang-layang dengan panjang benang 13 meter. Jarak mendatar siswa ke titik tepat di bawah layang-layang adalah 12 meter. Berapa meter tinggi layang-layang dari permukaan tanah (abaikan tinggi tangan siswa)?",
    kunci: 5,
    petunjuk1: "Panjang benang 13 m adalah sisi miring (c), dan jarak mendatar 12 m adalah alas (b).",
    petunjuk2: "Gunakan pengurangan: a² = 13² - 12² = 169 - 144.",
    kesalahanUmum: {
      "25": "25 adalah hasil a² (169 - 144). Jangan lupa tarik akar kuadratnya (√25)!",
      "1": "Kamu mengurangi langsung 13 - 12 = 1. Gunakan selisih kuadrat 13² - 12²."
    },
    penjelasan: "Tinggi layang-layang merupakan sisi tegak: a = √(13² - 12²) = √(169 - 144) = √25 = 5 meter."
  },
  {
    id: "gp1-4",
    proyek: "proyek1",
    jenis: "pilihan-ganda",
    level: 2,
    pertanyaan: "Tukang bangunan Mesir Kuno membuat sudut siku-siku pada fondasi bangunan menggunakan seutas tali yang dibagi menjadi 12 bagian sama panjang dengan simpul. Berapa perbandingan tiga sisi segitiga yang mereka bentuk?",
    pilihan: [
      "2 : 4 : 6",
      "3 : 4 : 5",
      "4 : 4 : 4",
      "1 : 2 : 3"
    ],
    kunci: 1,
    petunjuk1: "Jumlah ketiga sisinya harus 12 bagian (3 + 4 + 5 = 12) dan memenuhi a² + b² = c².",
    petunjuk2: "Cek: 3² + 4² = 9 + 16 = 25 = 5².",
    kesalahanUmum: {
      "0": "2 + 4 + 6 memang 12, tetapi 2² + 4² tidak sama dengan 6².",
      "2": "Segitiga dengan sisi 4 : 4 : 4 adalah segitiga sama sisi (sudutnya 60°, bukan 90°)."
    },
    penjelasan: "Tali 12 bagian direntangkan dengan ukuran sisi 3, 4, dan 5 satuan karena 3² + 4² = 5², sehingga sudut di hadapan sisi 5 pasti siku-siku (90°)."
  }
];


/* ========== [BAGIAN: 5. SOAL ADAPTIF & GERBANG PROYEK] ========== */

/**
 * Fungsi periksaJawabanSoal: Memeriksa jawaban siswa terhadap suatu objek soal,
 * mendeteksi kesalahan umum, dan mengembalikan feedback terperinci.
 * Masukan: soal (Object), jawabanSiswa (String/Number)
 * Hasil: { benar (Boolean), pesanFeedback (String) }
 */
function periksaJawabanSoal(soal, jawabanSiswa) {
  if (jawabanSiswa === "" || jawabanSiswa === null || jawabanSiswa === undefined) {
    return {
      benar: false,
      peringatan: true,
      pesanFeedback: "⚠️ Isi atau pilih jawabanmu terlebih dahulu sebelum memeriksa ya, Arsitek!"
    };
  }

  const teksJawaban = String(jawabanSiswa).trim().replace(",", ".");
  const apakahBenar =
    soal.jenis === "pilihan-ganda"
      ? Number(teksJawaban) === Number(soal.kunci)
      : Math.abs(Number(teksJawaban) - Number(soal.kunci)) < 0.05;

  if (apakahBenar) {
    return {
      benar: true,
      pesanFeedback: `✅ <strong>Tepat Sekali!</strong> ${soal.penjelasan}`
    };
  }

  // Cek apakah jawaban siswa termasuk kesalahan konsep umum yang sudah dipetakan
  if (soal.kesalahanUmum && soal.kesalahanUmum[teksJawaban]) {
    return {
      benar: false,
      pesanFeedback: `❌ <strong>Hampir tepat, perhatikan ini:</strong> ${soal.kesalahanUmum[teksJawaban]}`
    };
  }

  return {
    benar: false,
    pesanFeedback: `❌ <strong>Belum tepat.</strong> Coba gunakan tombol Petunjuk di bawah atau periksa kembali mana yang merupakan sisi miring dan sisi siku-siku.`
  };
}

/**
 * Fungsi renderGerbangProyek: Merender kuis mini "Gerbang Proyek" di akhir halaman materi.
 * Masukan: idWadah (String), kodeProyek ("proyek1" | "proyek2" | "proyek3"), nomorProyek (1|2|3), halamanBerikutnya (String)
 */
function renderGerbangProyek(idWadah, kodeProyek, nomorProyek, halamanBerikutnya) {
  const wadah = document.getElementById(idWadah);
  if (!wadah) return;

  const soalProyek = daftarSoal.filter(s => s.proyek === kodeProyek);
  if (soalProyek.length === 0) return;

  wadah.innerHTML = `
    <div class="kepala-kartu">
      <div>
        <span class="label-kode-teknik">GERBANG PROYEK ${nomorProyek}</span>
        <h2 class="judul-kartu">Uji Kelayakan Konstruksi (Syarat Lulus: ${BATAS_LULUS}%)</h2>
      </div>
      <button type="button" class="tombol-garis" onclick="bacakanTeks('Gerbang Proyek ${nomorProyek}. Jawab minimal ${BATAS_LULUS} persen soal dengan benar untuk membuka proyek berikutnya.')">
        🔊 Bacakan Instruksi
      </button>
    </div>
    <p style="margin-bottom:1.25rem;">
      Selesaikan pemeriksaan struktur berikut untuk mendapatkan <strong>Lencana Helm Emas Proyek ${nomorProyek}</strong> dan membuka proyek berikutnya!
    </p>

    <div id="daftar-soal-gerbang-${kodeProyek}">
      ${soalProyek.map((soal, indeks) => `
        <div class="kelompok-slider" style="margin-bottom:1.25rem; background:var(--putih-murni);" id="blok-soal-${soal.id}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.5rem;">
            <strong>Soal ${indeks + 1} (Level ${soal.level})</strong>
            <button type="button" class="tombol-akses" style="background:#0B2A4A;color:#FFF;"
                    onclick="bacakanTeks('${soal.pertanyaan.replace(/'/g, "\\'")}')">🔊 Bacakan Soal</button>
          </div>
          <p style="margin-bottom:0.85rem;">${soal.pertanyaan}</p>

          ${soal.jenis === "pilihan-ganda" ? `
            <div style="display:grid; gap:0.5rem;">
              ${soal.pilihan.map((opsiTeks, idxOpsi) => `
                <label style="display:flex; align-items:center; gap:0.6rem; padding:0.55rem 0.75rem; border:1px solid #CBD5E1; border-radius:8px; cursor:pointer;">
                  <input type="radio" name="input-${soal.id}" value="${idxOpsi}">
                  <span>${opsiTeks}</span>
                </label>
              `).join("")}
            </div>
          ` : `
            <div style="max-width:260px;">
              <input type="number" step="any" class="input-angka" id="input-${soal.id}" placeholder="Ketik jawaban angka...">
            </div>
          `}

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.75rem;">
            <button type="button" class="tombol-garis" onclick="tampilkanPetunjukSoal('${soal.id}', 1)">💡 Petunjuk 1</button>
            <button type="button" class="tombol-garis" onclick="tampilkanPetunjukSoal('${soal.id}', 2)">💡 Petunjuk 2</button>
          </div>

          <div id="petunjuk-${soal.id}" class="kotak-petunjuk"></div>
          <div id="feedback-${soal.id}" class="kotak-feedback"></div>
        </div>
      `).join("")}
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
      <button type="button" class="tombol-utama" id="tombol-kumpul-gerbang-${kodeProyek}">
        ✅ Periksa Gerbang Proyek ${nomorProyek}
      </button>
      <button type="button" class="tombol-sekunder" id="tombol-ulang-gerbang-${kodeProyek}" style="display:none;">
        🔄 Ulangi Kuis Gerbang
      </button>
      <a href="#awal-materi" class="tombol-garis" id="tombol-kembali-materi-${kodeProyek}" style="display:none;">
        📖 Kembali ke Penjelasan Materi
      </a>
    </div>

    <div id="hasil-akhir-gerbang-${kodeProyek}" class="kotak-feedback" style="margin-top:1.25rem;"></div>
  `;

  // Event listener tombol periksa gerbang proyek
  document.getElementById(`tombol-kumpul-gerbang-${kodeProyek}`).addEventListener("click", () => {
    let jumlahBenar = 0;

    soalProyek.forEach(soal => {
      let nilaiJawaban = "";
      if (soal.jenis === "pilihan-ganda") {
        const radioTerpilih = document.querySelector(`input[name="input-${soal.id}"]:checked`);
        if (radioTerpilih) nilaiJawaban = radioTerpilih.value;
      } else {
        const inputEl = document.getElementById(`input-${soal.id}`);
        if (inputEl) nilaiJawaban = inputEl.value;
      }

      const hasil = periksaJawabanSoal(soal, nilaiJawaban);
      const kotakFb = document.getElementById(`feedback-${soal.id}`);
      kotakFb.className = `kotak-feedback tampil ${hasil.benar ? "benar" : "salah"}`;
      kotakFb.innerHTML = hasil.pesanFeedback;

      catatHasilSoal(soal.id, hasil.benar, 15);
      if (hasil.benar) jumlahBenar += 1;
    });

    const skorPersen = Math.round((jumlahBenar / soalProyek.length) * 100);
    const kotakHasilAkhir = document.getElementById(`hasil-akhir-gerbang-${kodeProyek}`);
    const tombolUlang = document.getElementById(`tombol-ulang-gerbang-${kodeProyek}`);
    const tombolKembali = document.getElementById(`tombol-kembali-materi-${kodeProyek}`);

    bukaProyekBerikutnya(nomorProyek, skorPersen);

    if (skorPersen >= BATAS_LULUS) {
      kotakHasilAkhir.className = "kotak-feedback tampil benar";
      kotakHasilAkhir.innerHTML = `
        <h3 style="margin-bottom:0.4rem;">🎉 Selamat, Arsitek! Skor Kamu: ${skorPersen}% (${jumlahBenar}/${soalProyek.length} Benar)</h3>
        <p style="margin-bottom:0.85rem;">
          Kamu berhak mendapatkan <strong>Lencana Helm Emas Proyek ${nomorProyek}</strong> dan akses menuju proyek berikutnya telah terbuka!
        </p>
        <a href="${halamanBerikutnya}" class="tombol-utama">🚀 Lanjut ke Proyek Berikutnya</a>
      `;
      tombolUlang.style.display = "inline-flex";
      tombolKembali.style.display = "none";
      tampilkanNotifikasiMaskot(`Luar biasa! Proyek ${nomorProyek} lulus dengan skor ${skorPersen}%!`, "senang");
    } else {
      kotakHasilAkhir.className = "kotak-feedback tampil salah";
      kotakHasilAkhir.innerHTML = `
        <h3 style="margin-bottom:0.4rem;">👷 Skor Kamu: ${skorPersen}% (${jumlahBenar}/${soalProyek.length} Benar) — Belum Mencapai ${BATAS_LULUS}%</h3>
        <p>
          Jangan menyerah, Arsitek! Pelajari penjelasan pada setiap soal di atas, lalu klik <strong>Ulangi Kuis Gerbang</strong> atau baca kembali materi.
        </p>
      `;
      tombolUlang.style.display = "inline-flex";
      tombolKembali.style.display = "inline-flex";
      tampilkanNotifikasiMaskot(`Skormu ${skorPersen}%. Yuk perbaiki sedikit lagi agar mencapai ${BATAS_LULUS}%!`, "semangat");
    }
  });

  // Event listener tombol ulang
  document.getElementById(`tombol-ulang-gerbang-${kodeProyek}`).addEventListener("click", () => {
    renderGerbangProyek(idWadah, kodeProyek, nomorProyek, halamanBerikutnya);
  });
}

/**
 * Fungsi tampilkanPetunjukSoal: Menampilkan petunjuk bertahap (Hint 1 atau Hint 2) pada soal.
 */
function tampilkanPetunjukSoal(idSoal, nomorPetunjuk) {
  const soal = daftarSoal.find(s => s.id === idSoal);
  const kotakPetunjuk = document.getElementById(`petunjuk-${idSoal}`);
  if (!soal || !kotakPetunjuk) return;

  kotakPetunjuk.classList.add("tampil");
  if (nomorPetunjuk === 1) {
    kotakPetunjuk.innerHTML = `💡 <strong>Petunjuk 1:</strong> ${soal.petunjuk1}`;
  } else {
    kotakPetunjuk.innerHTML = `
      💡 <strong>Petunjuk 1:</strong> ${soal.petunjuk1}<br>
      🧭 <strong>Petunjuk 2:</strong> ${soal.petunjuk2}
    `;
  }
}


/* ========== [BAGIAN: 6. DRAG & GESER (FUNGSI DASAR)] ========== */
// Catatan: Implementasi penuh 5 jenis soal interaktif drag & geser akan dimuat di latihan.html (Tahap 3)
// menggunakan komponen dan pola feedback yang terpusat di sini.


/* ========== [BAGIAN: 7. TANGGA TEPAT (FUNGSI DASAR)] ========== */
// Catatan: Mini-game Tangga Tepat dimuat pada halaman Lapangan Proyek (latihan.html di Tahap 3).


/* ========== [BAGIAN: 8. JURNAL REFLEKSI] ========== */

/**
 * Fungsi renderJurnalRefleksi: Menampilkan komponen refleksi diri di akhir proyek.
 * Masukan: idWadah (String), kodeProyek (String), saranBagianUlang (String)
 */
function renderJurnalRefleksi(idWadah, kodeProyek, saranBagianUlang) {
  const wadah = document.getElementById(idWadah);
  if (!wadah) return;

  const progres = ambilProgresBelajar();
  const dataLama = progres.jurnalRefleksi[kodeProyek] || { emoji: "", catatan: "" };

  wadah.innerHTML = `
    <div class="kepala-kartu">
      <div>
        <span class="label-kode-teknik">JURNAL ARSITEK</span>
        <h2 class="judul-kartu">Refleksi Pemahamanmu: Seberapa Paham Kamu?</h2>
      </div>
    </div>
    <p>Pilih ekspresi yang paling menggambarkan pemahamanmu pada proyek ini dan tulis catatan singkatmu:</p>

    <div class="kelompok-emoji-refleksi" id="pilihan-emoji-${kodeProyek}">
      <button type="button" class="tombol-emoji ${dataLama.emoji === 'bingung' ? 'aktif' : ''}" data-nilai="bingung">
        😕 <span>Masih Bingung</span>
      </button>
      <button type="button" class="tombol-emoji ${dataLama.emoji === 'cukup' ? 'aktif' : ''}" data-nilai="cukup">
        🙂 <span>Cukup Paham</span>
      </button>
      <button type="button" class="tombol-emoji ${dataLama.emoji === 'paham' ? 'aktif' : ''}" data-nilai="paham">
        😄 <span>Sangat Paham!</span>
      </button>
    </div>

    <div id="saran-refleksi-${kodeProyek}" class="kotak-feedback ${dataLama.emoji === 'bingung' ? 'tampil peringatan' : ''}">
      ${dataLama.emoji === 'bingung' ? `👷 <strong>Saran Maskot Ir. Bima:</strong> Tidak apa-apa! Coba ulangi bagian <strong>${saranBagianUlang}</strong> di atas secara perlahan ya.` : ""}
    </div>

    <div style="margin-top:0.85rem;">
      <label for="catatan-jurnal-${kodeProyek}" style="display:block; font-weight:700; margin-bottom:0.35rem;">
        Catatan Penting / Hal Baru yang Aku Temukan Hari Ini:
      </label>
      <textarea id="catatan-jurnal-${kodeProyek}" class="input-teks" rows="3"
                placeholder="Contoh: Hari ini aku menemukan bahwa sisi miring selalu berada di depan sudut siku-siku...">${dataLama.catatan || ""}</textarea>
    </div>

    <div style="margin-top:0.85rem; display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
      <button type="button" class="tombol-sekunder" id="simpan-jurnal-${kodeProyek}">💾 Simpan Jurnal Refleksi</button>
      <span id="status-simpan-jurnal-${kodeProyek}" style="font-weight:700; color:var(--hijau-benar);"></span>
    </div>
  `;

  let emojiTerpilih = dataLama.emoji || "";
  const tombolEmoji = wadah.querySelectorAll(".tombol-emoji");
  const kotakSaran = document.getElementById(`saran-refleksi-${kodeProyek}`);

  tombolEmoji.forEach(t => {
    t.addEventListener("click", () => {
      tombolEmoji.forEach(btn => btn.classList.remove("aktif"));
      t.classList.add("aktif");
      emojiTerpilih = t.getAttribute("data-nilai");

      if (emojiTerpilih === "bingung") {
        kotakSaran.className = "kotak-feedback tampil peringatan";
        kotakSaran.innerHTML = `👷 <strong>Saran Maskot Ir. Bima:</strong> Tidak apa-apa, Arsitek! Kami menyarankan kamu mencoba kembali bagian <strong>${saranBagianUlang}</strong> di halaman ini agar makin mantap.`;
      } else if (emojiTerpilih === "cukup") {
        kotakSaran.className = "kotak-feedback tampil benar";
        kotakSaran.innerHTML = `🙂 <strong>Bagus!</strong> Kamu sudah memahami dasar-dasarnya. Latihan soal akan membuatmu semakin mahir.`;
      } else {
        kotakSaran.className = "kotak-feedback tampil benar";
        kotakSaran.innerHTML = `😄 <strong>Mantap Sekali!</strong> Kamu siap menghadapi tantangan konstruksi yang lebih tinggi!`;
      }
    });
  });

  document.getElementById(`simpan-jurnal-${kodeProyek}`).addEventListener("click", () => {
    const teksCatatan = document.getElementById(`catatan-jurnal-${kodeProyek}`).value.trim();
    const prog = ambilProgresBelajar();
    prog.jurnalRefleksi[kodeProyek] = {
      emoji: emojiTerpilih || "cukup",
      catatan: teksCatatan,
      waktu: new Date().toLocaleDateString("id-ID")
    };
    simpanProgresBelajar(prog);
    const statusEl = document.getElementById(`status-simpan-jurnal-${kodeProyek}`);
    statusEl.textContent = "✅ Jurnal berhasil disimpan!";
    setTimeout(() => { statusEl.textContent = ""; }, 3000);
  });
}


/* ========== [BAGIAN: 9. AKSESIBILITAS & INISIALISASI GLOBAL] ========== */

/**
 * Fungsi ubahUkuranHuruf: Memperbesar atau memperkecil ukuran font halaman.
 * Masukan: selisih (Number, contoh: +2 atau -2)
 */
function ubahUkuranHuruf(selisih) {
  const progres = ambilProgresBelajar();
  const ukuranBaru = Math.min(22, Math.max(14, (progres.ukuranFont || 16) + selisih));
  progres.ukuranFont = ukuranBaru;
  document.documentElement.style.setProperty("--ukuran-font-dasar", `${ukuranBaru}px`);
  simpanProgresBelajar(progres);
}

/**
 * Fungsi toggleModeGelap: Mengaktifkan atau menonaktifkan mode kontras gelap.
 */
function toggleModeGelap() {
  const progres = ambilProgresBelajar();
  progres.modeGelap = !progres.modeGelap;
  document.body.classList.toggle("mode-gelap", progres.modeGelap);
  simpanProgresBelajar(progres);
}

/**
 * Fungsi bacakanTeks: Membacakan kalimat soal/instruksi menggunakan speechSynthesis (id-ID).
 * Masukan: teks (String)
 */
function bacakanTeks(teks) {
  if (!("speechSynthesis" in window)) {
    tampilkanNotifikasiMaskot("Maaf, browser perangkatmu belum mendukung fitur pembaca suara otomatis.", "semangat");
    return;
  }
  window.speechSynthesis.cancel();
  const ucapan = new SpeechSynthesisUtterance(teks);
  ucapan.lang = "id-ID";
  ucapan.rate = 0.98;
  window.speechSynthesis.speak(ucapan);
}

/**
 * Fungsi perbaruiTampilanBarAtas: Memperbarui pangkat dan skor siswa di bar atas halaman.
 */
function perbaruiTampilanBarAtas() {
  const progres = ambilProgresBelajar();
  const pangkat = tentukanPangkatArsitek(progres.skorSiswa, progres.proyekTerbukaMaksimal);

  const elPangkat = document.getElementById("tampilan-pangkat-atas");
  const elSkor = document.getElementById("tampilan-skor-atas");
  const elCombo = document.getElementById("tampilan-combo-atas");

  if (elPangkat) elPangkat.textContent = `👷 Pangkat: ${pangkat}`;
  if (elSkor) elSkor.textContent = `⭐ Skor: ${progres.skorSiswa}`;
  if (elCombo) elCombo.textContent = `🔥 Combo: ${progres.comboSaatIni}x`;
}

// Inisialisasi otomatis ketika halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  // 1. Cek apakah halaman boleh diakses
  if (!cekAksesHalaman()) return;

  // 2. Terapkan preferensi ukuran huruf & mode gelap
  const progres = ambilProgresBelajar();
  document.documentElement.style.setProperty("--ukuran-font-dasar", `${progres.ukuranFont || 16}px`);
  document.body.classList.toggle("mode-gelap", Boolean(progres.modeGelap));

  // 3. Render menu navigasi & bar informasi arsitek
  renderMenuNavigasi();
  perbaruiTampilanBarAtas();

  // 4. Cek apakah ada pesan pengalihan halaman terkunci dari sessionStorage
  const pesanAlih = sessionStorage.getItem("pesanAlihProyek");
  if (pesanAlih) {
    sessionStorage.removeItem("pesanAlihProyek");
    setTimeout(() => tampilkanNotifikasiMaskot(pesanAlih, "semangat"), 400);
  }

  // 5. Jalankan pengecekan mandiri gambarSegitigaSiku di konsol
  ujiGambarSegitigaMandiri();
});

// ===== Render rumus otomatis (KaTeX) =====
(function () {
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
  document.head.appendChild(css);

  function muat(src) {
    return new Promise(r => {
      const s = document.createElement("script");
      s.src = src; s.onload = r;
      document.head.appendChild(s);
    });
  }

  const opsi = {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false }
  ],
  throwOnError: false
};
  window.renderRumus = () => window.renderMathInElement && renderMathInElement(document.body, opsi);

  document.addEventListener("DOMContentLoaded", async () => {
    await muat("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js");
    await muat("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js");
    renderRumus();
    let t;
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(renderRumus, 150); })
      .observe(document.body, { childList: true, subtree: true });
  });
})();