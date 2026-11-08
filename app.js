/* Chermantia — ortak site betiği (tüm sayfalarda paylaşılır) */
(function(){

/* ---------- mobil menü ---------- */
var tog=document.querySelector('.navtog'), links=document.querySelector('.nav-links');
if(tog&&links){
  tog.addEventListener('click',function(){ links.classList.toggle('open'); });
  links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ links.classList.remove('open'); }); });
}

/* ---------- scroll ilerleme çubuğu ---------- */
var bar=document.querySelector('.progress');
if(bar){
  var tick=function(){
    var h=document.documentElement, max=(h.scrollHeight-h.clientHeight)||1;
    bar.style.width=Math.min(100,Math.max(0,(h.scrollTop||document.body.scrollTop)/max*100))+'%';
  };
  addEventListener('scroll',tick,{passive:true}); addEventListener('resize',tick); tick();
}

/* ---------- scroll-trigger reveal ---------- */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('go');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

/* ---------- lenis smooth scroll + hero parallax (motion-safe) ---------- */
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!reduce && window.Lenis){
  var lenis=new Lenis({duration:1.15,smoothWheel:true,wheelMultiplier:1,touchMultiplier:1.5});
  function raf(t){lenis.raf(t);requestAnimationFrame(raf)}
  requestAnimationFrame(raf);
  var field=document.querySelector('.field'),
      pin=document.querySelector('.pin'),
      cw=document.querySelector('.codewrap'),
      ptext=document.querySelector('.pintext');
  function par(){
    var y=lenis.scroll||window.scrollY||0;
    if(field)field.style.transform='translateY('+(y*0.05).toFixed(1)+'px)';
    if(pin && window.innerWidth>860){
      var total=pin.offsetHeight-window.innerHeight;
      var p=total>0?(y-pin.offsetTop)/total:0; p=Math.min(1,Math.max(0,p));
      if(cw){cw.style.transform='perspective(1100px) translateY('+(p*-54).toFixed(1)+'px) rotateX('+(p*12).toFixed(1)+'deg) scale('+(1-p*0.12).toFixed(3)+')';cw.style.opacity=(1-p*0.5).toFixed(2);}
      if(ptext){ptext.style.transform='translateY('+(p*-42).toFixed(1)+'px)';ptext.style.opacity=(1-p*0.62).toFixed(2);}
    } else {
      if(cw){cw.style.transform='';cw.style.opacity='';}
      if(ptext){ptext.style.transform='';ptext.style.opacity='';}
    }
  }
  lenis.on('scroll',par); par();
}

/* ---------- iletişim formu → mailto ---------- */
var f=document.getElementById('cform');
if(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var ad=document.getElementById('f_ad').value.trim();
    var mail=document.getElementById('f_mail').value.trim();
    var msg=document.getElementById('f_msg').value.trim();
    var err=document.getElementById('f_err');
    if(!(ad && msg && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail))){ err.style.display='block'; return; }
    err.style.display='none';
    var sub=encodeURIComponent('Chermantia — '+ad);
    var body=encodeURIComponent('Ad: '+ad+'\nE-posta: '+mail+'\n\n'+msg);
    window.location.href='mailto:chermantiastudio@gmail.com?subject='+sub+'&body='+body;
  });
}

/* ---------- proje hesaplayıcı ---------- */
var estRoot=document.getElementById('hesaplayici');
if(estRoot){
  var L={
    tiers:{tr:["Küçük kapsam","Orta kapsam","Büyük kapsam","Kapsamlı sistem"],en:["Small scope","Medium scope","Large scope","Comprehensive system"],de:["Kleiner Umfang","Mittlerer Umfang","Großer Umfang","Umfassendes System"]},
    times:{tr:["birkaç gün","1-2 hafta","3-5 hafta","6+ hafta"],en:["a few days","1-2 weeks","3-5 weeks","6+ weeks"],de:["wenige Tage","1-2 Wochen","3-5 Wochen","6+ Wochen"]}
  };
  var elang=function(){ var l=document.documentElement.lang; return /^(en|de)$/.test(l)?l:'tr'; };
  estRoot.querySelectorAll('.estopts').forEach(function(g){
    var single=g.getAttribute('data-single');
    g.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click',function(){
        if(single){ g.querySelectorAll('button').forEach(function(x){x.classList.remove('on')}); b.classList.add('on'); }
        else b.classList.toggle('on');
        calc();
      });
    });
  });
  function calc(){
    var w=0, any=false;
    estRoot.querySelectorAll('.estopts button.on').forEach(function(b){ w+=parseInt(b.getAttribute('data-w')||'0',10); any=true; });
    if(!any) return;
    var i = w<=2?0 : w<=5?1 : w<=8?2 : 3, l=elang();
    document.getElementById('est-tier').textContent=L.tiers[l][i];
    document.getElementById('est-time').textContent=L.times[l][i];
  }
  document.addEventListener('chlang',calc);
}

/* ---------- canlı GitHub akışı ---------- */
var ghbox=document.getElementById('ghrepos');
if(ghbox){
  var icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 00-6.2 0C6.7 2.3 5.6 2.6 5.6 2.6a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>';
  var esc=function(s){ return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); };
  var ago=function(d){
    var l=(/^(en|de)$/.test(document.documentElement.lang)?document.documentElement.lang:'tr');
    var U={tr:{d:"gün önce",mo:"ay önce",y:"yıl önce",now:"bugün"},en:{d:"days ago",mo:"months ago",y:"years ago",now:"today"},de:{d:"Tage her",mo:"Monate her",y:"Jahre her",now:"heute"}}[l];
    var s=(Date.now()-new Date(d))/1000, D=86400;
    if(s<D) return U.now; var n=Math.floor(s/D); if(n<30) return n+" "+U.d; var m=Math.floor(n/30); if(m<12) return m+" "+U.mo; return Math.floor(m/12)+" "+U.y;
  };
  var ghfallback=function(){ ghbox.innerHTML='<div class="ghempty"><a href="https://github.com/arventia-lab" target="_blank" rel="noopener" style="color:var(--teal)">github.com/arventia-lab →</a></div>'; };
  fetch('https://api.github.com/users/arventia-lab/repos?sort=updated&per_page=12')
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(rs){
      rs=(rs||[]).filter(function(x){return !x.fork;}).slice(0,6);
      if(!rs.length){ ghfallback(); return; }
      ghbox.innerHTML=rs.map(function(x){
        return '<a class="ghcard" href="'+x.html_url+'" target="_blank" rel="noopener"><h3>'+icon+esc(x.name)+'</h3><p>'+esc(x.description||'—')+'</p><div class="ghmeta">'+(x.language?'<span><span class="dotlang"></span>'+esc(x.language)+'</span>':'')+'<span>★ '+(x.stargazers_count||0)+'</span><span>'+ago(x.updated_at)+'</span></div></a>';
      }).join('');
    })
    .catch(function(){ ghfallback(); });
}

/* ---------- canlı demo (BroadcastChannel) ---------- */
var dbtn=document.getElementById('demo-btn');
if(dbtn && ('BroadcastChannel' in window)){
  var ch=new BroadcastChannel('chermantia-live');
  var countEl=document.getElementById('demo-count'), pulse=document.getElementById('demo-pulse'), tabsEl=document.getElementById('demo-tabs');
  var n=0, id=Math.random().toString(36).slice(2), peers={};
  function flash(){ pulse.classList.add('on'); setTimeout(function(){pulse.classList.remove('on');},150); }
  function bump(){ n++; countEl.textContent=n; flash(); }
  function render(){ var now=Date.now(); for(var k in peers){ if(now-peers[k]>8000) delete peers[k]; } tabsEl.textContent=Object.keys(peers).length+1; }
  dbtn.addEventListener('click',function(){ bump(); ch.postMessage({t:'click'}); });
  ch.onmessage=function(e){ var d=e.data||{};
    if(d.t==='click'){ bump(); }
    else if(d.t==='hi'){ peers[d.id]=Date.now(); ch.postMessage({t:'yo',id:id}); render(); }
    else if(d.t==='yo'){ peers[d.id]=Date.now(); render(); }
    else if(d.t==='bye'){ delete peers[d.id]; render(); }
  };
  ch.postMessage({t:'hi',id:id});
  setInterval(function(){ ch.postMessage({t:'yo',id:id}); render(); },3000);
  window.addEventListener('beforeunload',function(){ try{ch.postMessage({t:'bye',id:id});}catch(e){} });
}

