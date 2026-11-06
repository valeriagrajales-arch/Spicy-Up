/* SPICY UP · contacto.js — el chile rojo con globo de diálogo (solo contacto.html).
   Es independiente: no necesita cambios en el CSS. Convive con main.js. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!$('.contacto')) return;

  const EMOJIS = ['🔥', '🌶️', '🍋', '💥', '🐻'];
  const pick = arr => arr[(Math.random() * arr.length) | 0];

  const css = `
    .sc-burst{position:fixed;pointer-events:none;z-index:10000;font-size:1.4rem;will-change:transform,opacity}
  
    .sc-mascota{position:fixed;right:18px;bottom:0;z-index:90;width:96px;cursor:pointer;
      transform:translateY(115%);transition:transform .6s cubic-bezier(.2,.9,.3,1.3)}
    .sc-mascota.visible{transform:translateY(52%)}
    .sc-mascota.visible:hover,.sc-mascota.visible.habla{transform:translateY(6%)}
    .sc-mascota img{display:block;width:100%;height:auto;filter:drop-shadow(0 6px 8px rgba(0,0,0,.6));user-select:none}
    .sc-mascota.salto img{animation:sc-salto .6s}
    @keyframes sc-salto{30%{transform:translateY(-30px) rotate(-10deg)}60%{transform:translateY(0) rotate(6deg)}}
    .sc-globo{position:absolute;right:0;bottom:calc(100% + 8px);width:max-content;max-width:220px;
      padding:10px 14px;border:2px solid #ffd200;border-radius:16px;background:#161616;color:#fff;
      box-shadow:4px 4px 0 #ffd200;font:700 .88rem/1.35 "Nunito",Arial,sans-serif;
      opacity:0;transform:scale(.8) translateY(8px);transform-origin:bottom right;pointer-events:none;
      transition:opacity .25s,transform .3s cubic-bezier(.2,.9,.3,1.4)}
    .sc-globo::after{content:"";position:absolute;right:30px;bottom:-9px;width:14px;height:14px;
      background:#161616;border-right:2px solid #ffd200;border-bottom:2px solid #ffd200;transform:rotate(45deg)}
    .sc-mascota.habla .sc-globo{opacity:1;transform:none}
    @media (max-width:760px){.sc-mascota{display:none}}
  
    @media (prefers-reduced-motion:reduce){.sc-mascota,.sc-globo{transition:none}}`;

  function injectStyles() {
    const st = document.createElement('style');
    st.id = 'spicyup-contacto-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

    function burst(x, y, emojis = EMOJIS, n = 12) {
      if (reduce) return;
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span');
        s.className = 'sc-burst';
        s.textContent = emojis[i % emojis.length];
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        document.body.appendChild(s);
        const a = Math.random() * Math.PI * 2;
        const d = 60 + Math.random() * 120;
        s.animate([
          { transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 40}px)) scale(${1 + Math.random()}) rotate(${Math.random() * 360}deg)`, opacity: 0 },
        ], { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.3,1)' })
          .onfinish = () => s.remove();
      }
    }
  
    function initMascota() {
      const form = $('.contacto-form form');
      const m = document.createElement('div');
      m.className = 'sc-mascota';
      m.innerHTML = '<div class="sc-globo" role="status" aria-live="polite"></div>' +
                    '<img src="img/chile-rojo-sin-fondo.png" alt="" draggable="false">';
      const globo = $('.sc-globo', m);
      const img = $('img', m);
      img.addEventListener('error', () => m.remove());
      document.body.appendChild(m);
  
      let hideT, idleT, nivel = 0;
      const say = (txt, ms = 4200) => {
        globo.textContent = txt;
        m.classList.add('habla');
        clearTimeout(hideT);
        hideT = setTimeout(() => m.classList.remove('habla'), ms);
      };
      const jump = () => { m.classList.remove('salto'); void m.offsetWidth; m.classList.add('salto'); };
      const idle = () => {
        clearTimeout(idleT);
        idleT = setTimeout(() => { say('¿Sigues ahí? Se me está apagando el fuego 🥶', 5000); jump(); }, 30000);
      };
  
      setTimeout(() => m.classList.add('visible'), 1200);
      setTimeout(() => say('¡Ey! ¿Vienes a prender tu antojo? 🔥', 4500), 2000);
      idle();
      ['keydown', 'mousemove', 'scroll', 'touchstart'].forEach(ev =>
        addEventListener(ev, idle, { passive: true }));
  
      const chistes = [
        '¡Cuidado que pico! 🌶️',
        'Soy el chile más relajado del barrio 😎',
        'Escríbeme y te cuento todo 💌',
        '¿Ya probaste las Aguadas? 🔥',
      ];
      m.addEventListener('click', e => {
        jump();
        say(pick(chistes));
        burst(e.clientX, e.clientY, ['🌶️', '🔥', '💥'], 8);
      });
  
      if (!form) return;
      const frases = {
        nombre:  '¿Cómo te llamas, crack? 😎',
        correo:  'Tu correo, para que la respuesta llegue calientita 📬',
        mensaje: 'Cuéntame: ¿qué sabor te llamó la atención? 🍬',
      };
      form.addEventListener('focusin', e => { if (frases[e.target.id]) say(frases[e.target.id]); });
  
      $('#nombre').addEventListener('blur', e => {
        const n = e.target.value.trim();
        if (n.length >= 2) say(`¡Mucho gusto, ${n.split(/\s+/)[0]}! 🌶️`);
      });
      $('#correo').addEventListener('blur', e => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.target.value.trim())) say('¡Anotado! Te respondemos rapidito 📬');
      });
      $('#mensaje').addEventListener('input', e => {
        const l = e.target.value.length;
        if (l >= 114 && nivel < 2) { nivel = 2; say('¡¡BOOM!! Qué mensaje tan picante 🥵🔥'); jump(); }
        else if (l >= 54 && nivel < 1) { nivel = 1; say('¡Uy, esto ya está picando! 🌶️'); }
      });
      form.addEventListener('reset', () => {
        nivel = 0;
        say('¡BOOM! Tu mensaje ya va en llamas 🔥', 5500);
        jump();
        const r = m.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + 20, EMOJIS, 18);
      });
    }
  
  function init() {
    injectStyles();
    initMascota();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
