# Undangan Pernikahan Digital — Pendopo Manten Jawa

## Menjalankan lokal
- Buka `index.html` langsung di browser, ATAU
- `python3 -m http.server 8000` lalu buka http://localhost:8000

## Mengganti data
Semua data ada di bagian `CONFIG` paling atas `script.js` (nama, orang tua, tanggal ISO + zona waktu, alamat, URL Maps, foto, galeri, cerita, info, rekening, musik).
- Foto: taruh di `assets/images/`, isi path-nya (mis. `assets/images/groom.jpg`). Kompres <200 KB per foto.
- Musik: taruh `music.mp3` di `assets/audio/` (tidak autoplay; tombol ♪ hanya muncul jika file ada). Gunakan musik bebas hak cipta.
- Nama tamu: tambahkan `?to=Nama+Tamu` di akhir tautan, mis. `index.html?to=Budi+Santoso`.
- Countdown mengikuti `CONFIG.akad.date`.

## Mengaktifkan RSVP & buku tamu (Google Sheets)
1. Buat Google Sheet dengan header baris 1: `time | type | name | status | count | text`.
2. Extensions → Apps Script, tempel:
```js
function doPost(e){
  const d=JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([d.time,d.type,d.name,d.status||"",d.count||"",d.text||""]);
  return ContentService.createTextOutput("ok");
}
```
3. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone. Salin URL.
4. Isi `rsvpEndpoint` dan `wishEndpoint` di `CONFIG` dengan URL tersebut.
Tanpa endpoint, form berjalan dalam MODE DEMO (data tidak tersimpan; pesan ini ditampilkan ke tamu).
Catatan: ucapan yang tampil hanya milik pengirim di sesi itu; menampilkan semua ucapan butuh endpoint GET tambahan.

## Hosting
Unggah folder ke Netlify/GitHub Pages/hosting biasa, lalu bagikan tautan via WhatsApp.