/* ---------- çok dilli içerik (TR / EN / DE) ---------- */
var T={
"nav.anasayfa":{tr:"Ana Sayfa",en:"Home",de:"Startseite"},
"nav.projeler":{tr:"Projeler",en:"Projects",de:"Projekte"},
"nav.surec":{tr:"Süreç",en:"Process",de:"Prozess"},
"nav.hizmetler":{tr:"Hizmetler",en:"Services",de:"Leistungen"},
"nav.hakkimizda":{tr:"Hakkımızda",en:"About",de:"Über uns"},
"nav.sss":{tr:"SSS",en:"FAQ",de:"FAQ"},
"nav.iletisim":{tr:"İletişim",en:"Contact",de:"Kontakt"},
"home.ov.eyebrow":{tr:"Ne Sunuyoruz",en:"What We Offer",de:"Was wir bieten"},
"home.ov.h2":{tr:"Üç başlıkta Chermantia",en:"Chermantia in three tracks",de:"Chermantia in drei Bereichen"},
"home.ov.sub":{tr:"İşlerimize, çalışma sürecimize ve hizmetlerimize ayrı ayrı göz at.",en:"Explore our work, how we work and our services — each on its own page.",de:"Entdecke unsere Projekte, unseren Prozess und unsere Leistungen — je auf einer eigenen Seite."},
"ov.proj.d":{tr:"Canlıya alınmış gerçek işler, vaka çalışmaları ve canlı GitHub akışı.",en:"Shipped work, case studies and a live GitHub feed.",de:"Live gegangene Projekte, Fallstudien und ein Live-GitHub-Feed."},
"ov.surec.d":{tr:"Fikirden teslime 5 adımlık şeffaf sürecimiz ve sık sorulanlar.",en:"Our transparent 5-step process from idea to delivery, plus FAQ.",de:"Unser transparenter 5-Schritte-Prozess von der Idee bis zur Lieferung, plus FAQ."},
"ov.hiz.d":{tr:"Hizmet kalemleri, proje hesaplayıcı ve kullandığımız teknolojiler.",en:"Service offerings, a project estimator and the tech we use.",de:"Leistungen, ein Projekt-Rechner und die Technologien, die wir nutzen."},
"link.incele":{tr:"İncele",en:"Explore",de:"Ansehen"},
"hero.chip":{tr:"Freelance &amp; uzaktan projelere açık",en:"Open to freelance &amp; remote projects",de:"Offen für Freelance- &amp; Remote-Projekte"},
"hero.h1":{tr:"Fikirden<br><span class=\"ggrad\">canlı ürüne</span>",en:"From idea<br><span class=\"ggrad\">to live product</span>",de:"Von der Idee<br><span class=\"ggrad\">zum Live-Produkt</span>"},
"hero.sub":{tr:"<b>Chermantia</b> — full-stack web, gerçek zamanlı sistemler ve otomasyon üzerine bağımsız bir yazılım stüdyosu. Veritabanından arayüze, uçtan uca inşa ederiz.",en:"<b>Chermantia</b> — an independent software studio for full-stack web, real-time systems and automation. From database to interface, we build end to end.",de:"<b>Chermantia</b> — ein unabhängiges Software-Studio für Full-Stack-Web, Echtzeitsysteme und Automatisierung. Von der Datenbank bis zur Oberfläche bauen wir Ende-zu-Ende."},
"hero.btn1":{tr:"İşlere Bak",en:"View Work",de:"Projekte ansehen"},
"hero.btn2":{tr:"İletişime Geç",en:"Get in Touch",de:"Kontakt aufnehmen"},
"hero.stat1":{tr:"yıl deneyim",en:"years experience",de:"Jahre Erfahrung"},
"hero.stat2":{tr:"uçtan uca geliştirme",en:"end-to-end development",de:"Ende-zu-Ende-Entwicklung"},
"hero.stat3":{tr:"WebSocket &amp; çok oyunculu",en:"WebSocket &amp; multiplayer",de:"WebSocket &amp; Multiplayer"},
"hero.cue":{tr:"kaydır",en:"scroll",de:"scrollen"},
"proj.eyebrow":{tr:"Portföy",en:"Portfolio",de:"Portfolio"},
"proj.h2":{tr:"Uçtan uca geliştirdiğimiz işler",en:"Work we built end to end",de:"Projekte, die wir Ende-zu-Ende gebaut haben"},
"proj.sub":{tr:"Tasarımdan veritabanına, canlıya alınmış gerçek çalışmalar.",en:"Real, shipped work — from design to database.",de:"Echte, live gegangene Arbeiten — vom Design bis zur Datenbank."},
"proj1.title":{tr:"Payout Review",en:"Payout Review",de:"Payout Review"},
"real.eyebrow":{tr:"Canlı İş",en:"Live Work",de:"Live-Arbeit"},
"real.h2":{tr:"Soyut vaat değil — gerçek, çalışan ürün",en:"Not abstract promises — real, working product",de:"Keine leeren Versprechen — echtes, funktionierendes Produkt"},
"real.sub":{tr:"Aşağıdaki araç şu anda canlı; açıp kendin deneyebilirsin. İşimiz böyle görünüyor.",en:"The tool below is live right now — open it and try it yourself. This is what our work looks like.",de:"Das Tool unten ist jetzt live — öffne es und probiere es selbst. So sieht unsere Arbeit aus."},
"proj1.badge":{tr:"Canlı Araç",en:"Live Tool",de:"Live-Tool"},
"proj1.live":{tr:"CANLI · DEMO VERİ",en:"LIVE · DEMO DATA",de:"LIVE · DEMO-DATEN"},
"proj1.desc":{tr:"Tarayıcıda çalışan fraud &amp; risk inceleme aracı. CSV yükleyip hesap bazında risk skoru üretir — entegrasyon gerektirmez, veri tarayıcıdan çıkmaz.",en:"Browser-based fraud &amp; risk review tool. Upload a CSV and it scores risk per account — no integration, data never leaves the browser.",de:"Browserbasiertes Fraud- &amp; Risiko-Tool. CSV hochladen und es bewertet das Risiko pro Konto — keine Integration, Daten verlassen nie den Browser."},
"proj2.title":{tr:"Gerçek Zamanlı Çok Oyunculu Platform",en:"Real-Time Multiplayer Platform",de:"Echtzeit-Multiplayer-Plattform"},
"proj2.desc":{tr:"WebSocket ile gecikmesiz senkron sunucular: ölçeklenebilir motor mimarisi, canlı oturum ve masa yönetimi, bot rakipler. (Örnek uygulama: okey/batak.)",en:"Low-latency synced servers over WebSocket: scalable engine architecture, live session and table management, bot opponents. (Example build: okey/batak.)",de:"Latenzarme, synchrone Server über WebSocket: skalierbare Engine-Architektur, Live-Session- und Tischverwaltung, Bot-Gegner. (Beispiel: Okey/Batak.)"},
"proj3.title":{tr:"Full-Stack Web Uygulamaları",en:"Full-Stack Web Apps",de:"Full-Stack-Web-Apps"},
"proj3.desc":{tr:"Bun + TypeScript ile uçtan uca web uygulamaları: kullanıcı/oturum yönetimi, SQLite veritabanı, REST + WebSocket API ve yönetim paneli. İhtiyaca özel panel ve otomasyon.",en:"End-to-end web apps with Bun + TypeScript: user/session management, SQLite database, REST + WebSocket API and admin panel. Custom panels and automation.",de:"Ende-zu-Ende-Web-Apps mit Bun + TypeScript: Benutzer-/Session-Verwaltung, SQLite-Datenbank, REST- + WebSocket-API und Admin-Panel. Individuelle Panels und Automatisierung."},
"pill.dataanalysis":{tr:"Veri Analizi",en:"Data Analysis",de:"Datenanalyse"},
"link.live":{tr:"Canlı Gör",en:"View Live",de:"Live ansehen"},
"link.bionluk":{tr:"Bionluk'ta Gör",en:"View on Bionluk",de:"Auf Bionluk ansehen"},
"link.quote":{tr:"Teklif Al",en:"Get a Quote",de:"Angebot anfordern"},
"est.eyebrow":{tr:"Proje Hesaplayıcı",en:"Project Estimator",de:"Projekt-Rechner"},
"est.h2":{tr:"Projeni birkaç tıkla planla",en:"Plan your project in a few clicks",de:"Plane dein Projekt mit wenigen Klicks"},
"est.sub":{tr:"Seç, anında tahmini kapsam ve süreyi gör — net teklifi birlikte netleştiririz.",en:"Select and instantly see estimated scope and time — we finalize the exact quote together.",de:"Wähle aus und sieh sofort geschätzten Umfang und Zeit — das genaue Angebot klären wir gemeinsam."},
"est.type":{tr:"Proje türü",en:"Project type",de:"Projekttyp"},
"est.t.landing":{tr:"Landing",en:"Landing",de:"Landing"},
"est.t.corp":{tr:"Kurumsal Site",en:"Corporate Site",de:"Unternehmensseite"},
"est.t.app":{tr:"Web Uygulaması",en:"Web App",de:"Web-App"},
"est.t.ecom":{tr:"E-ticaret",en:"E-commerce",de:"E-Commerce"},
"est.t.custom":{tr:"Özel Sistem",en:"Custom System",de:"Individuelles System"},
"est.feat":{tr:"Özellikler",en:"Features",de:"Funktionen"},
"est.f.panel":{tr:"Yönetim paneli",en:"Admin panel",de:"Admin-Panel"},
"est.f.lang":{tr:"Çoklu dil",en:"Multi-language",de:"Mehrsprachig"},
"est.f.pay":{tr:"Ödeme entegrasyonu",en:"Payment integration",de:"Zahlungsintegration"},
"est.f.rt":{tr:"Gerçek zamanlı",en:"Real-time",de:"Echtzeit"},
"est.f.seo":{tr:"SEO &amp; hız",en:"SEO &amp; speed",de:"SEO &amp; Tempo"},
"est.f.api":{tr:"API entegrasyonu",en:"API integration",de:"API-Integration"},
"est.urg":{tr:"Zamanlama",en:"Timing",de:"Zeitplan"},
"est.u.normal":{tr:"Normal",en:"Normal",de:"Normal"},
"est.u.rush":{tr:"Acele",en:"Rush",de:"Eilig"},
"est.result":{tr:"Tahmini",en:"Estimate",de:"Schätzung"},
"est.pick":{tr:"Seçim yap →",en:"Make a selection →",de:"Triff eine Auswahl →"},
"est.scopelabel":{tr:"tahmini süre",en:"estimated time",de:"geschätzte Zeit"},
"est.note":{tr:"Bu bir ön tahmindir; net fiyat ve süreyi kapsamı konuşunca veririm.",en:"This is a rough estimate; I'll give the exact price and time once we discuss the scope.",de:"Dies ist eine grobe Schätzung; den genauen Preis und Zeitrahmen nenne ich nach Besprechung des Umfangs."},
"gh.eyebrow":{tr:"Canlı GitHub",en:"Live GitHub",de:"Live-GitHub"},
"gh.h2":{tr:"Açık kaynak &amp; aktif geliştirme",en:"Open source &amp; active development",de:"Open Source &amp; aktive Entwicklung"},
"gh.sub":{tr:"GitHub'daki son çalışmalarım — bu liste canlı, kendi kendine güncellenir.",en:"My latest work on GitHub — this list is live and updates itself.",de:"Meine neuesten Arbeiten auf GitHub — diese Liste ist live und aktualisiert sich selbst."},
"gh.loading":{tr:"Yükleniyor…",en:"Loading…",de:"Wird geladen…"},
"demo.eyebrow":{tr:"Canlı Demo",en:"Live Demo",de:"Live-Demo"},
"demo.h2":{tr:"Gerçek zamanlı — kendin dene",en:"Real-time — try it yourself",de:"Echtzeit — probiere es selbst"},
"demo.sub":{tr:"Bu sayfayı iki sekmede aç, birinde tıkla; diğerinde anında senkron olsun. İşte bizim işimiz.",en:"Open this page in two tabs, click in one; the other syncs instantly. This is what we do.",de:"Öffne diese Seite in zwei Tabs, klicke in einem; der andere synchronisiert sofort. Genau das machen wir."},
"demo.clicks":{tr:"senkron tıklama",en:"synced clicks",de:"synchrone Klicks"},
"demo.btn":{tr:"Canlı Gönder",en:"Send Live",de:"Live senden"},
"demo.tabs":{tr:"bağlı sekme",en:"connected tabs",de:"verbundene Tabs"},
"arch.eyebrow":{tr:"Mimari",en:"Architecture",de:"Architektur"},
"arch.h2":{tr:"Perde arkası: nasıl çalışıyor",en:"Behind the scenes: how it works",de:"Hinter den Kulissen: wie es funktioniert"},
"arch.sub":{tr:"Tarayıcıdan veritabanına kadar uçtan uca kurduğumuz gerçek zamanlı mimari — veri paketleri canlı akıyor.",en:"The real-time architecture we build end to end, from browser to database — data packets flow live.",de:"Die Echtzeit-Architektur, die wir Ende-zu-Ende bauen, vom Browser bis zur Datenbank — Datenpakete fließen live."},
"arch.client":{tr:"Tarayıcı",en:"Browser",de:"Browser"},
"arch.clientsub":{tr:"React · arayüz",en:"React · UI",de:"React · UI"},
"arch.server":{tr:"Bun Sunucu",en:"Bun Server",de:"Bun-Server"},
"arch.engine":{tr:"Motor",en:"Engine",de:"Engine"},
"arch.enginesub":{tr:"oyun / iş mantığı",en:"game / business logic",de:"Spiel- / Geschäftslogik"},
"arch.db":{tr:"Veritabanı",en:"Database",de:"Datenbank"},
"arch.dbsub":{tr:"SQLite · kalıcı veri",en:"SQLite · persistent data",de:"SQLite · persistente Daten"},
"arch.leg.ws":{tr:"WebSocket (çift yönlü)",en:"WebSocket (two-way)",de:"WebSocket (bidirektional)"},
"arch.leg.eng":{tr:"Motor çağrısı",en:"Engine call",de:"Engine-Aufruf"},
"arch.leg.db":{tr:"Veri yazma/okuma",en:"Data write/read",de:"Daten schreiben/lesen"},
"promise.eyebrow":{tr:"Çalışma Sözümüz",en:"Our Promise",de:"Unser Versprechen"},
"promise.h2":{tr:"Neden Chermantia?",en:"Why Chermantia?",de:"Warum Chermantia?"},
"promise.sub":{tr:"Süslü vaatler değil, net taahhütler. Her projede sana bunları garanti ediyoruz.",en:"No fluff, just clear commitments. This is what we guarantee you on every project.",de:"Keine leeren Worte, sondern klare Zusagen. Das garantieren wir dir bei jedem Projekt."},
"avail.badge":{tr:"Şu an yeni projelere açık",en:"Currently open to new projects",de:"Aktuell offen für neue Projekte"},
"avail.sub":{tr:"· genelde 24 saat içinde yanıt",en:"· usually a reply within 24 hours",de:"· meist Antwort innerhalb von 24 Stunden"},
"t1.t":{tr:"Şeffaf fiyat",en:"Transparent pricing",de:"Transparente Preise"},
"t1.d":{tr:"Kapsamı konuşur, sabit ve net bir teklif veririz — sürpriz maliyet yok.",en:"We agree the scope and give a fixed, clear quote — no surprise costs.",de:"Wir klären den Umfang und geben ein festes, klares Angebot — keine versteckten Kosten."},
"t2.t":{tr:"Doğrudan geliştirici",en:"Straight to the developer",de:"Direkt zum Entwickler"},
"t2.d":{tr:"Aracı yok; işi yapan kişiyle birebir çalışırsın, hızlı ve net iletişim.",en:"No middlemen; you work one-on-one with the person building it.",de:"Keine Mittelsmänner; du arbeitest direkt mit dem, der es baut."},
"t3.t":{tr:"Temiz & bakımlı kod",en:"Clean, maintainable code",de:"Sauberer, wartbarer Code"},
"t3.d":{tr:"Okunur, sürdürülebilir kod — ileride geliştirmesi ve devralması kolay.",en:"Readable, sustainable code — easy to extend and hand over later.",de:"Lesbarer, nachhaltiger Code — leicht zu erweitern und zu übergeben."},
"t4.t":{tr:"Zamanında teslim",en:"On-time delivery",de:"Pünktliche Lieferung"},
"t4.d":{tr:"Başta net bir zaman çizelgesi; söz verdiğimiz tarihte teslim.",en:"A clear timeline upfront; delivered on the date we promised.",de:"Vorab ein klarer Zeitplan; Lieferung zum zugesagten Termin."},
"t5.t":{tr:"Revizyon & destek",en:"Revisions & support",de:"Revisionen & Support"},
"t5.d":{tr:"Teslim sonrası kısa anlatım, küçük düzeltmeler ve takıldığın yerde destek.",en:"A short walkthrough, minor fixes and support where you get stuck.",de:"Kurze Einweisung, kleine Korrekturen und Support bei Problemen."},
"t6.t":{tr:"Veri gizliliği",en:"Data privacy",de:"Datenschutz"},
"t6.d":{tr:"Verin güvende; gereksiz paylaşım yok, mümkünse veri cihazdan çıkmaz.",en:"Your data stays safe; no needless sharing, kept on-device where possible.",de:"Deine Daten bleiben sicher; keine unnötige Weitergabe, wenn möglich geräteintern."},
"vaka.eyebrow":{tr:"Vaka Çalışmaları",en:"Case Studies",de:"Fallstudien"},
"vaka.h2":{tr:"Yakından: nasıl çözdük",en:"Up close: how we solved it",de:"Im Detail: wie wir es gelöst haben"},
"vaka.sub":{tr:"Birkaç işi hedef, yaklaşım ve sonucuyla açtık.",en:"A few projects, broken down by goal, approach and result.",de:"Einige Projekte, aufgeschlüsselt nach Ziel, Ansatz und Ergebnis."},
"vaka.goal":{tr:"Hedef",en:"Goal",de:"Ziel"},
"vaka.approach":{tr:"Yaklaşım",en:"Approach",de:"Ansatz"},
"vaka.result":{tr:"Sonuç",en:"Result",de:"Ergebnis"},
"case1.goal":{tr:"Ödeme/çekim işlemlerinde riskli hesapları, veriyi dışarı çıkarmadan hızlıca ayıklamak.",en:"Quickly flag risky accounts in payout/withdrawal flows — without data ever leaving the device.",de:"Riskante Konten in Auszahlungs-Flows schnell markieren — ohne dass Daten das Gerät verlassen."},
"case1.approach":{tr:"Tamamen tarayıcıda çalışan, CSV yükleyip hesap bazında kural motoruyla risk skoru üreten bir araç geliştirdik — sunucu ya da entegrasyon gerektirmez.",en:"We built a fully browser-based tool that ingests a CSV and scores risk per account via a rule engine — no server or integration needed.",de:"Wir bauten ein vollständig browserbasiertes Tool, das eine CSV einliest und das Risiko pro Konto über eine Regel-Engine bewertet — kein Server oder Integration nötig."},
"case1.result":{tr:"Veri gizliliği korunarak (hiçbir şey tarayıcıdan çıkmaz) yüzlerce kaydın manuel incelemesi dakikalara indi.",en:"With privacy preserved (nothing leaves the browser), manual review of hundreds of records dropped to minutes.",de:"Unter Wahrung des Datenschutzes (nichts verlässt den Browser) sank die manuelle Prüfung hunderter Datensätze auf Minuten."},
"case2.tag":{tr:"Gerçek Zamanlı Platform",en:"Real-Time Platform",de:"Echtzeit-Plattform"},
"case2.goal":{tr:"Birden fazla kullanıcının aynı oturumda gecikmesiz, senkron etkileşebildiği gerçek zamanlı bir platform.",en:"A real-time platform where multiple users interact in sync within the same session, with no lag.",de:"Eine Echtzeit-Plattform, auf der mehrere Nutzer in derselben Session synchron und ohne Verzögerung interagieren."},
"case2.approach":{tr:"WebSocket üzerinde gerçek zamanlı sunucular; yapılandırılabilir oyun motorları (düz / cezalı / 101 okey, batak), bot rakipler ve canlı masa durumu.",en:"Real-time servers over WebSocket; configurable game engines (plain / penalty / 101 okey, batak), bot opponents and live table state.",de:"Echtzeit-Server über WebSocket; konfigurierbare Engines (normal / Straf / 101 Okey, Batak), Bot-Gegner und Live-Tischstatus."},
"case2.result":{tr:"Anlık senkron masa, kopmalara dayanıklı oturum yönetimi ve kolayca yeni mod eklenebilen esnek motor mimarisi.",en:"Instantly synced tables, disconnect-resilient session management and a flexible engine architecture that makes adding new modes easy.",de:"Sofort synchronisierte Tische, ausfallsichere Session-Verwaltung und eine flexible Engine-Architektur für einfache neue Modi."},
"surec.eyebrow":{tr:"Süreç",en:"Process",de:"Prozess"},
"surec.h2":{tr:"Fikirden teslime, net bir süreç",en:"A clear process, from idea to delivery",de:"Ein klarer Prozess, von der Idee bis zur Lieferung"},
"surec.sub":{tr:"Her projede şeffaf, adım adım ilerleriz — sürpriz yok.",en:"We move transparently, step by step — no surprises.",de:"Wir arbeiten transparent, Schritt für Schritt — keine Überraschungen."},
"step1.t":{tr:"Keşif",en:"Discovery",de:"Entdeckung"},
"step1.d":{tr:"İhtiyacını dinler, hedefi ve kapsamı birlikte netleştiririz.",en:"We listen to your needs and define the goal and scope together.",de:"Wir hören zu und definieren Ziel und Umfang gemeinsam."},
"step2.t":{tr:"Teklif &amp; Plan",en:"Quote &amp; Plan",de:"Angebot &amp; Plan"},
"step2.d":{tr:"Şeffaf fiyat ve net bir zaman çizelgesi çıkarırız.",en:"We set a transparent price and a clear timeline.",de:"Wir legen einen transparenten Preis und klaren Zeitplan fest."},
"step3.t":{tr:"Geliştirme",en:"Development",de:"Entwicklung"},
"step3.d":{tr:"Uçtan uca kodlar, düzenli güncellemeyle ilerlemeyi gösteririz.",en:"We code end to end and show progress with regular updates.",de:"Wir programmieren Ende-zu-Ende und zeigen Fortschritt mit regelmäßigen Updates."},
"step4.t":{tr:"Test &amp; Teslim",en:"Test &amp; Delivery",de:"Test &amp; Lieferung"},
"step4.d":{tr:"Test eder, canlıya alır, kısa bir kullanım anlatımı veririz.",en:"We test, go live and give a short walkthrough.",de:"Wir testen, gehen live und geben eine kurze Einweisung."},
"step5.t":{tr:"Destek",en:"Support",de:"Support"},
"step5.d":{tr:"Teslimden sonra da yanındayız; takıldığın yerde buradayız.",en:"We're with you after delivery; we're here when you get stuck.",de:"Wir sind auch nach der Lieferung für dich da."},
"hiz.eyebrow":{tr:"Hizmetler",en:"Services",de:"Leistungen"},
"hiz.h2":{tr:"Birlikte çalışalım",en:"Let's work together",de:"Lass uns zusammenarbeiten"},
"hiz.sub":{tr:"Bionluk üzerinden sipariş verebilir ya da doğrudan yazabilirsin.",en:"Order via Bionluk or just reach out directly.",de:"Bestelle über Bionluk oder melde dich direkt."},
"hiz1.title":{tr:"Excel &amp; Google Sheets Otomasyonu",en:"Excel &amp; Google Sheets Automation",de:"Excel- &amp; Google-Sheets-Automatisierung"},
"hiz1.desc":{tr:"Tekrarlayan işleri otomatikleştir: formül/makro/script ile otomatik hesaplama, raporlama, veri temizleme ve birleştirme.",en:"Automate repetitive work: formulas/macros/scripts for automatic calculation, reporting, data cleaning and merging.",de:"Automatisiere wiederkehrende Aufgaben: Formeln/Makros/Skripte für Berechnung, Reporting, Datenbereinigung und -zusammenführung."},
"hiz1.price":{tr:"Projeye özel fiyat",en:"Custom quote",de:"Individuelles Angebot"},
"hiz2.title":{tr:"Web Sitesi &amp; Web Uygulaması",en:"Website &amp; Web App",de:"Website &amp; Web-App"},
"hiz2.desc":{tr:"İhtiyacına özel kodlanmış, mobil uyumlu ve hızlı web siteleri ile web uygulamaları. Kurumsal site, landing, panel ve daha fazlası.",en:"Custom-coded, mobile-friendly and fast websites and web apps. Corporate sites, landing pages, panels and more.",de:"Individuell programmierte, mobilfreundliche und schnelle Websites und Web-Apps. Unternehmensseiten, Landingpages, Panels und mehr."},
"hiz2.price":{tr:"Projeye özel fiyat",en:"Custom quote",de:"Individuelles Angebot"},
"yet.eyebrow":{tr:"Yetenekler",en:"Skills",de:"Fähigkeiten"},
"yet.h2":{tr:"Kullandığımız teknolojiler",en:"Technologies we use",de:"Technologien, die wir nutzen"},
"yet.sub":{tr:"Uzmanlık alanlarımız ve araç setimiz.",en:"Our areas of expertise and toolset.",de:"Unsere Fachgebiete und unser Toolset."},
"skill.realtime":{tr:"Gerçek Zamanlı Sistemler",en:"Real-Time Systems",de:"Echtzeitsysteme"},
"skill.fullstack":{tr:"Full-Stack Geliştirme",en:"Full-Stack Development",de:"Full-Stack-Entwicklung"},
"skill.fraud":{tr:"Fraud &amp; Risk Analizi",en:"Fraud &amp; Risk Analysis",de:"Fraud- &amp; Risikoanalyse"},
"skill.automation":{tr:"Otomasyon",en:"Automation",de:"Automatisierung"},
"hak.eyebrow":{tr:"Hakkımızda",en:"About",de:"Über uns"},
"hak.h2":{tr:"Tek kişilik güç, stüdyo disiplini",en:"One-person power, studio discipline",de:"Ein-Personen-Kraft, Studio-Disziplin"},
"hak.p1":{tr:"Chermantia, <b>Muhammet Güneş</b> tarafından kurulan bağımsız bir yazılım stüdyosudur. 5+ yıldır full-stack web, gerçek zamanlı çok oyunculu sistemler ve otomasyon üzerine çalışıyorum — fikirden canlı ürüne, veritabanından arayüze uçtan uca.",en:"Chermantia is an independent software studio founded by <b>Muhammet Güneş</b>. For 5+ years I've worked on full-stack web, real-time multiplayer systems and automation — from idea to live product, from database to interface, end to end.",de:"Chermantia ist ein unabhängiges Software-Studio, gegründet von <b>Muhammet Güneş</b>. Seit über 5 Jahren arbeite ich an Full-Stack-Web, Echtzeit-Multiplayer-Systemen und Automatisierung — von der Idee zum Live-Produkt, Ende-zu-Ende."},
"hak.p2":{tr:"Büyük ekip yok; <b>doğrudan geliştiriciyle</b> çalışırsın. Bu da hızlı iletişim, şeffaf süreç ve işin sahibiyle birebir temas demek. Freelance ve uzaktan projelere açığım.",en:"No big team; you work <b>directly with the developer</b>. That means fast communication, a transparent process and direct contact with the person doing the work. I'm open to freelance and remote projects.",de:"Kein großes Team; du arbeitest <b>direkt mit dem Entwickler</b>. Das bedeutet schnelle Kommunikation, einen transparenten Prozess und direkten Kontakt. Ich bin offen für Freelance- und Remote-Projekte."},
"hak.v1":{tr:"Dürüst iletişim",en:"Honest communication",de:"Ehrliche Kommunikation"},
"hak.v2":{tr:"Şeffaf fiyat",en:"Transparent pricing",de:"Transparente Preise"},
"hak.v3":{tr:"Temiz kod",en:"Clean code",de:"Sauberer Code"},
"hak.v4":{tr:"Zamanında teslim",en:"On-time delivery",de:"Pünktliche Lieferung"},
"hak.card2":{tr:"Uçtan uca",en:"End to end",de:"Ende-zu-Ende"},
"hak.card2l":{tr:"tasarımdan sunucuya tek elden",en:"from design to server, single-handed",de:"vom Design bis zum Server, aus einer Hand"},
"hak.card3":{tr:"Uzaktan",en:"Remote",de:"Remote"},
"hak.card3l":{tr:"Türkiye &amp; global, async çalışma",en:"Turkey &amp; global, async work",de:"Türkei &amp; global, asynchrone Arbeit"},
"sss.eyebrow":{tr:"SSS",en:"FAQ",de:"FAQ"},
"sss.h2":{tr:"Sık sorulan sorular",en:"Frequently asked questions",de:"Häufig gestellte Fragen"},
"sss.sub":{tr:"Aklındaki ilk soruların yanıtı.",en:"Answers to your first questions.",de:"Antworten auf deine ersten Fragen."},
"q1":{tr:"Hangi tür projeler yapıyorsunuz?",en:"What kind of projects do you do?",de:"Welche Art von Projekten macht ihr?"},
"a1":{tr:"Web siteleri ve web uygulamaları, gerçek zamanlı sistemler (WebSocket), otomasyon ve veri/araç geliştirme. Kurumsal siteden özel panellere kadar geniş bir yelpaze.",en:"Websites and web apps, real-time systems (WebSocket), automation and data/tool development. From corporate sites to custom panels, a wide range.",de:"Websites und Web-Apps, Echtzeitsysteme (WebSocket), Automatisierung und Daten-/Tool-Entwicklung. Von Unternehmensseiten bis zu individuellen Panels, ein breites Spektrum."},
"q2":{tr:"Fiyatlandırma nasıl işliyor?",en:"How does pricing work?",de:"Wie funktioniert die Preisgestaltung?"},
"a2":{tr:"Her proje kapsamına göre fiyatlanır. Küçük işler birkaç yüz TL'den başlar; kapsamı netleştirip sabit, şeffaf bir teklif veririz — sürpriz maliyet yok.",en:"Each project is priced by scope. Small jobs start from a few hundred TL; we clarify the scope and give a fixed, transparent quote — no surprise costs.",de:"Jedes Projekt wird nach Umfang berechnet. Kleine Aufträge beginnen ab einigen hundert TL; wir klären den Umfang und geben ein festes, transparentes Angebot — keine versteckten Kosten."},
"q3":{tr:"Ne kadar sürede teslim edersiniz?",en:"How long does delivery take?",de:"Wie lange dauert die Lieferung?"},
"a3":{tr:"İşin boyutuna bağlı: bir landing birkaç gün, kapsamlı bir uygulama birkaç hafta. Başta net bir zaman çizelgesi paylaşırız.",en:"Depends on size: a landing page a few days, a full app a few weeks. We share a clear timeline upfront.",de:"Hängt von der Größe ab: eine Landingpage wenige Tage, eine komplette App einige Wochen. Wir teilen vorab einen klaren Zeitplan."},
"q4":{tr:"Uzaktan mı çalışıyorsunuz?",en:"Do you work remotely?",de:"Arbeitet ihr remote?"},
"a4":{tr:"Evet, tamamen uzaktan ve çoğunlukla yazılı/async iletişimle. Türkiye ve yurt dışı projelerine açığız.",en:"Yes, fully remote and mostly via written/async communication. Open to projects in Turkey and abroad.",de:"Ja, vollständig remote und meist über schriftliche/asynchrone Kommunikation. Offen für Projekte in der Türkei und im Ausland."},
"q5":{tr:"Teslimden sonra destek veriyor musunuz?",en:"Do you offer support after delivery?",de:"Bietet ihr Support nach der Lieferung?"},
"a5":{tr:"Evet. Teslim sonrası kısa kullanım anlatımı, küçük düzeltmeler ve takıldığın noktalarda destek dahildir.",en:"Yes. A short walkthrough, minor fixes and support where you get stuck are included after delivery.",de:"Ja. Eine kurze Einweisung, kleine Korrekturen und Support bei Problemen sind nach der Lieferung inbegriffen."},
"q6":{tr:"Hangi teknolojileri kullanıyorsunuz?",en:"Which technologies do you use?",de:"Welche Technologien nutzt ihr?"},
"a6":{tr:"Node.js, TypeScript, Bun, WebSocket, React, SQLite/SQL, REST API ve modern web araçları.",en:"Node.js, TypeScript, Bun, WebSocket, React, SQLite/SQL, REST API and modern web tools.",de:"Node.js, TypeScript, Bun, WebSocket, React, SQLite/SQL, REST-API und moderne Web-Tools."},
"blog.eyebrow":{tr:"Blog",en:"Blog",de:"Blog"},
"blog.h2":{tr:"Yazılar &amp; notlar",en:"Articles &amp; notes",de:"Artikel &amp; Notizen"},
"blog.sub":{tr:"Deneyimlerden kısa, faydalı yazılar — yakında.",en:"Short, useful posts from experience — coming soon.",de:"Kurze, nützliche Beiträge aus der Praxis — bald."},
"blog.soon":{tr:"Yakında",en:"Soon",de:"Bald"},
"blog1.cat":{tr:"Gerçek Zamanlı",en:"Real-Time",de:"Echtzeit"},
"blog1.title":{tr:"WebSocket ile çok oyunculu sistem kurmak",en:"Building a multiplayer system with WebSocket",de:"Ein Multiplayer-System mit WebSocket bauen"},
"blog1.desc":{tr:"Senkron masa, kopmalara dayanıklı oturum ve ölçeklenebilir motor mimarisi üzerine notlar.",en:"Notes on synced tables, disconnect-resilient sessions and scalable engine architecture.",de:"Notizen zu synchronisierten Tischen, ausfallsicheren Sessions und skalierbarer Engine-Architektur."},
"blog2.cat":{tr:"Performans",en:"Performance",de:"Performance"},
"blog2.title":{tr:"Web sitenizi hızlandırmanın 5 somut yolu",en:"5 concrete ways to speed up your website",de:"5 konkrete Wege, deine Website zu beschleunigen"},
"blog2.desc":{tr:"Görsel, önbellek, kod bölme ve Core Web Vitals'ı yeşile çekmenin pratik yolları.",en:"Practical ways to handle images, caching, code splitting and get Core Web Vitals green.",de:"Praktische Wege für Bilder, Caching, Code-Splitting und grüne Core Web Vitals."},
"blog3.cat":{tr:"SEO",en:"SEO",de:"SEO"},
"blog3.title":{tr:"Küçük işletmeler için SEO temeli",en:"SEO basics for small businesses",de:"SEO-Grundlagen für kleine Unternehmen"},
"blog3.desc":{tr:"Google'da bulunmanın ilk adımları: teknik temel, içerik ve Search Console.",en:"First steps to being found on Google: technical foundation, content and Search Console.",de:"Erste Schritte, um bei Google gefunden zu werden: technische Basis, Inhalte und Search Console."},
"ilet.eyebrow":{tr:"İletişim",en:"Contact",de:"Kontakt"},
"ilet.h2":{tr:"Bir sonraki projeni konuşalım",en:"Let's talk about your next project",de:"Lass uns über dein nächstes Projekt sprechen"},
"ilet.p":{tr:"Bir fikrin, projen veya ihtiyacın mı var? Kısaca anlat; sana en uygun çözümü birlikte planlayalım. Freelance ve uzaktan projelere açığız.",en:"Got an idea, a project or a need? Tell me briefly and we'll plan the best solution together. Open to freelance and remote projects.",de:"Hast du eine Idee, ein Projekt oder einen Bedarf? Erzähl es kurz und wir planen gemeinsam die beste Lösung. Offen für Freelance- und Remote-Projekte."},
"form.ph.ad":{tr:"Adın",en:"Your name",de:"Dein Name"},
"form.ph.mail":{tr:"E-postan",en:"Your email",de:"Deine E-Mail"},
"form.ph.msg":{tr:"Projen / ihtiyacın hakkında kısaca...",en:"Briefly about your project / need...",de:"Kurz zu deinem Projekt / Bedarf..."},
"form.err":{tr:"Lütfen ad, geçerli e-posta ve mesaj gir.",en:"Please enter a name, valid email and message.",de:"Bitte Name, gültige E-Mail und Nachricht eingeben."},
"form.btn":{tr:"Gönder",en:"Send",de:"Senden"},
"bag.email":{tr:"E-posta",en:"Email",de:"E-Mail"},
"footer.copy":{tr:"© 2026 Chermantia — Full-Stack Web, Gerçek Zamanlı Sistemler &amp; Otomasyon",en:"© 2026 Chermantia — Full-Stack Web, Real-Time Systems &amp; Automation",de:"© 2026 Chermantia — Full-Stack-Web, Echtzeitsysteme &amp; Automatisierung"},
"cmd.ph":{tr:"Sayfa ara ya da komut çalıştır…",en:"Search pages or run a command…",de:"Seiten suchen oder Befehl ausführen…"},
"cmd.empty":{tr:"Sonuç bulunamadı",en:"No results",de:"Keine Ergebnisse"},
"cmd.trig":{tr:"Ara",en:"Search",de:"Suchen"},
"cmd.copy":{tr:"E-postayı kopyala",en:"Copy email",de:"E-Mail kopieren"},
"cmd.copied":{tr:"E-posta kopyalandı",en:"Email copied",de:"E-Mail kopiert"},
"cmd.sendmail":{tr:"E-posta gönder",en:"Send email",de:"E-Mail senden"},
"cmd.github":{tr:"GitHub",en:"GitHub",de:"GitHub"},
"cmd.cat.pages":{tr:"Sayfalar",en:"Pages",de:"Seiten"},
"cmd.cat.sections":{tr:"Bölümler",en:"Sections",de:"Bereiche"},
"cmd.cat.actions":{tr:"Hızlı işlemler",en:"Quick actions",de:"Schnellaktionen"},
"cmd.cat.lang":{tr:"Dil",en:"Language",de:"Sprache"},
"cmd.lang.tr":{tr:"Türkçe",en:"Türkçe",de:"Türkçe"},
"cmd.lang.en":{tr:"English",en:"English",de:"English"},
"cmd.lang.de":{tr:"Deutsch",en:"Deutsch",de:"Deutsch"}
};
function apply(l){
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k=el.getAttribute('data-i18n'); if(T[k]&&T[k][l]!=null) el.innerHTML=T[k][l];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    var k=el.getAttribute('data-i18n-ph'); if(T[k]&&T[k][l]!=null){ el.setAttribute('placeholder',T[k][l]); el.setAttribute('aria-label',T[k][l]); }
  });
  document.documentElement.lang=l;
  document.querySelectorAll('.langsw button').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-lang')===l); });
  try{ localStorage.setItem('lang',l); }catch(e){}
  try{ document.dispatchEvent(new Event('chlang')); }catch(e){}
}
var saved='tr'; try{ saved=localStorage.getItem('lang')||'tr'; }catch(e){}
if(!/^(tr|en|de)$/.test(saved)) saved='tr';
document.querySelectorAll('.langsw button').forEach(function(b){
  b.addEventListener('click',function(){ apply(b.getAttribute('data-lang')); });
});
apply(saved);

