document.addEventListener('DOMContentLoaded', () => {
    // EK-5 Tablosu: Çalışılan Takvim Ayı Günleri -> Kullanılabilecek Boş Gün Sayısı
    const bosGunTablosu = {
        30: 8, 29: 8, 28: 7, 27: 7, 26: 7, 25: 7, 
        24: 6, 23: 6, 22: 6, 21: 6, 20: 5, 19: 5, 
        18: 5, 17: 5, 16: 4, 15: 4, 14: 4, 13: 3, 
        12: 3, 11: 3, 10: 3, 9: 2, 8: 2, 7: 2, 
        6: 2, 5: 1, 4: 1, 3: 1, 2: 1, 1: 0, 0: 0 // 0 gün çalışılınca 0 boş
    };

    // Ayların Gün Sayıları (29/28 çeken Şubat ayı için 29 baz alınabilir.)
    const ayGunleri = {
        Ocak: 31, Subat: 29, Mart: 31, Nisan: 30, Mayis: 31, Haziran: 30,
        Temmuz: 31, Agustos: 31, Eylul: 30, Ekim: 31, Kasim: 30, Aralik: 31
    };
    
    // Varsayılan boş gün hakkı (30 gün takvime göre)
    const standartBosGun = bosGunTablosu[30]; // 8 gün

    // HTML elementlerine erişim
    const aySecimiSelect = document.getElementById('aySecimi');
    const izinGunInput = document.getElementById('izinGunSayisi');
    const hesaplaBtn = document.getElementById('hesaplaBtn');
    const sonucDiv = document.getElementById('sonuc');

    hesaplaBtn.addEventListener('click', hesaplaBoşGün);

    function hesaplaBoşGün() {
        const ayAdi = aySecimiSelect.value;
        const izinGunSayisi = parseInt(izinGunInput.value);

        // Geçerlilik Kontrolü
        if (!ayAdi || isNaN(izinGunSayisi) || izinGunSayisi < 0) {
            sonucDiv.innerHTML = "Lütfen geçerli bir ay seçin ve izin gün sayısını girin.";
            sonucDiv.className = 'sonuc-kutusu error';
            return;
        }

        const ayGunSayisi = ayGunleri[ayAdi];

        // 1. Bonus ve Düşülecek İzin Hesaplama
        let dusulecekIzin = izinGunSayisi;
        let bonusKullanildi = false;

        if (ayGunSayisi === 31) {
            // 31 çeken ayda, rapor/mazeretin ilk 1 günü düşülmez.
            if (izinGunSayisi > 0) {
                dusulecekIzin = izinGunSayisi - 1; // 1 gün bonus
                bonusKullanildi = true;
            } else {
                dusulecekIzin = 0;
            }
        }
        
        // Düşülecek izin sayısı negatif olamaz
        if (dusulecekIzin < 0) {
             dusulecekIzin = 0;
        }

        // 2. Fiili Çalışılan Gün Sayısını Hesaplama (Tabloya Esas Gün)
        // Tablo EK-5 30 günlük takvime göre olduğundan:
        // Fiili Çalışılan Gün = Ay Gün Sayısı (29/30) - Düşülecek İzin
        let fiiliCalismaGunu = ayGunSayisi - dusulecekIzin;
        
        // Tablo 30'a kadar gittiği için 30'dan büyük olamaz.
        if (fiiliCalismaGunu > 30) {
            fiiliCalismaGunu = 30; 
        } 
        
        // 3. Boş Gün Hakkını Bulma
        const hakEdilenBosGun = bosGunTablosu[fiiliCalismaGunu];
        
        if (hakEdilenBosGun === undefined) {
            sonucDiv.innerHTML = "Hata: Tablo aralığı dışında bir fiili çalışma günü oluştu.";
            sonucDiv.className = 'sonuc-kutusu error';
            return;
        }

        // 4. Düşen Boş Gün Sayısını Hesaplama
        // Standart 30 günlük ayda 8 boş gün hakkı vardır.
        const dusenBosGunSayisi = standartBosGun - hakEdilenBosGun;
        
        // 5. Sonucu Ekrana Yazdırma
        sonucDiv.innerHTML = `
            <p>Seçilen Ay: <strong>${ayAdi} (${ayGunSayisi} gün)</strong></p>
            <p>Toplam İzin: <strong>${izinGunSayisi} Gün</strong></p>
            ${bonusKullanildi ? `<p class="bonus-info" style="color:#008000;">31 Gün Bonusu Kullanıldı: <strong>1 Gün</strong></p>` : ''}
            <p>Tabloya Esas Fiili Çalışma Günü: <strong>${fiiliCalismaGunu} Gün</strong></p>
            <hr style="border-top: 1px solid #ccc; width: 60%; margin: 15px auto;">
            
            <p style="font-size: 1.5em; color: #cc0000;">Hak Edilen Kullanılabilir Boş Gün: <strong>${hakEdilenBosGun}</strong></p>
            
            <hr style="border-top: 1px solid #ccc; width: 60%; margin: 15px auto;">
            <p style="font-size: 1.2em; color: #004d99;">
                ${dusenBosGunSayisi} Boş Gününüz Planlama Tarafından Alınabilir 
                <span style="font-size:0.8em; display:block; color:#666;">(Standart 8 - Hak Edilen ${hakEdilenBosGun})</span>
            </p>
        `;
        sonucDiv.className = 'sonuc-kutusu'; // Başarılı sonuç stili
    }
});
