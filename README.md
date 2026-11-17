# MADDEV Journal (`diary-app8`)

Aplikasi catatan harian berbasis React Native, Expo Router, dan Redux Toolkit — dibuat oleh **Ahmad Yusuf (NIM: 2430511042)** untuk Praktikum Mobile Programming Pertemuan 8 (Teknik Informatika UMMI).

## Fitur
- Manajemen global state dengan Redux Toolkit (`addDiary`, `editDiary`, `toggleFavorite`, `deleteDiary`, `clearAllFavorites`).
- Filter catatan berdasarkan mood serta statistik Total Diary dan Total Favorite.
- Tampilan responsif (`maxWidth: 720`) yang nyaman dijalankan di browser laptop maupun perangkat mobile.
- Validasi form input (judul minimal 3 karakter) dan empty state informatif.

## Perbedaan Local State, Global Redux State, dan Persistent Database

| Aspek | Local State (`useState`) | Global Redux State (Redux Toolkit) | Persistent Database (MySQL / REST API) |
| :--- | :--- | :--- | :--- |
| **Cakupan Akses** | Terbatas pada satu komponen/screen tempat state dibuat. | Terpusat (*single source of truth*) dan dapat dibaca/diubah dari seluruh screen. | Tersimpan di server/storage eksternal dan dapat diakses lintas sesi maupun perangkat. |
| **Siklus Hidup Data** | Hilang saat komponen *unmount* atau halaman ditutup. | Tersimpan di memori (RAM) aplikasi; akan kembali ke `initialState` saat aplikasi di-*reload*/*restart*. | Permanen; data tetap tersimpan meskipun aplikasi ditutup atau perangkat dimatikan. |
| **Penggunaan di Aplikasi** | Input teks sementara pada form `Create` dan `Edit` (`title`, `body`, `mood`) sebelum tombol simpan ditekan. | Daftar `entries`, status `liked`, filter mood aktif, dan penghitung statistik lintas halaman. | Penyimpanan riwayat catatan jangka panjang ke database server pada tahap integrasi backend. |