/* ---------- komut paleti (⌘K / Ctrl+K) ---------- */
(function(){
  var EMAIL='chermantiastudio@gmail.com';
  var isMac=/mac|iphone|ipad|ipod/i.test((navigator.platform||'')+' '+(navigator.userAgent||''));
  function clang(){ var l=document.documentElement.lang; return /^(en|de)$/.test(l)?l:'tr'; }
  function tr(k){ return (T[k]&&T[k][clang()])||k; }
  function norm(s){ return String(s).replace(/İ/g,'i').replace(/I/g,'i').replace(/ı/g,'i').replace(/Ş/g,'s').replace(/ş/g,'s').replace(/Ğ/g,'g').replace(/ğ/g,'g').replace(/Ü/g,'u').replace(/ü/g,'u').replace(/Ö/g,'o').replace(/ö/g,'o').replace(/Ç/g,'c').replace(/ç/g,'c').toLowerCase(); }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  var G={
    home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    steps:'<path d="M5 20V10M12 20V4M19 20v-8"/>',
    gear:'<circle cx="12" cy="12" r="3.3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    share:'<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.1 10.9l7.8-3.7M8.1 13.1l7.8 3.7"/>',
    shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    user:'<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.3 9.2a2.8 2.8 0 015.4 1c0 1.9-2.7 2-2.7 3.8"/><circle cx="12" cy="17" r=".7" fill="currentColor" stroke="none"/>',
    calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2"/>',
    gh:'<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 00-6.2 0C6.7 2.3 5.6 2.6 5.6 2.6a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    tag:'<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"/>',
    copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h8"/>',
    send:'<path d="M22 3L11 14M22 3l-7 18-4-7-7-4z"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>'
  };
  var ITEMS=[
    {c:'cmd.cat.pages',k:'nav.anasayfa',kw:'ana sayfa home start startseite',h:'index.html',g:'home'},
    {c:'cmd.cat.pages',k:'nav.projeler',kw:'projeler projects projekte portfoy portfolio work isler vaka',h:'projeler.html',g:'grid'},
    {c:'cmd.cat.pages',k:'nav.surec',kw:'surec process prozess adim steps nasil calisma',h:'surec.html',g:'steps'},
    {c:'cmd.cat.pages',k:'nav.hizmetler',kw:'hizmetler services leistungen fiyat price teknoloji',h:'hizmetler.html',g:'gear'},
    {c:'cmd.cat.sections',k:'arch.eyebrow',kw:'mimari architecture architektur websocket nasil calisir',h:'index.html#mimari',g:'share'},
    {c:'cmd.cat.sections',k:'promise.eyebrow',kw:'calisma sozumuz promise versprechen garanti neden why warum',h:'index.html#soz',g:'shield'},
    {c:'cmd.cat.sections',k:'nav.hakkimizda',kw:'hakkimizda about uber uns kim muhammet gunes',h:'index.html#hakkimizda',g:'user'},
    {c:'cmd.cat.sections',k:'nav.sss',kw:'sss faq soru sorular questions fragen',h:'surec.html#sss',g:'help'},
    {c:'cmd.cat.sections',k:'est.eyebrow',kw:'proje hesaplayici estimator rechner tahmin fiyat sure',h:'hizmetler.html#hesaplayici',g:'calc'},
    {c:'cmd.cat.sections',k:'cmd.github',kw:'github acik kaynak open source repo kod',h:'projeler.html#github',g:'gh'},
    {c:'cmd.cat.actions',k:'nav.iletisim',kw:'iletisim contact kontakt yaz mesaj form',h:'index.html#iletisim',g:'mail'},
    {c:'cmd.cat.actions',k:'link.quote',kw:'teklif al quote angebot fiyat offer',h:'index.html#iletisim',g:'tag'},
    {c:'cmd.cat.actions',k:'cmd.copy',kw:'e-posta email mail kopyala copy kopieren adres',a:'copy',g:'copy'},
    {c:'cmd.cat.actions',k:'cmd.sendmail',kw:'e-posta gonder send mail mailto yaz',h:'mailto:'+EMAIL,g:'send'},
    {c:'cmd.cat.lang',k:'cmd.lang.tr',kw:'turkce turkish turkisch dil language sprache tr',a:'lang',arg:'tr',g:'globe'},
    {c:'cmd.cat.lang',k:'cmd.lang.en',kw:'english ingilizce englisch dil language sprache en',a:'lang',arg:'en',g:'globe'},
    {c:'cmd.cat.lang',k:'cmd.lang.de',kw:'deutsch german almanca dil language sprache de',a:'lang',arg:'de',g:'globe'}
  ];
  var SRCH='<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';

  var ov=document.createElement('div');
  ov.className='cmdk-ov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-label','Chermantia');
  ov.innerHTML='<div class="cmdk-modal"><div class="cmdk-head">'+SRCH+'<input class="cmdk-input" type="text" autocomplete="off" autocorrect="off" spellcheck="false"><span class="cmdk-esc">ESC</span></div><div class="cmdk-list" role="listbox"></div></div>';
  document.body.appendChild(ov);
  var modal=ov.querySelector('.cmdk-modal'), input=ov.querySelector('.cmdk-input'), list=ov.querySelector('.cmdk-list');
  var toast=document.createElement('div'); toast.className='cmdk-toast'; toast.setAttribute('role','status'); document.body.appendChild(toast);

  var nl=document.querySelector('.nav-links'), trig=null;
  if(nl){
    trig=document.createElement('button'); trig.type='button'; trig.className='cmdk-trig';
    trig.innerHTML=SRCH+'<span class="tl"></span><span class="kbd"></span>';
    var ls=nl.querySelector('.langsw'); if(ls) nl.insertBefore(trig,ls); else nl.appendChild(trig);
    trig.addEventListener('click',open);
  }
  var fab=document.createElement('button'); fab.type='button'; fab.className='cmdk-fab'; fab.setAttribute('aria-label','Ara'); fab.innerHTML=SRCH;
  document.body.appendChild(fab); fab.addEventListener('click',open);

  var open_=false, vis=[], sel=0, toastT=null;

  function relabel(){
    input.placeholder=tr('cmd.ph');
    if(trig){ var t=trig.querySelector('.tl'); if(t)t.textContent=tr('cmd.trig'); var kb=trig.querySelector('.kbd'); if(kb)kb.textContent=(isMac?'⌘K':'Ctrl K'); }
  }
  function render(){
    var q=norm(input.value.trim()), html='', curCat=null; vis=[];
    ITEMS.forEach(function(it){
      var label=tr(it.k);
      if(q){ if(norm(label+' '+it.kw).indexOf(q)<0) return; }
      if(it.c!==curCat){ curCat=it.c; html+='<div class="cmdk-cat">'+esc(tr(it.c))+'</div>'; }
      var idx=vis.length; vis.push(it);
      html+='<div class="cmdk-item" data-i="'+idx+'" role="option"><span class="ci"><svg viewBox="0 0 24 24">'+G[it.g]+'</svg></span><span class="cl"><b></b></span><span class="ck">↵</span></div>';
    });
    list.innerHTML = vis.length ? html : '<div class="cmdk-empty">'+esc(tr('cmd.empty'))+'</div>';
    list.querySelectorAll('.cmdk-item').forEach(function(n){ n.querySelector('b').textContent=tr(vis[+n.getAttribute('data-i')].k); });
    sel=0; paint();
  }
  function paint(){
    var ns=list.querySelectorAll('.cmdk-item');
    ns.forEach(function(n,i){ n.classList.toggle('sel',i===sel); n.setAttribute('aria-selected',i===sel?'true':'false'); });
    var a=ns[sel]; if(a&&a.scrollIntoView) a.scrollIntoView({block:'nearest'});
  }
  function open(){ if(open_)return; open_=true; ov.classList.add('on'); if(nl)nl.classList.remove('open'); input.value=''; render(); setTimeout(function(){ try{input.focus();}catch(e){} },30); }
  function close(){ if(!open_)return; open_=false; ov.classList.remove('on'); }
  function toggle(){ open_?close():open(); }

  ov.addEventListener('click',function(e){ if(e.target===ov) close(); });
  input.addEventListener('input',render);
  list.addEventListener('click',function(e){ var it=e.target.closest('.cmdk-item'); if(it){ sel=+it.getAttribute('data-i'); run(); } });
  list.addEventListener('mousemove',function(e){ var it=e.target.closest('.cmdk-item'); if(it){ var i=+it.getAttribute('data-i'); if(i!==sel){ sel=i; paint(); } } });

  function run(){
    var it=vis[sel]; if(!it)return;
    if(it.a==='lang'){ apply(it.arg); return; }
    if(it.a==='copy'){ copyMail(); return; }
    close(); go(it.h);
  }
  function go(href){
    var hi=href.indexOf('#');
    if(hi>-1 && href.slice(0,4)!=='mail'){
      var path=href.slice(0,hi), id=href.slice(hi+1);
      var here=location.pathname.split('/').pop()||'index.html';
      var same=(!path)||path===here||(path==='index.html'&&(here===''||here==='index.html'));
      if(same){ var el=document.getElementById(id); if(el){ el.scrollIntoView({behavior:'smooth',block:'start'}); try{history.replaceState(null,'','#'+id);}catch(e){} return; } }
    }
    window.location.href=href;
  }
  function showToast(msg){ toast.textContent=msg; toast.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(function(){ toast.classList.remove('on'); },1800); }
  function copyMail(){
    var done=function(){ showToast(tr('cmd.copied')); };
    var fb=function(){ try{ var t=document.createElement('textarea'); t.value=EMAIL; t.style.position='fixed'; t.style.opacity='0'; document.body.appendChild(t); t.focus(); t.select(); document.execCommand('copy'); document.body.removeChild(t); done(); }catch(e){ showToast(EMAIL); } };
    try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(EMAIL).then(done,fb); return; } }catch(e){}
    fb();
  }

  document.addEventListener('keydown',function(e){
    if((e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey)){ e.preventDefault(); toggle(); return; }
    if(!open_){
      if(e.key==='/'){ var t=e.target, tn=((t&&t.tagName)||'').toLowerCase(); if(tn==='input'||tn==='textarea'||tn==='select'||(t&&t.isContentEditable))return; e.preventDefault(); open(); }
      return;
    }
    if(e.key==='Escape'){ e.preventDefault(); close(); }
    else if(e.key==='ArrowDown'){ e.preventDefault(); if(vis.length){ sel=(sel+1)%vis.length; paint(); } }
    else if(e.key==='ArrowUp'){ e.preventDefault(); if(vis.length){ sel=(sel-1+vis.length)%vis.length; paint(); } }
    else if(e.key==='Enter'){ e.preventDefault(); run(); }
  });

  document.addEventListener('chlang',function(){ relabel(); if(open_)render(); });
  relabel();
})();

