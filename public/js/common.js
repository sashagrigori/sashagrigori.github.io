// shared: covers, the «напиши мне» cursor and contacts card, case-page helpers, typograph
window.num = i => String(i+1).padStart(2,"0");
window.cover = p => `<div class="ph"><img src="${p.cover}" alt="" draggable="false"><div class="xray" style="background-image:url(${p.ui})"></div></div>`;

document.body.insertAdjacentHTML("beforeend", `
<div class="cur" aria-hidden="true"><span class="in"><span class="lbl"><span class="star">✶</span>напиши мне</span></span></div>
<div class="sheet" id="sheet" role="dialog" aria-label="Контакты"><div class="in">
  <div class="sh-top"><span><span class="star">✶</span>давай поговорим</span><button type="button" id="sheetx" aria-label="закрыть">✕</button></div>
  <ul>
    <li><span class="k">Telegram</span><a href="https://t.me/sashagrigori" target="_blank" rel="noopener">@sashagrigori</a><a class="act" href="https://t.me/sashagrigori" target="_blank" rel="noopener" aria-label="открыть Telegram">↗</a></li>
    <li><span class="k">Почта</span><a href="mailto:grigoreva.asd@gmail.com">grigoreva.asd@gmail.com</a><button type="button" class="act" id="copymail" aria-label="скопировать почту" title="скопировать"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button></li>
    <li><span class="k">Behance</span><a href="https://www.behance.net/sashagrigori" target="_blank" rel="noopener">sashagrigori</a><a class="act" href="https://www.behance.net/sashagrigori" target="_blank" rel="noopener" aria-label="открыть Behance">↗</a></li>
    <li><span class="k">Резюме</span><a href="https://hh.ru/resume/c519872bff0cb36c330039ed1f4a6f3376576b" target="_blank" rel="noopener">hh.ru</a><a class="act" href="https://hh.ru/resume/c519872bff0cb36c330039ed1f4a6f3376576b" target="_blank" rel="noopener" aria-label="открыть резюме">↗</a></li>
  </ul>
</div></div>
<div class="toast mono" id="toast"></div>`);

window.toast = m => { const t=document.getElementById("toast"); t.textContent=m; t.style.opacity=1; clearTimeout(t._t); t._t=setTimeout(()=>t.style.opacity=0,1400); };
const sheet=document.getElementById("sheet");
// contacts: the «напиши мне» pill grows into a small card right where it was clicked
window.openContacts = (x, y) => {
  const W=Math.min(420, innerWidth-32);
  sheet.classList.remove("on"); sheet.style.setProperty("--w",W+"px");
  const H=sheet.querySelector(".in").scrollHeight; sheet.style.setProperty("--h",H+"px");
  const vw=document.documentElement.clientWidth, vh=(window.visualViewport ? visualViewport.height : innerHeight);
  const l=Math.max(16, Math.min(x-100, vw-16-W));
  sheet.style.left=l+"px";
  // in the upper half the card grows down from the pill, in the lower half — up, so it never leaves the screen
  if (y < vh/2) { sheet.style.bottom="auto"; sheet.style.top=Math.max(16, Math.min(y-19, vh-16-H))+"px"; }
  else { sheet.style.top="auto"; sheet.style.bottom=Math.max(16, Math.min(vh-y-19, vh-16-H))+"px"; }
  sheet.offsetWidth; sheet.classList.add("on");
};
document.getElementById("sheetx").onclick=e=>{ e.preventDefault(); sheet.classList.remove("on"); };
document.getElementById("copymail").onclick=e=>{ e.preventDefault(); navigator.clipboard && navigator.clipboard.writeText("grigoreva.asd@gmail.com"); toast("Почта скопирована"); };
// the contacts sheet also closes on a click anywhere outside it or on Esc; that click does nothing else
let sheetJustClosed=false;
addEventListener("pointerdown", e => { if (sheet.classList.contains("on") && !e.target.closest(".sheet")) { sheet.classList.remove("on"); sheetJustClosed=true; } }, true);
addEventListener("click", e => { if (sheetJustClosed) { sheetJustClosed=false; e.preventDefault(); e.stopPropagation(); } }, true);
addEventListener("keydown", e => { if (e.key==="Escape") sheet.classList.remove("on"); });

