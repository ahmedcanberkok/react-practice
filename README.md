## README.md

# Proje Başlığı: React Kimlik Doğrulama ve Çalışan Yönetim Sistemi

## İçindekiler
- [Giriş](#giriş)
- [Özellikler](#özellikler)
- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Dosya Açıklamaları](#dosya-açıklamaları)
  - [Login.js](#loginjs)
  - [Success.js](#successjs)
  - [Documents.js](#documentsjs)
  - [CurrencyTable.js](#currencytablejs)

## Giriş
Bu proje, ön yüzü React kullanılarak geliştirilmiş bir web uygulamasıdır. Kullanıcı kimlik doğrulama (giriş ve kayıt) işlevleri sağlar ve çalışan verilerinin eklenmesi, güncellenmesi ve silinmesi dahil olmak üzere çalışan yönetimi özelliklerini içerir. Ayrıca belge yönetimi ve döviz kurları görüntüleme özellikleri de mevcuttur.

## Özellikler
- Kullanıcı kimlik doğrulama (giriş ve kayıt)
- Token ve kullanıcı bilgilerinin güvenli saklanması
- Çalışan yönetimi: Çalışan ekleme, güncelleme, silme ve görüntüleme
- Belge yönetimi: Belge yükleme, indirme ve silme
- Gerçek zamanlı döviz kurları görüntüleme

## Kullanılan Teknolojiler
- React
- React Router
- Axios
- React Toastify
- React Secure Storage
- JWT Decode
- Tailwind CSS (stil için)

## Kurulum
1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/your-repo/react-employee-management.git
   cd react-employee-management
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Uygulamayı çalıştırın:
   ```bash
   npm start
   ```

## Kullanım
- **Giriş Yap**: Kullanıcı adınızı ve şifrenizi girerek giriş yapabilirsiniz.
- **Kayıt Ol**: Kullanıcı adı ve şifre girerek yeni bir hesap oluşturabilirsiniz.
- **Çalışan Yönetimi**: Giriş yaptıktan sonra çalışan kayıtlarını görüntüleyebilir, ekleyebilir, güncelleyebilir ve silebilirsiniz.
- **Belge Yönetimi**: Belgeleri yükleyebilir, indirebilir ve silebilirsiniz.
- **Döviz Kurları**: Seçilen para birimlerinin güncel döviz kurlarını görüntüleyebilirsiniz.

## Dosya Açıklamaları

### Login.js
Kullanıcı giriş ve kayıt işlemlerini yönetir.

- **Kullanılan Kütüphaneler**:
  - `React`: Bileşen oluşturmak için.
  - `useNavigate` from `react-router-dom`: Yönlendirme için.
  - `axios`: HTTP istekleri yapmak için.
  - `react-toastify`: Toast bildirimleri göstermek için.
  - `react-secure-storage`: Tokenları güvenli bir şekilde saklamak için.
  - `jwt-decode`: JWT tokenlarını çözmek için.

- **İşlevsellikler**:
  - `handleSubmit`: Giriş formu gönderimini yönetir.
  - `handleRegister`: Kayıt formu gönderimini yönetir.
  - Giriş ve kayıt formlarını görüntüler.
  - İşlemlerin başarısına veya başarısızlığına göre uygun toast bildirimleri gösterir.

### Success.js
Çalışan verilerinin görüntülenmesi ve yönetilmesini sağlar.

- **Kullanılan Kütüphaneler**:
  - `React`: Bileşen oluşturmak için.
  - `useNavigate` from `react-router-dom`: Yönlendirme için.
  - `axios`: HTTP istekleri yapmak için.
  - `react-toastify`: Toast bildirimleri göstermek için.
  - `react-secure-storage`: Tokenları güvenli bir şekilde saklamak için.
  - `jwt-decode`: JWT tokenlarını çözmek için.

- **İşlevsellikler**:
  - Çalışan verilerini çeker ve görüntüler.
  - Çalışan kayıtlarının eklenmesini, güncellenmesini ve silinmesini yönetir.
  - Çalışan listesi için sayfalama.
  - İşlemlerin başarısına veya başarısızlığına göre uygun toast bildirimleri gösterir.

### Documents.js
Belgelerin görüntülenmesi ve yönetilmesini sağlar.

- **Kullanılan Kütüphaneler**:
  - `React`: Bileşen oluşturmak için.
  - `useNavigate` from `react-router-dom`: Yönlendirme için.
  - `axios`: HTTP istekleri yapmak için.
  - `react-toastify`: Toast bildirimleri göstermek için.
  - `react-secure-storage`: Tokenları güvenli bir şekilde saklamak için.
  - `jwt-decode`: JWT tokenlarını çözmek için.

- **İşlevsellikler**:
  - Belgeleri çeker ve görüntüler.
  - Belgelerin yüklenmesini, indirilmesini ve silinmesini yönetir.
  - Belge listesi için sayfalama.
  - İşlemlerin başarısına veya başarısızlığına göre uygun toast bildirimleri gösterir.

### CurrencyTable.js
Gerçek zamanlı döviz kurlarını görüntüler.

- **Kullanılan Kütüphaneler**:
  - `React`: Bileşen oluşturmak için.
  - `useNavigate` from `react-router-dom`: Yönlendirme için.
  - `axios`: HTTP istekleri yapmak için.
  - `react-toastify`: Toast bildirimleri göstermek için.
  - `react-secure-storage`: Tokenları güvenli bir şekilde saklamak için.

- **İşlevsellikler**:
  - Döviz kurlarını çeker ve görüntüler.
  - Kullanıcının temel para birimini seçmesini sağlar.
  - İşlemlerin başarısına veya başarısızlığına göre uygun toast bildirimleri gösterir.

---

Yukarıdaki talimatları izleyerek projeyi yerel makinenize kurabilir ve çalıştırabilirsiniz. Uygulama, çalışanları yönetmek, belgeleri yönetmek ve döviz kurlarını görüntülemek için sezgisel ve kullanıcı dostu bir deneyim sunmak üzere tasarlanmıştır.