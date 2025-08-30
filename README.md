# Fullstack DevCase — Users Dashboard

Bu proje, Next.js tabanlı frontend ve Node.js/Express.js + Sequelize backend ile eksiksiz bir kullanıcı yönetim panelidir. Aşağıda kurulum, çalıştırma, deploy ve özellikler özetlenmiştir.

## Canlı demo (frontend): https://fullstack-devcase-users-dashboard.vercel.app/

## Özellikler
- **Backend:**
- Railway ile PostgreSQL deployu
  - Express.js REST API
  - Sequelize + PostgreSQL
  - JWT tabanlı kimlik doğrulama
  - Kayıt & giriş (email/password, bcrypt ile hash)
  - Users CRUD (GET/POST/PUT/DELETE)
  - Nested kullanıcı desteği (children ile hiyerarşi)
  - Zod ile request doğrulama
  - CORS ve güvenlik middleware’leri
  - .env ile ortam değişkenleri
  - .env.example dosyası
  - Test dosyaları
- **Frontend:**
  - Next.js 15 (App Router), React 19, TypeScript (strict)
  - Tailwind CSS v4, Radix UI, Lucide Icons
  - TanStack Table v8 ile tablo
  - API’dan gerçek veri ile dashboard
  - Sayfalama, sıralama, filtreleme
  - Nested kullanıcılar expand/collapse
  - Kullanıcı ekleme/düzenleme formu
  - Hata/boş durumlar için kullanıcı dostu geri bildirim
  - Responsive ve erişilebilir UI
  - Ortam değişkeni ile backend bağlantısı

  ## Dashboard & Kullanıcı Yönetimi Özellikleri
- Dashboard sayfasında Users API’den gelen veriler tabloya dinamik olarak aktarılır.
- Sadece admin rolündeki kullanıcılar yeni kullanıcı ekleyebilir, silebilir ve düzenleyebilir.
- Admin harici kullanıcılar sisteme pending (beklemede) statüsüyle üye olur; active duruma geçişi sadece admin sağlar.
- Kullanıcıların status (pending, active, inactive) durumuna göre dinamik kartlar ve görsel geri bildirimler gösterilir.
- Uygulamada light tema desteği mevcuttur; kullanıcı deneyimi modern ve erişilebilir şekilde tasarlanmıştır.

## Kurulum
### Gereksinimler
- Node.js >= 18 (önerilen: 20.x LTS)
- pnpm >= 8 (veya npm/yarn)
- PostgreSQL

### Adımlar
1. Depoyu klonla:
   ```bash
   git clone <repo-url>
   cd FullStack-devCase
   ```
2. Bağımlılıkları kur:
   ```bash
   pnpm install
   # veya
   npm install
   ```
3. Backend ve frontend klasörlerinde ayrıca kurulum gerekirse:
   ```bash
   cd server && npm ci
   cd ../frontend && npm ci
   ```

### Çalıştırma
- Geliştirme:
  ```bash
  pnpm dev
  # veya
  cd server && npm run dev
  cd frontend && npm run dev
  ```
- Production build:
  ```bash
  cd server && npm run build && npm start
  cd frontend && npm run build && npm start
  ```

