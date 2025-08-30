# Fullstack DevCase — Users Dashboard

Bu proje, Next.js tabanlı frontend ve Node.js/Express.js + Sequelize backend ile eksiksiz bir kullanıcı yönetim panelidir. Aşağıda kurulum, çalıştırma, deploy ve özellikler özetlenmiştir.

## Özellikler
- **Backend:**
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

## Ekstra
- Kod mimarisi modüler ve anlaşılır.
- Tüm ana case gereksinimleri eksiksiz karşılandı.
- Test dosyaları ve OpenAPI/Postman koleksiyonu eklenebilir.


