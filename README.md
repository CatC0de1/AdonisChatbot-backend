# Chatbot REST API – Technical Test

Sebuah REST API sederhana menggunakan **AdonisJS** dan **PostgreSQL** untuk sistem chatbot. API ini memungkinkan pengguna mengirimkan pertanyaan, menyimpan pertanyaan dan jawaban dari API eksternal, serta menampilkan atau menghapus pesan.

## Teknologi

- [AdonisJS](https://docs.adonisjs.com)
- PostgreSQL
- Axios
- UUID

## Struktur Folder

```
.
├── app/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ └── validators/
├── config/
├── database/
│ ├── migrations/
│ └── seeders/
├── start/
│ ├── kernel.ts
│ └── routes.ts
```

## Instalasi

```bash
# Clone resipoteri dari GitHub
git clone https://github.com/CatC0de1/AdonisChatbot-backend.git
cd AdonisChatbot-backend

# Install dependencies
npm install
```

Ubah `.env` sesuai dengan koneksi database lokal PostgreSQL sesuai contoh `.env.example`:
```env
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=app
```

## Migrasi & Seeder

``` bash
# Jalankan migrasi
node ace migration:run

# Jalankan seeder
node ace db:seed
```

Seeder akan menambahkan user dummy sebagai berikut:
```txt
username: admin
password: bukanAdmin123
```

_username dan password seeder dapat diganti sesuai kebutuhan di_ `./database/seeders/user_seeder.ts`

## Menjalankan Server

```bash
node ace serve --watch
```
API berjalan di `http://localhost:3333`

## Autentikasi
1. ### Login

   Login dilakukan di route: 
   ```http
   /auth/login
   ``` 

   Masukan `username` dan `password` di body dalam format `json` dengan validasi harus string dan tidak boleh kosong seperti berikut:
   ```json
   {
     "username": "admin",
     "password": "bukanAdmin123"
   }
   ```

   Response yang dihasilkan adalah token unik sebagai Bearer Token di Authorization header untuk sesi login yang akan digunakan di route lain seperti `/conversation` atau `/logout`
   ```json
   {
     "token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   }
   ```

2. ### Logout

   Logout dilakukan di route:
   ```http
   POST /auth/logout
   ``` 

   Dibutuhkan authorization yang berisi Bearer Token. Setelah itu, sesi token berhasil dihapus dan menghasilkan respon:
   ```json
   {
     "message": "Berhasil logout"
   }
   ``` 

## Endpoints
1. ### Kirim Pertanyaan ke Chatbot
   
   Mengirim pertanyaan ke chatbot dilakukan di route: 
   ```http
   POST /question
   ```
   Body yang dikirim berformat `json` dengan validasi `question` tidak boleh kosong, harus string, dan maksimal 1000 karakter seperti berikut:
   ```json
   {
     "question": "Apa itu Majadigi?"
   }
   ```

   Response yang dihasilkan akan disimpan di dalam database dan akan ditampilkan di user. Contoh response nya ialah sebagai berikut:
   ```json
   {
     "session_id": "uuid",
     "question": "Apa itu Majadigi?",
     "answer": "Majadigi merupakan platform layanan publik digital terintegrasi di Provinsi Jawa Timur yang menyediakan lebih dari 36 layanan publik unggulan"
   }
   ```

2. ### Ambil Semua Percakapan

   ```http
   GET /conversation
   ```

   Terdapat beberapa query params antara lain:

   1. #### Pagination
        
      Pagination dilakukan untuk memisahkan index dalam beberapa page / halaman terpisah. Jika ingin menampilkan halaman ketiga, maka dapat dilakukan dengan query params sebagai berikut:
      ```http
      GET /conversation?page=3
      ```
      Nilai default dari `page` adalah 1.
      
      Dalam satu halaman, terdapat beberapa data percakapan yang ditampilkan.
      Jika ingin menampilkan 5 percakapan dalam 1 halaman, maka dapat dilakukan dengan query params sebagai berikut:
      ```http
      GET /conversation?perPage=5
      ```
      Nilai default dari `perPage` adalah 10.

   2. #### Sorting

      Sorting dilakukan untuk mengurutkan percakapan dalam index berdasarkan `created_at` atau waktu dibuat percakapan. Percakapan dapat disorting dari yang terbaru (`desc`) atau yang terlama (`asc`). Query params sorting dapat dilakukan sebagai berikut:
      ```http
      GET /conversation?sort=asc
      ```
      Nilai default dari `sort` adalah desc

   Query params tersebut dapat dikombinasikan sebagai contoh berikut:
   ```http
   GET /conversation?page=2&perPage=15&sort=desc
   ```

   Dibutuhkan authorization Bearer Token untuk mengakses route ini.

3. ### Ambil Detail Percakapan Berdasarkan ID/UUID
   
   Mengambil percakapan berdasarkan id/uuid dilakukan di route:
   ```http
   GET /conversation/:id_or_uuid
   ```

   Dimana `:id_or_uuid` adalah `id` dari `conversation` _atau_ `uuid` dari `conversation` yang dapat dilihat di database atau di route `GET /conversation`.

   Dibutuhkan authorization Bearer Token untuk mengakses route ini.

4. ### Hapus Percakapan

   Menghapus percakapan dilakukan di route:
   ```http
   DELETE /conversation/:id_or_uuid
   ```

   Jika berhasil, maka akan percakapan akan dihapus dari database dan menghasilkan response:
   ```json
   {
     "message": "Conversation berhasil dihapus"
   }
   ```

   Dibutuhkan authorization Bearer Token untuk mengakses route ini.