## Ortam Değişkenleri
### Backend (`server/.env`)
```
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your_jwt_secret
PORT=3001
ALLOWED_ORIGIN_1=http://localhost:3000
ALLOWED_ORIGIN_2=https://your-frontend-domain.vercel.app
```
### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
```

## Migration & Seed
```bash
cd server
npx sequelize db:migrate
npx sequelize db:seed:all
```

## API Uçları
- `POST /api/auth/register` — Kayıt
- `POST /api/auth/login` — Giriş
- `GET /api/users` — Kullanıcı listesi (sayfalama, filtre, sıralama)
- `GET /api/users/:id` — Tek kullanıcı
- `POST /api/users` — Yeni kullanıcı
- `PUT /api/users/:id` — Kullanıcı güncelle
- `DELETE /api/users/:id` — Kullanıcı sil
- `GET /api/health` — Sağlık kontrolü

## Deploy
- **Backend:** Railway, Render vb. (start/build script’leri ve env’ler tanımlı olmalı)
- **Frontend:** Vercel (Next.js). `NEXT_PUBLIC_API_URL` backend public URL olmalı.
- Railway’de CORS için `ALLOWED_ORIGIN_2` değişkenine Vercel domainini ekleyin.

## Sık Karşılaşılan Sorunlar
- **CORS hatası:** Backend CORS whitelist ve Railway env’leri kontrol edin.
- **Validation error:** API body şemasına uygun veri gönderin (`firstName`, `lastName` vs.).
- **Deploy sonrası eski kod:** Railway’de son commit SHA’yı kontrol edin, gerekirse boş commit ile redeploy tetikleyin.



## Teknik Detaylar ve Kullandığımız Teknolojiler

Bu bölüm, projede hangi kütüphaneleri, desenleri ve önemli kararları kullandığımızı özetler.

- Authentication: JWT tabanlı (JSON Web Tokens). Oturum açtıktan sonra backend bir access token döner; frontend bu token'ı Authorization: Bearer <token> başlığı ile isteklerde kullanır.
- Parolalar: `bcrypt` ile tek yönlü hashlenir (register endpoint'inde), login sırasında hash karşılaştırılır.
- Validation: `zod` kullanılarak gelen isteklerin (body/params/query) doğrulanması sağlandı. Bu sayede; eksik/yanlış tipte veriler erken yakalanır ve tutarlı hata mesajları döner.
- ORM: `Sequelize` (Postgres) — model, migration ve seed yapısı ile veritabanı yönetimi.
- Nested Users: Kullanıcıların hiyerarşik ilişkisi (parent/children) model düzeyinde desteklenir ve API listelerinde expand/collapse ile frontend tarafında gösterilir.
- API Layer: Express.js ile REST kuruldu; route'lar, controller'lar ve validator'lar ayrıldı (temiz yapı).
- CORS: Ortam değişkenleri ile kontrol edilen whitelist mantığı eklendi (deploy sırasında Vercel/localhost gibi origin'ler eklenir).
- Error Handling: Ortak bir errorHandler middleware'i ile Zod/Sequelize hataları ve custom validation hataları standart bir yanıt formatında döndürülüyor.
- Testler: Jest ile backend birim/entegrasyon testleri bulunuyor (kısa testler, auth ve users uç noktaları için).
- Dokümantasyon: `openapi.yaml` ve Postman koleksiyonu (repo içinde) — API uç noktalarını hızlıca keşfetmek için.
- Zod seçildi: Tip güvenli ve geliştiricide erken hata yakalama sağlıyor; ayrıca TypeScript ile iyi bütünleşiyor.
- JWT seçildi: Stateles, kolay ölçeklenebilir oturum yönetimi için uygundur ve frontend ile kullanım kolaylığı sağlar.
- Sequelize seçildi: Migration/seed araçları hazır, Postgres ile olgun entegrasyonu var.

## API Bilgileri

Örnek success response ve bazı istek şekilleri:

- Register (POST /api/auth/register)
  - Body: { firstName?, lastName?, email: string, password: string }
  - 201 Created: { user: { id, firstName, lastName, email, children? }, token }

- Login (POST /api/auth/login)
  - Body: { email: string, password: string }
  - 200 OK: { user, token }

- Get users (GET /api/users)
  - Query: page, limit, sort, filter
  - 200 OK: { data: [users], meta: { total, page, limit } }

Hatalar genelde şu formatta döner: { error: 'message', details?: { ... } }

## Güvenlik & Üretim Notları

- JWT_SECRET güçlü bir değer olmalı ve prod ortamında sıkı saklanmalı.
- DATABASE_URL içerisinde kullanıcı/şifre açık olmamalı; Railway/Render/Vercel secret manager kullanılmalı.
- CORS whitelist üretim ortamında sadece frontend domain'lerini içermeli.
- Rate limiting, brute-force koruması ve account lockout gibi üretim güvenlik önlemleri ileride eklenebilir.

## Değişiklikler — Neler Eklendi

Bu repo üzerine geliştirme yaparken aşağıdaki önemli iyileştirmeler uygulandı:

- Zod tabanlı validation eklendi/iyileştirildi (request body/params/query için).
- Authentication: JWT token bazlı akış uygulandı; register/login controller'ları ve token üretimi eklendi.
- Parola güvenliği: `bcrypt` ile hashing; seed dosyaları buna göre güncellendi.
- CORS: Ortam değişkeni tabanlı whitelist ve debug sırasında hızlı test için temporary allow-all seçeneği eklendi (deployta revertleyin).
- Frontend: `NEXT_PUBLIC_API_URL` ile backend bağlantısı yapılandırıldı, dashboard tabloları gerçek API verisi ile bağlandı.


