# User Management System

Modern ve kullanıcı dostu bir arayüze sahip kullanıcı yönetim sistemi. Bu uygulama ile kullanıcıları listeleyebilir, ekleyebilir, düzenleyebilir ve silebilirsiniz.

## 🚀 Özellikler

- Kullanıcı listeleme ve arama
- Kullanıcı ekleme/düzenleme/silme
- Sayfalama ve sıralama
- Gerçek zamanlı istatistikler
- Responsive tasarım

## 🔧 Gereksinimler

- Node.js (v18.9.1)
- NPM (v10.2.4)

## 🛠️ Kurulum

1. Projeyi klonlayın

```bash
git clone https://github.com/Drvex/CVBVXVBFWLNNRSMFUSTIQVAAQFGABQGTRPLYCJXQJWCWSDSRVT
cd CVBVXVBFWLNNRSMFUSTIQVAAQFGABQGTRPLYCJXQJWCWSDSRVT
```

2. Bağımlılıkları yükleyin

```bash
npm install
```

3. Prodüksiyon modunda çalıştırın

```bash
npm start
```

## 📚 Kullanılan Teknolojiler

- React
- Ant Design
- SCSS
- Axios (API istekleri için)
- Nest.js
- Node.js
- Postgresql

## 📁 Proje Yapısı

```
src/
  ├── components/        # React bileşenleri
  ├── utils/            # Yardımcı fonksiyonlar
  ├── scss/            # Stil dosyaları
  ├── App.js           # Ana uygulama bileşeni
  └── index.js         # Giriş noktası
```

## 🔑 Önemli Komutlar

- `npm install`: Bağımlılıkları yükler
- `npm run dev`: Geliştirme sunucusunu başlatır
- `npm start`: Prodüksiyon sürümünü başlatır
- `npm run build`: Projeyi derler
- `npm run test`: Testleri çalıştırır

## 💡 Kullanım

1. Uygulama başlatıldıktan sonra tarayıcınızda `http://localhost:3001` adresine gidin
2. Üst menüden "Add User" butonuna tıklayarak yeni kullanıcı ekleyebilirsiniz
3. Kullanıcı listesinde arama yapabilir, sıralama yapabilir ve sayfalama yapabilirsiniz
4. Her kullanıcı için düzenleme ve silme işlemlerini gerçekleştirebilirsiniz

## 🔍 API Endpoints

```
GET     /users              # Kullanıcıları listele
GET     /users/:id          # Kullanıcı Getir
POST    /users/save         # Yeni kullanıcı ekle
POST    /users/update/:id   # Kullanıcı güncelle
DELETE  /users/:id          # Kullanıcı sil
```

## 🛟 Hata Giderme

**Problem**: Uygulama başlatılamıyor

```bash
# Node.js sürümünüzü kontrol edin
node --version

# NPM sürümünüzü kontrol edin
npm --version

# Bağımlılıkları temizleyip yeniden yükleyin
rm -rf node_modules
npm install
```

## 📝 Notlar

- Node.js v18.9.1 ve NPM v10.2.4 sürümleri ile test edilmiştir
- Daha eski veya yeni sürümlerde sorunlar yaşanabilir
- API bağlantıları için .env dosyasını düzenlemeyi unutmayın
