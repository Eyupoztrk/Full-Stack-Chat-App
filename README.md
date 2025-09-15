# Real-Time Chat Application

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş tam özellikli bir gerçek zamanlı sohbet uygulamasıdır. Next.js App Router, Socket.IO ve MongoDB kullanılarak oluşturulmuştur.

## Temel Özellikler

- **Kullanıcı Yönetimi**: JWT tabanlı kimlik doğrulama sistemi
- **E-posta Doğrulama**: Resend servisi ile otomatik e-posta gönderimi
- **Gerçek Zamanlı Mesajlaşma**: Socket.IO ile anlık mesaj iletimi
- **Sohbet Odaları**: Çoklu oda desteği ile organize edilmiş konuşmalar
- **Mesaj Geçmişi**: Veritabanı tabanlı mesaj arşivleme
- **Kullanıcı Aktiviteleri**: Çevrimiçi kullanıcı listesi ve yazım göstergeleri
- **Profil Ayarları**: Kullanıcı bilgileri düzenleme imkanı

## Teknoloji Stack'i

| Kategori | Teknoloji |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Programlama Dili** | TypeScript |
| **Veritabanı** | MongoDB (Mongoose ORM) |
| **Real-time** | Socket.IO |
| **Authentication** | JWT (jsonwebtoken) |
| **Email Service** | Resend |
| **Styling** | Tailwind CSS + shadcn/ui |

## Sistem Gereksinimleri

- Node.js 18 veya üzeri
- MongoDB veritabanı erişimi
- Resend API anahtarı
- Web tarayıcısı

## Kurulum

### 1. Repository'yi İndirin

```bash
git clone ile yükleyin
cd case-project içine girin
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Env Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın ve değerlerini doldurun:

```env
NODE_ENV=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
AUTH_SECRET=
RESEND_API_KEY=
EMAIL_EXPIRES_TIME=
PORT=3000
```

### 4. Uygulamayı Başlatın

**Geliştirme ortamı için:**
```bash
npm run dev
```

**Production build için:**
```bash
npm run build
npm run start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır

## API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş
- `POST /api/auth/logout` - Çıkış
- `GET /api/auth/verify` - E-posta doğrulama

### User Management
- `GET /api/me` - Kullanıcı bilgileri
- `PATCH /api/me` - Profil güncelleme

### Chat
- `GET /api/rooms` - Sohbet odaları listesi
- `GET /api/rooms/[roomId]/messages` - Oda mesajları

## Socket.IO Events

### Client → Server
- `join_room` - Odaya katılma
- `send_message` - Mesaj gönderme
- `typing_start` - Yazım başlangıcı
- `typing_stop` - Yazım bitiş

### Server → Client
- `message_created` - Yeni mesaj
- `user_typing_start` - Kullanıcı yazmaya başladı
- `user_typing_stop` - Kullanıcı yazmayı bıraktı
- `online_users_update` - Çevrimiçi kullanıcılar güncellendi

## Güvenlik Özellikleri

- **JWT Authentication**: Güvenli oturum yönetimi
- **Email Verification**: Hesap doğrulama zorunluluğu
- **Input Validation**: Gelen verilerin doğrulanması
- **CORS Protection**: Cross-origin isteklerin kontrolü

## Deployment



## Geliştirme Notları

### Önemli Dosyalar
- `server.ts`: Socket.IO sunucu konfigürasyonu
- `middleware.ts`: Route koruma middleware'i
- `lib/db.ts`: MongoDB bağlantı yönetimi


### Script'ler
- `npm run dev`: Geliştirme sunucusu (nodemon ile)
- `npm run build`: Production build
- `npm run start`: Production sunucu