// case pages: the «напиши мне» pill follows the cursor only in the left column under the contents,
// so it never covers the case itself; a «напиши мне» block closes every case
const CASE = document.querySelector("aside.toc");
if (CASE) {
  const end = document.createElement("section"); end.className="g case-end";
  end.innerHTML = `<div class="side lab mut">Связаться</div><div class="main"><p>Нужен дизайнер, который доведёт продукт до&nbsp;запуска? Давай поговорим.</p><button class="write-btn" type="button"><span class="star">✶</span><span class="t">напиши мне</span></button></div>`;
  const next=document.querySelector("a.next"); (next ? next.before(end) : document.body.append(end));
  end.querySelector(".write-btn").onclick = e => { e.preventDefault(); const r=e.currentTarget.getBoundingClientRect(); openContacts(r.left+100, r.top+19); };

  // phone: the contents column is hidden, so a bar under the header shows the current chapter and opens the full list
  const chs = [...document.querySelectorAll("main section.ch[id][data-t]")];
  if (chs.length) {
    const nn = i => String(i+1).padStart(2,"0");
    const bar = document.createElement("nav"); bar.className = "chbar"; bar.setAttribute("aria-label","Главы");
    bar.innerHTML = `<button type="button" class="cb-cur" aria-expanded="false"><span class="cb-n"></span><span class="cb-t"></span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><i class="cb-prog"></i>`
      + `<ol class="cb-list">${chs.map((s,i)=>`<li><a href="#${s.id}"><span class="n">${nn(i)}</span>${s.dataset.t}</a></li>`).join("")}</ol>`;
    document.body.append(bar);
    const cur = bar.querySelector(".cb-cur"), links = [...bar.querySelectorAll(".cb-list a")], prog = bar.querySelector(".cb-prog"), main = document.querySelector("main");
    const top = document.querySelector(".top");
    const setOpen = v => { bar.classList.toggle("open", v); cur.setAttribute("aria-expanded", v); };
    cur.onclick = () => setOpen(!bar.classList.contains("open"));
    links.forEach(a => a.onclick = e => { e.preventDefault(); setOpen(false); document.getElementById(a.hash.slice(1)).scrollIntoView({ behavior:"smooth" }); });
    addEventListener("pointerdown", e => { if (bar.classList.contains("open") && !e.target.closest(".chbar")) setOpen(false); });
    let k = -1;
    const sync = () => {
      document.documentElement.style.setProperty("--toph", (top ? top.offsetHeight : 0) + "px");
      // a little below where a chapter stops after a jump from the list (scroll-margin in mobile.css)
      const line = bar.getBoundingClientRect().bottom + 60;
      // the bar shows up once the first chapter reaches it, and hides again above it
      bar.classList.toggle("on", chs[0].getBoundingClientRect().top < line + 40);
      let j = 0; chs.forEach((s,i) => { if (s.getBoundingClientRect().top < line) j = i; });
      if (j !== k) { k = j; bar.querySelector(".cb-n").textContent = nn(j); bar.querySelector(".cb-t").textContent = chs[j].dataset.t; links.forEach((a,i) => a.classList.toggle("on", i === j)); }
      const r = main.getBoundingClientRect(); prog.style.width = Math.min(100, Math.max(0, (line - r.top) / r.height * 100)) + "%";
    };
    addEventListener("scroll", sync, { passive:true }); addEventListener("resize", sync); sync();
  }
}

