import { COLORS } from '../constants/styles';

export const formatAIResponse = (response: string): string => {
  if (!response) return '';

  let formatted = response
    
    .replace(/\*\*(.*?)\*\*/g, '**$1**')
    .replace(/\*(.*?)\*/g, '• $1')
    .replace(/^- (.*?)(?=\n|$)/gm, '• $1')
    .replace(/^\d+\.\s/gm, '• ')
    .replace(/(\d+\))\s/g, '• ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/([.!?])([A-ZÇĞİÖŞÜ])/g, '$1\n\n$2')
    .trim();

  
  formatted = formatted
    .replace(/(ADIM|ADIMLAR|ÖNERİLER|TAVSİYELER|DİKKAT|UYARI|ÖNEMLİ|ACİL|İLK YARDIM):/gi, '\n\n**$1:**\n')
    .replace(/([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ\s]+):/g, '\n\n**$1:**\n');

  
  formatted = formatted
    .replace(/112/gi, '**112**')
    .replace(/AFAD/gi, '**AFAD**')
    .replace(/KIZILAY/gi, '**KIZILAY**')
    .replace(/112'yi arayın/gi, '**112\'yi hemen arayın**')
    .replace(/acil durum/gi, '**acil durum**')
    .replace(/ilk yardım/gi, '**ilk yardım**');

 
  formatted = formatted
    .replace(/dikkat/gi, '⚠️ Dikkat')
    .replace(/uyarı/gi, '⚠️ Uyarı')
    .replace(/önemli/gi, '⭐ Önemli')
    .replace(/tavsiye/gi, '💡 Tavsiye')
    .replace(/adım/gi, '↳ Adım')
    .replace(/ilk yardım/gi, '🩺 İlk Yardım')
    .replace(/acil/gi, '🚨 Acil')
    .replace(/güvenli/gi, '🛡️ Güvenli')
    .replace(/yardım/gi, '🤝 Yardım')
    .replace(/sağlık/gi, '🏥 Sağlık');

  return formatted;
};

