document.addEventListener('DOMContentLoaded', () => {
    // Tablonuzdaki Çalışılan Gün -> Boş Gün eşleştirmesi
    // Not: Tabloda 1'den 30'a kadar günler var. Dizin (index) 1'den başlasın diye 0. indise (0 gün çalışana) 0 boş gün atandı.
    const bosGunTablosu = {
        // Çalışılan Takvim Ayı Günleri: Kullanılabilecek Boş Gün Sayısı
        30: 8, 29: 8, 28: 7, 27: 7, 26: 7, 25: 7, 
        24: 6, 23: 6, 22: 6, 21: 6, 20: 5, 19: 5, 
        18: 5, 17: 5, 16: 4, 15: 4, 14: 4, 13: 3, 
        12: 3, 11: 3, 10: 3, 9: 2, 8: 2, 7: 2, 
        6: 2, 5: 1, 4: 1, 3: 1, 2: 1, 1: 0
    };

    // HTML elementlerine erişim
    const ayGunSayisiSelect = document.getElementById('ayGunSayisi');
    const izinGunInput = document.getElementById('izinGunSayisi');
    const hesaplaBtn = document.getElementById('hesaplaBtn');
    const sonucDiv = document.getElementById('sonuc');

    // Hesaplama butonu tıklandığında çalışacak fonksiyon
    hesaplaBtn.addEventListener('click', hesaplaBoşGün);

    function hesaplaBoşGün() {
        // Değerleri al
        const ayGunSayisi = parseInt(ayGunSayisiSelect.value);
        const izinGunSayisi = parseInt(izinGunInput.value);

        // Geçerlilik Kontrolü
        if (isNaN(ayGunSayisi) || isNaN(izinGunSayisi) || izinGunSayisi < 0) {
            sonucDiv.innerHTML = "Lütfen geçerli ay gün sayısı ve izin gün sayısı giriniz.";
            sonucDiv.className = 'sonuc-kutusu error';
            return;
        }

        // 1. Bonus Hesaplama (31 Çeken Aylar)
        let dusulecekIzin = izinGunSayisi;
        let fiiliCalismaGunu = 0;
        let bonusGunu = 0;

        if (ayGunSayisi === 31) {
            // 31 çeken aylarda ilk 1 gün rapor/mazeret boş günden düşmüyor (bonus).
            if (izinGunSayisi > 0) {
                bonusGunu = 1;
                // Örneğin: 2 gün izin varsa, 1'i bonus sayılır, 1 gün düşülür.
                dusulecekIzin = izinGunSayisi - bonusGunu;
            } else {
                dusulecekIzin = 0;
            }
        }
        
        // Düşülecek izin sayısı negatif olamaz (bonus kuralından dolayı)
        if (dusulecekIzin < 0) {
             dusulecekIzin = 0;
        }

        // 2. Fiili Çalışılan Gün Sayısını Hesaplama
        // Ayın toplam gününden, bonus sonrası kalan izin sayısını çıkarıyoruz.
        fiiliCalismaGunu = ayGunSayisi - dusulecekIzin;
        
        // Tablomuz 1'den 30'a kadar olduğu için 30'dan büyük bir değer gelirse 30'a sabitleriz.
        if (fiiliCalismaGunu > 30) {
            fiiliCalismaGunu = 30;
        } 
        
        // Tabloda olmayan (1'den küçük) bir değer gelirse 0'a sabitleriz.
        if (fiiliCalismaGunu < 1) {
            fiiliCalismaGunu = 0;
        }
        

        // 3. Boş Gün Hakkını Bulma
        // Tablomuzdaki anahtar değer fiili çalışma günüdür.
        const hakEdilenBosGun = bosGunTablosu[fiiliCalismaGunu] !== undefined 
                               ? bosGunTablosu[fiiliCalismaGunu] 
                               : 'Hesaplama hatası (Geçersiz gün)';
        
        
        // 4. Sonucu Ekrana Yazdırma
        if (typeof hakEdilenBosGun === 'number') {
            sonucDiv.innerHTML = `
                <p>Ayın Gün Sayısı: <strong>${ayGunSayisi}</strong></p>
                <p>Toplam İzin: <strong>${izinGunSayisi} Gün</strong></p>
                ${bonusGunu > 0 ? `<p class="bonus-info">31 Gün Bonusu Kullanıldı: <strong>1 Gün</strong></p>` : ''}
                <p>Tabloya Esas Fiili Çalışma Günü: <strong>${fiiliCalismaGunu} Gün</strong></p>
                <hr style="border-top: 1px solid #ccc; width: 50%; margin: 15px auto;">
                <p style="font-size: 1.5em; color: #cc0000;">Hak Edilen Kullanılabilir Boş Gün: <strong>${hakEdilenBosGun}</strong></p>
            `;
            sonucDiv.className = 'sonuc-kutusu'; // Başarılı sonuç stili
        } else {
            sonucDiv.innerHTML = "Hata: Hesaplama aralığı dışında bir değer girildi.";
            sonucDiv.className = 'sonuc-kutusu error';
        }
    }
});