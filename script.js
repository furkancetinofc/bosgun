document.addEventListener('DOMContentLoaded', () => {
    // EK-5 Tablosu (Revize): 31 gün fiili çalışma karşılığı 8 boş gün eklendi ve bonus mantığı kaldırıldı.
    const bosGunTablosu = {
        // Çalışılan Takvim Ayı Günleri: Kullanılabilecek Boş Gün Sayısı
        31: 8,  // 31 gün fiili çalışana 8 boş gün
        30: 8, 29: 8, 28: 7, 27: 7, 26: 7, 25: 7, 
        24: 6, 23: 6, 22: 6, 21: 6, 20: 5, 19: 5, 
        18: 5, 17: 5, 16: 4, 15: 4, 14: 4, 13: 3, 
        12: 3, 11: 3, 10: 3, 9: 2, 8: 2, 7: 2, 
        6: 2, 5: 1, 4: 1, 3: 1, 2: 1, 1: 0, 0: 0 
    };

    // Ayların Gün Sayıları
    const ayGunleri = {
        Ocak: 31, Subat: 29, Mart: 31, Nisan: 30, Mayis: 31, Haziran: 30,
        Temmuz: 31, Agustos: 31, Eylul: 30, Ekim: 31, Kasim: 30, Aralik: 31
    };
    
    // Standart boş gün hakkı (Ayın 30 gün çekmesi durumunda hak edilen en yüksek boş gün sayısı)
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

        // 1. Fiili Çalışılan Gün Sayısını Hesaplama (31 çeken ay için düzeltildi)
        // Fiili Çalışılan Gün = Ayın Gün Sayısı - Alınan Rapor/Mazeret
        let fiiliCalismaGunu = ayGunSayisi - izinGunSayisi;
        
        // 2. Tablo Anahtarı Olarak Kullanılacak Değeri Ayarlama
        // Fiili çalışma 31'den büyük olamaz. 0'dan küçük olamaz.
        if (fiiliCalismaGunu > 31) {
            fiiliCalismaGunu = 31;
        } else if (fiiliCalismaGunu < 1) {
            fiiliCalismaGunu = 0;
        }

        // 3. Boş Gün Hakkını Bulma
        const hakEdilenBosGun = bosGunTablosu[fiiliCalismaGunu];
        
        if (hakEdilenBosGun === undefined) {
            sonucDiv.innerHTML = "Hata: Hesaplama aralığı dışında bir fiili çalışma günü oluştu.";
            sonucDiv.className = 'sonuc-kutusu error';
            return;
        }

        // 4. Düşen Boş Gün Sayısını Hesaplama
        // Standart (30 gün takvime göre en yüksek) 8 boş gün hakkı vardır.
        const dusenBosGunSayisi = standartBosGun - hakEdilenBosGun;
        
        // 5. Sonucu Ekrana Yazdırma
        sonucDiv.innerHTML = `
            <p>Seçilen Ay: <strong>${ayAdi} (${ayGunSayisi} gün)</strong></p>
            <p>Toplam İzin: <strong>${izinGunSayisi} Gün</strong></p>
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