export const PROMPTS = {
  DEPREM_ANINDA: (location: string) => `
Lütfen aşağıdaki yanıtı KISA, NET ve MADDE MADDE formatında ver. 
Her madde maksimum 2 cümle olsun. 
Başlıklar için **kalın** yazı kullan. 
Emoji kullanarak önemli noktaları vurgula.

Konum: ${location}
Deprem anında yapılması gerekenler:

**📍 BULUNDUĞUN YERDE KAL**
• Sakin ol, panik yapma
• Sağlam bir masa/sıra altına gir
• Başını ve boynunu koru

**🚨 GÜVENLİK ÖNLEMLERİ**
• Pencerelerden ve camlardan uzak dur
• Asansörleri kesinlikle kullanma

**📱 İLETİŞİM VE HABERLEŞME**
• Sadece acil durumlarda 112'yi ara
• Mesajlaşmayı tercih et, telefon hatlarını meşgul etme

**🌍 DIŞARIDAYSAN**
• Açık alana git, binalardan uzak dur
• Elektrik hatları ve direklerden uzak dur

**🚗 ARABA KULLANIYORSAN**
• Aracı güvenli bir yere çek ve motoru durdur
• Köprü, üst geçit ve tünel girişlerinden uzak dur

**👥 KALABALIK YERLERDEYSEN**
• Sakin ol, paniğe kapılma
• Çıkışlara doğru ilerle ama koşma
`.trim(),

  YARALANMALAR: (injuryType: string) => `
Lütfen aşağıdaki yanıtı ACİL DURUM formatında ver.
Her madde çok kısa ve anlaşılır olsun.
**Kalın** yazılar ile acil durumları vurgula.
Emoji kullan.

Yaralanma türü: ${injuryType}

**🆘 ACİL DURUM PROTOKOLÜ**
• Önce kendi güvenliğini sağla
• 112'yi hemen ara ve durumu bildir

**👁️ DURUM DEĞERLENDİRMESİ**
• Yaralının bilincini kontrol et: "İyi misiniz?" diye sor
• Solunum ve nabzı kontrol et

**🩺 İLK MÜDAHALE**
• Kanama varsa temiz bezle baskı uygula
• Yaralı bölgeyi hareket ettirme, sabitle
• Yaralıyı sıcak tut, üzerini ört

**⚠️ YAPILMAMASI GEREKENLER**
• Yaralıyı gereksiz yere hareket ettirme
• Bilinçsiz müdahaleden kaçın
• Yaraya tentürdiyot, alkol gibi maddeler sürme

**📞 ACİL İLETİŞİM BİLGİLERİ**
• 112'ye şunları söyle: 
  - **Yaralanma türü:** ${injuryType}
  - **Konum:** Bulunduğunuz adres
  - **Yaralı sayısı:** Kaç kişi yaralı
  - **Durum:** Bilinç ve solunum durumu

**🕐 BEKLEME SÜRESİ**
• Ambulans gelene kadar yaralıyı yalnız bırakma
• Durumu düzenli olarak kontrol et
`.trim(),

  DEPREM_SONRASI: (situation: string) => `
Lütfen aşağıdaki yanıtı NET ve PRATİK BİLGİLER şeklinde ver.
Madde madde ve kısa olsun.
**Kalın** başlıklar kullan.
Emoji ile görsel zenginlik kat.

Durum: ${situation}
Deprem sonrası yapılması gerekenler:

**🏠 EVİ KONTROL ET**
• Gaz, su ve elektrik vanalarını kapat
• Olası gaz kaçağına karşı kibrit/çakmak kullanma

**👪 AİLE BİREYLERİ**
• Aile fertlerinin güvende olduğundan emin ol
• Önceden belirlenen buluşma noktasına git

**📻 BİLGİLENME**
• Pilli radyo ile resmi açıklamaları takip et
• Dedikodulara değil, yetkili kurumlara güven

**🏢 BİNA DIŞINA ÇIKARKEN**
• Ayakkabı ve eldiven giy
• Çök-kapan-tutun yöntemini uygula

**🤝 KOMŞULUK YARDIMLAŞMASI**
• Yaşlı ve engelli komşulara yardım et
• Çocukları sakinleştir ve güvende tut

**📱 HABERLEŞME**
• Telefon hatlarını gereksiz yere meşgul etme
• SMS ve internet tabanlı mesajlaşma uygulamalarını kullan
`.trim(),

  IHTIYAC_PLANI: (details: string) => `
Lütfen aşağıdaki yanıtı DÜZENLİ ve KATEGORİK şeklinde ver.
Her kategori için **kalın** başlıklar kullan.
Pratik ve uygulanabilir öneriler ver.
Emoji kullan.

İhtiyaç Detayları: ${details}
Deprem hazırlık planı:

**💧 SU İHTİYACI**
• Kişi başı günde 4 litre su (3 günlük)
• 2 kişi için: 24 litre su
• 4 kişi için: 48 litre su

**🍞 GIDA STOĞU**
• Konserve yiyecekler (ton balığı, fasulye, mısır)
• Kuru gıdalar (bisküvi, kraker, kuruyemiş)
• Bebek maması (varsa bebek)
• Yüksek enerjili gıdalar

**🩺 İLK YARDIM ÇANTASI**
• Yara bandı, gazlı bez, plaster
• Ağrı kesici, ateş düşürücü
• Reçeteli ilaçlar (varsa)
• Eldiven, maske, antiseptik

**🔦 ACİL DURUM EKİPMANLARI**
• Pilli radyo ve yedek piller
• El feneri ve yedek piller
• Çok amaçlı çakı
• Düdük (yardım çağırmak için)

**📄 ÖNEMLİ EVRAKLAR**
• Kimlikler, pasaportlar (fotokopi)
• Sigorta poliçeleri
• Banka hesap bilgileri
• Acil durum iletişim numaraları

**👕 KİŞİSEL EŞYALAR**
• Kalın giysiler, yağmurluk
• Battaniye, uyku tulumu
• Kişisel hijyen malzemeleri
• Çocuklar için oyuncak/kitap
`.trim()
};