(() => {
  const root=document.documentElement, cur=document.querySelector(".cur");
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  let x=0,y=0,cx=0,cy=0,lens=null,moved=false;
  // lens only on covers marked as allowed (data-lens on an ancestor), everything else empty = «напиши мне»
  const zone = t => {
    if (sheet.classList.contains("on") || t.closest(".switch,.sheet")) return "native";
    const ph = t.closest(".ph"); if (ph) return ph.closest("[data-nolens]") ? "native" : "lens";
    if (t.closest("a,button,[data-native]")) return "native";
    // on a case page only the left column, at any height, counts as «empty space»
    if (CASE) return x <= CASE.getBoundingClientRect().right + 12 ? "write" : "native";
    return "write";
  };
  const set = z => { root.classList.toggle("c-write",z==="write"); root.classList.toggle("c-lens",z==="lens"); root.classList.toggle("c-on",z!=="native"); };
  // a cover without an .xray layer (photos on «Обо мне») gets the negative lens from CSS instead
  const xray = el => el && el.querySelector(".xray");
  const paint = () => { const xr=xray(lens); if(!xr) return; const r=lens.getBoundingClientRect(); xr.style.clipPath=`circle(75px at ${x-r.left}px ${y-r.top}px)`; };
  // the pill sits exactly under the pointer: no easing, so it never trails behind
  addEventListener("mousemove", e => { x=e.clientX; y=e.clientY; cur.style.transform=`translate3d(${x}px,${y}px,0)`; const z=zone(e.target); set(z);
    const ph = z==="lens" ? e.target.closest(".ph") : null;
    if (lens && lens!==ph && xray(lens)) xray(lens).style.clipPath="circle(0 at 50% 50%)"; lens=ph;
    root.classList.toggle("c-neg", !!ph && !xray(ph)); });
  root.addEventListener("mouseleave", () => set("native"));
  addEventListener("mousedown", e => { moved=false; root.classList.add("c-press"); });
  addEventListener("pointermove", () => { moved=true; });
  addEventListener("mouseup", () => root.classList.remove("c-press"));
  addEventListener("click", e => { if (zone(e.target)==="write" && !window.__dragged) { openContacts(e.clientX, e.clientY); set("native"); } });
  (function loop(){ paint(); requestAnimationFrame(loop); })();
})();

// looped clips (video[data-auto]) play only while on screen: nothing loads until you scroll to them
(() => {
  const vids = document.querySelectorAll("video[data-auto]");
  if (!vids.length) return;
  const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target;
    if (e.isIntersecting) { const p = v.play(); p && p.catch(() => {}); } else v.pause(); }), { rootMargin:"200px 0px" });
  vids.forEach(v => io.observe(v));
})();

// typograph: no hanging short words, no line starting with a dash, numbers stay with their word
(() => {
  const SHORT = "в|во|на|с|со|к|ко|у|о|об|обо|и|а|но|да|по|от|до|за|из|изо|не|ни|без|для|под|над|при|про|или|что|как|я|мы|ты|он|её|их";
  const reShort = new RegExp(`(^|[\\s\\u00A0«"(—–/])(${SHORT}) (?=\\S)`, "giu");
  const fix = s => s
    .replace(reShort, "$1$2 ").replace(reShort, "$1$2 ")
    .replace(/ (?=[—–])/g, " ")
    .replace(/(\d) (?=[А-Яа-яЁёA-Za-z%])/g, "$1 ");
  const walk = root => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    while (w.nextNode()) { const n = w.currentNode, v = fix(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  };
  const run = () => walk(document.body);
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", run) : run();
  addEventListener("load", run);
  // text swapped in later (e.g. the current work on the home page) gets the same treatment
  new MutationObserver(ms => ms.forEach(m => m.type === "characterData" ? walk(m.target.parentNode || document.body) : m.addedNodes.forEach(n => n.nodeType === 3 ? walk(n.parentNode) : n.nodeType === 1 && walk(n))))
    .observe(document.body, { childList: true, subtree: true, characterData: true });
})();