/* ---------- premium kart etkileşimi: imleç ışığı + 3D tilt ---------- */
(function(){
  try{
    if(!matchMedia('(pointer:fine)').matches) return;
    if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  }catch(e){ return; }
  var MAX=5;
  function bind(nodes){
    nodes.forEach(function(el){
      if(el.__fx) return; el.__fx=true; el.classList.add('fx');
      var raf=0, mx=50, my=50, rx=0, ry=0;
      function paint(){ raf=0; el.style.setProperty('--mx',mx+'%'); el.style.setProperty('--my',my+'%'); el.style.transform='perspective(820px) rotateX('+ry.toFixed(2)+'deg) rotateY('+rx.toFixed(2)+'deg) translateY(-3px)'; }
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect(); if(!r.width||!r.height) return;
        var px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        px=px<0?0:px>1?1:px; py=py<0?0:py>1?1:py;
        mx=px*100; my=py*100; rx=(px-0.5)*2*MAX; ry=-(py-0.5)*2*MAX;
        if(!raf) raf=requestAnimationFrame(paint);
      });
      el.addEventListener('pointerenter',function(){ el.classList.add('lit'); el.style.transition='transform .12s ease'; });
      el.addEventListener('pointerleave',function(){ el.classList.remove('lit'); el.style.transition='transform .34s ease'; el.style.transform=''; mx=my=50; rx=ry=0; setTimeout(function(){ el.style.transition=''; },360); });
    });
  }
  bind(document.querySelectorAll('.card, .titem, .step, .case'));
  var gh=document.getElementById('ghrepos');
  if(gh){ try{ new MutationObserver(function(){ bind(gh.querySelectorAll('.ghcard')); }).observe(gh,{childList:true}); }catch(e){} }
})();

/* ---------- hero kod penceresi: satır satır "yazılıyor" ---------- */
(function(){
  var pre=document.querySelector('.codewin pre'); if(!pre) return;
  var raw=pre.innerHTML.replace(/\n+$/,'');
  var lines=raw.split('\n');
  pre.innerHTML=lines.map(function(l){ return '<span class="codeline">'+(l.length?l:'&nbsp;')+'</span>'; }).join('');
  var ls=pre.querySelectorAll('.codeline');
  var reduce=false; try{ reduce=matchMedia('(prefers-reduced-motion:reduce)').matches; }catch(e){}
  if(reduce){ ls.forEach(function(s){ s.classList.add('shown'); }); return; }
  var caret=document.createElement('span'); caret.className='codecaret';
  var i=0;
  function step(){
    if(i>=ls.length){ (ls[ls.length-1]||pre).appendChild(caret); return; }
    ls[i].classList.add('shown'); i++;
    setTimeout(step,150);
  }
  setTimeout(step,420);
})();

})();
