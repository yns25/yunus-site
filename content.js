// ─────────────────────────────────────────────────────
//  content.js  —  Firestore'dan içerik yükler
//  Firestore erişilemezse DEFAULT_CONTENT'e düşer.
// ─────────────────────────────────────────────────────

const DEFAULT_CONTENT = {
  hero: {
    labelTR: "Mühendis & Düşünen",
    labelEN: "Engineer & Thinker",
    bioTR: "İnsansız hava araçları geliştiriyorum, yazılım yazıyorum. <strong>Tekniği derin, kalbi uyanık</strong> bir zihin inşa etmeye çalışıyorum. İki dünya aynı anda: mühendis ve derviş.",
    bioEN: "I build unmanned aerial vehicles and write software. Trying to forge a mind that is <strong>technically deep and spiritually awake.</strong> Two worlds at once: engineer and dervish.",
  },
  projects: [
    {
      id: "goktug25", num: "01 / UAV", name: "GOKTUG-25",
      descTR: "TEKNOFEST İHA yarışması için geliştirilen sabit kanatlı insansız hava aracı. PyQt5 tabanlı yerli yer kontrol istasyonu, ArduPlane entegrasyonu.",
      descEN: "Fixed-wing UAV developed for the TEKNOFEST drone competition. Custom ground control station in PyQt5 with full ArduPlane integration.",
      tags: ["PyQt5::blue","ArduPlane::blue","MAVLink","SITL","TEKNOFEST::gold"],
      link: "goktug25.html",
      detail: {
        titleTR: "GOKTUG-25 Yerli Kontrol İstasyonu", titleEN: "GOKTUG-25 Ground Control Station",
        summaryTR: "TEKNOFEST 2025 İHA yarışması kapsamında geliştirilen, sabit kanatlı bir insansız hava aracı için tam donanımlı yer kontrol istasyonu.",
        summaryEN: "A fully-featured ground control station for a fixed-wing UAV, developed for the TEKNOFEST 2025 drone competition.",
        bodyTR: `<p>GÖKBERELİLER ekibi olarak TEKNOFEST 2025'e katılıyoruz.</p><h3>YKİ</h3><p>PyQt5 ile geliştirilen YKİ, MAVLink üzerinden uçakla haberleşir. ArduPlane SITL'de test edilmiştir.</p><h3>Özellikler</h3><ul><li>Gerçek zamanlı telemetri</li><li>Joystick kontrolü</li><li>Görev planlama</li></ul>`,
        bodyEN: `<p>We participate in TEKNOFEST 2025 as the GÖKBERELİLER team.</p><h3>GCS</h3><p>The GCS built in PyQt5 communicates via MAVLink and has been tested in ArduPlane SITL.</p><h3>Features</h3><ul><li>Real-time telemetry</li><li>Joystick control</li><li>Mission planning</li></ul>`,
        tags: ["PyQt5::blue","ArduPlane::blue","MAVLink","SITL","TEKNOFEST::gold"],
        status: "active", year: "2025", github: ""
      }
    },
    {
      id: "hikmetler", num: "02 / MOBILE", name: "Hikmetler Hazinesi",
      descTR: "922+ İslami hikmet, 4 dil, 62 âlim. Android uygulaması.",
      descEN: "922+ Islamic wisdoms, 4 languages, 62 scholars. Android app.",
      tags: ["JavaScript","Firebase::blue","Capacitor","Google Play::gold"],
      link: "hikmetler.html",
      detail: {
        titleTR: "Hikmetler Hazinesi", titleEN: "Hikmetler Hazinesi",
        summaryTR: "Büyük İslam âlimlerinin sözlerini dört dilde sunan Android uygulaması.",
        summaryEN: "Android app presenting the words of great Islamic scholars in four languages.",
        bodyTR: `<p>62 âlime ait 922+ hikmet, 4 dil, 15 kategori.</p><h3>Teknik</h3><p>Firebase Firestore, Capacitor, Vanilla JS.</p>`,
        bodyEN: `<p>922+ wisdoms from 62 scholars, 4 languages, 15 categories.</p><h3>Stack</h3><p>Firebase Firestore, Capacitor, Vanilla JS.</p>`,
        tags: ["JavaScript","Firebase::blue","Capacitor","Google Play::gold"],
        status: "published", year: "2025", github: ""
      }
    }
  ],
  about: {
    p1TR: "Mühendislik benim için sadece teknik bir meslek değil — dünyanın işleyişini <strong>anlama biçimi.</strong>",
    p1EN: "Engineering is not just a profession for me — it is a <strong>way of understanding</strong> how the world works.",
    p2TR: "Ama aklı işletmek yetmez. Kalbin de uyanık olması lazım. Bu yüzden tekniğin yanında <strong>tasavvuf, fıkıh ve düşünce tarihi</strong> de benim için eşit ağırlıkta.",
    p2EN: "But reason alone is not enough. The heart must be awake too. That is why <strong>Sufism, jurisprudence, and the history of thought</strong> carry equal weight.",
    p3TR: "Hikmetler Hazinesi uygulamasını yazdım çünkü büyük âlimlerin sözlerinin dijital dünyada hak ettiği yerde durması gerektiğini düşündüm.",
    p3EN: "I built Hikmetler Hazinesi because the words of great scholars deserve a proper place in the digital world.",
  },
  contact: {
    email: "mail@siteini-guncelle.com",
    github: "https://github.com/",
  }
};

// ── Firestore'dan içerik yükle ──────────────────────
// Bu fonksiyon index.html ve proje sayfalarından çağrılır.
// Firebase SDK'sı yüklendikten sonra çalışır.
async function loadSiteContent() {
  try {
    const db = firebase.firestore();
    const snap = await db.doc(DB_DOC).get();
    if (snap.exists) {
      return deepMerge(DEFAULT_CONTENT, snap.data());
    }
  } catch (e) {
    console.warn("Firestore erişilemedi, varsayılan içerik kullanılıyor.", e);
  }
  return DEFAULT_CONTENT;
}

function deepMerge(base, override) {
  const result = { ...base };
  for (const key in override) {
    if (Array.isArray(override[key])) {
      result[key] = override[key];
    } else if (typeof override[key] === 'object' && override[key] !== null) {
      result[key] = deepMerge(base[key] || {}, override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}
