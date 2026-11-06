/* ==========================================================
   SPICY UP · main.js
   Un solo archivo, sin librerías. Funciona en index.html y
   contacto.html (cada efecto se activa solo si existe su HTML).
   Úsalo con:  <script src="js/main.js" defer></script>
   ========================================================== */
   (() => {
    'use strict';
  
    /* ---------- CONFIGURACIÓN (edita aquí) ---------- */
    const CONFIG = {
      cursorBrasas: true,      // chispas de fuego que siguen el mouse
      heroFlotantes: false,    // emojis flotantes sobre el banner (apagado: el banner ya trae sus dibujos)
      sabores: {               // nivel de picante (1-5) y color de cada sabor
        'Fuego':       { picante: 5, color: '#e8352b' },
        'Chile Limón': { picante: 3, color: '#8dc63f' },
        'Mix Boom':    { picante: 4, color: '#f7941d' },
        'Emprendedor': { picante: 4, color: '#ffd200' },
      },
    };
  
    /* ---------- Utilidades ---------- */
    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer  = matchMedia('(pointer: fine)').matches;
    const EMOJIS = ['🔥', '🌶️', '🍋', '💥', '🐻'];
  
    /* ---------- Estilos inyectados ---------- */
    const css = `
    html{scroll-behavior:smooth}
    nav a{transition:color .2s}
    nav a:hover,nav a.su-active{color:#FECD09}
    nav a.su-active{text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px}
  
    .su-embers{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999}
    .su-burst{position:fixed;pointer-events:none;z-index:10000;font-size:1.4rem;will-change:transform,opacity}
  
    .su-toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,40px);opacity:0;pointer-events:none;
      background:#161616;color:#fff;border:1px solid #ffd200;border-radius:30px;padding:12px 22px;max-width:90vw;
      text-align:center;font:700 .95rem "Nunito",Arial,sans-serif;box-shadow:0 0 24px rgba(255,210,0,.35);
      z-index:10001;transition:opacity .3s,transform .35s cubic-bezier(.2,.9,.3,1.3)}
    .su-toast.show{opacity:1;transform:translate(-50%,0)}
  
    .su-fuse{position:fixed;top:0;left:0;width:100%;height:4px;z-index:9998;pointer-events:none}
    .su-fuse i{display:block;position:relative;height:100%;width:var(--p,0%);
      background:linear-gradient(90deg,#e8352b,#f7941d,#ffd200);border-radius:0 4px 4px 0}
    .su-fuse.on i::after{content:"";position:absolute;right:-5px;top:50%;width:10px;height:10px;border-radius:50%;
      background:#fff;transform:translateY(-50%);box-shadow:0 0 10px 4px #ffd200,0 0 22px 9px #f7941d;
      animation:su-flicker .15s infinite alternate}
    @keyframes su-flicker{to{transform:translateY(-50%) scale(1.5);opacity:.8}}
  
    .su-reveal{opacity:0;transform:translateY(34px) scale(.96);
      transition:opacity .6s ease,transform .6s cubic-bezier(.2,.9,.3,1.2)}
    .su-reveal.su-visible{opacity:1;transform:perspective(800px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))}
    .su-reveal.su-visible.tilting{transition:transform .12s ease-out}
    .producto button{cursor:pointer;transition:transform .15s}
    .producto button:active{transform:scale(.9)}
  
    .su-badge{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;margin-left:6px;
      border-radius:10px;background:#e8352b;color:#fff;font:700 .75rem Arial,sans-serif;vertical-align:middle}
    .su-badge[hidden]{display:none}
    .su-badge.bump{animation:su-bump .4s}
    @keyframes su-bump{40%{transform:scale(1.6) rotate(-10deg)}}
  
    .su-hero{position:relative;overflow:hidden}
    .su-floaters{position:absolute;inset:0;pointer-events:none}
    .su-floaters span{position:absolute;pointer-events:auto;cursor:pointer;user-select:none;opacity:.85;
      animation:su-float 6s ease-in-out infinite alternate;
      transition:translate .25s ease-out,opacity .3s,scale .3s}
    .su-floaters span.pop{opacity:0;scale:0}
    @keyframes su-float{from{transform:translateY(-14px) rotate(-8deg)}to{transform:translateY(14px) rotate(8deg)}}
  
    .su-sabores-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:20px;margin-top:24px}
    .su-sabor{--c:#f7941d;flex:1 1 240px;max-width:320px;padding:24px;text-align:center;cursor:pointer;color:#fff;
      background:linear-gradient(160deg,#161616,#0a0a0a);border:1px solid var(--c);border-radius:16px;
      transition:box-shadow .3s,opacity .6s ease,transform .6s cubic-bezier(.2,.9,.3,1.2)}
    .su-sabor:hover{box-shadow:0 0 26px -4px var(--c)}
    .su-sabor.su-visible:hover{transform:translateY(-6px) scale(1.03)}
    .su-sabor h3{font-family:"Lilita One",sans-serif;font-weight:400;margin-bottom:6px;color:var(--c)}
    .su-sabor p{color:#b3b3b3}
    .su-heat{display:flex;justify-content:center;gap:4px;margin-top:14px;font-size:1.2rem}
    .su-heat span{opacity:.2;filter:grayscale(1)}
    .su-visible .su-heat span.on{opacity:1;filter:none;animation:su-pop .5s both;animation-delay:calc(var(--i) * .12s + .3s)}
    @keyframes su-pop{0%{transform:scale(0)}70%{transform:scale(1.4)}100%{transform:scale(1)}}
  
    .decoracion{animation:su-float 4s ease-in-out infinite alternate}
    .su-error{color:#ff6b5e;font-size:.75rem;margin-top:6px}
    .contacto-form input.su-invalid,.contacto-form textarea.su-invalid{border-color:#e8352b}
    .su-meter{margin-top:10px;font-size:.72rem;color:#b3b3b3}
    .su-meter b{color:#ffd200}
    .su-meter-bar{height:8px;margin-bottom:6px;background:#1f1f1f;border:1px solid #333;border-radius:6px;overflow:hidden}
    .su-meter-bar i{display:block;width:100%;height:100%;
      background:linear-gradient(90deg,#8dc63f,#ffd200,#f7941d,#e8352b);
      clip-path:inset(0 calc(100% - var(--h,0%)) 0 0);transition:clip-path .3s}
    .su-meter.boom .su-meter-bar{animation:su-shake .3s infinite}
    .su-shake{animation:su-shake .4s 2}
    @keyframes su-shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
    .su-pulse{animation:su-pulse .9s}
    @keyframes su-pulse{50%{box-shadow:0 0 50px rgba(255,210,0,.6)}}
  
    @media (prefers-reduced-motion:reduce){
      html{scroll-behavior:auto}
      .su-floaters span,.decoracion,.su-fuse i::after,.su-meter.boom .su-meter-bar{animation:none}
    }`;
  
    function injectStyles() {
      const st = document.createElement('style');
      st.id = 'spicyup-js-styles';
      st.textContent = css;
      document.head.appendChild(st);
    }
  
    /* ---------- Efectos de emojis ---------- */
    function burst(x, y, emojis = EMOJIS, n = 14) {
      if (reduceMotion) return;
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span');
        s.className = 'su-burst';
        s.textContent = emojis[i % emojis.length];
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        document.body.appendChild(s);
        const a = Math.random() * Math.PI * 2;
        const d = 60 + Math.random() * 120;
        const dx = Math.cos(a) * d;
        const dy = Math.sin(a) * d - 40;
        s.animate([
          { transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${1 + Math.random()}) rotate(${Math.random() * 360}deg)`, opacity: 0 },
        ], { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.3,1)' })
          .onfinish = () => s.remove();
      }
    }
  
    function fireRain(n = 36) {
      if (reduceMotion) return;
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span');
        s.className = 'su-burst';
        s.textContent = EMOJIS[i % EMOJIS.length];
        s.style.left = Math.random() * 100 + 'vw';
        s.style.top = '-40px';
        s.style.fontSize = 1.2 + Math.random() * 1.4 + 'rem';
        document.body.appendChild(s);
        s.animate([
          { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          { transform: `translateY(${innerHeight + 80}px) rotate(${(Math.random() - .5) * 720}deg)`, opacity: .9 },
        ], { duration: 2000 + Math.random() * 2200, delay: Math.random() * 1200, easing: 'ease-in', fill: 'backwards' })
          .onfinish = () => s.remove();
      }
    }
  
    let toastEl, toastTimer;
    function toast(msg) {
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'su-toast';
        toastEl.setAttribute('role', 'status');
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
    }
  
    /* ---------- 1. Brasas que siguen el cursor ---------- */
    function initEmbers() {
      if (!CONFIG.cursorBrasas || reduceMotion || !finePointer) return;
      const canvas = document.createElement('canvas');
      canvas.className = 'su-embers';
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      const colors = ['#e8352b', '#f7941d', '#ffd200', '#ff6a00'];
      const ps = [];
      let W, H, running = false;
  
      const resize = () => {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        W = innerWidth; H = innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      addEventListener('resize', resize);
  
      const spawn = (x, y) => {
        for (let i = 0; i < 2; i++) {
          ps.push({
            x, y,
            vx: (Math.random() - .5) * 1.2,
            vy: -(Math.random() * 1.5 + .5),
            life: 1,
            decay: .015 + Math.random() * .02,
            r: Math.random() * 3 + 1.5,
            c: colors[(Math.random() * colors.length) | 0],
          });
        }
        if (ps.length > 150) ps.splice(0, ps.length - 150);
      };
  
      const frame = () => {
        ctx.clearRect(0, 0, W, H);
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i];
          p.x += p.vx + Math.sin(p.y * .05) * .3;
          p.y += p.vy;
          p.vy -= .01;
          p.life -= p.decay;
          if (p.life <= 0) { ps.splice(i, 1); continue; }
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
        if (ps.length) requestAnimationFrame(frame);
        else { running = false; ctx.clearRect(0, 0, W, H); }
      };
  
      addEventListener('mousemove', e => {
        spawn(e.clientX, e.clientY);
        if (!running) { running = true; requestAnimationFrame(frame); }
      }, { passive: true });
    }
  
    /* ---------- 2. Mecha encendida (progreso de scroll) ---------- */
    function initFuse() {
      const bar = document.createElement('div');
      bar.className = 'su-fuse';
      bar.innerHTML = '<i></i>';
      document.body.appendChild(bar);
      let ticking = false;
      const update = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        const p = max > 0 ? scrollY / max : 0;
        bar.style.setProperty('--p', p * 100 + '%');
        bar.classList.toggle('on', scrollY > 4);
        ticking = false;
      };
      addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      update();
    }
  
    /* ---------- 3. Navegación activa según la sección ---------- */
    function initNav() {
      const links = $$('nav a[href^="#"]');
      if (!links.length || !('IntersectionObserver' in window)) return;
      const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          links.forEach(l => l.classList.remove('su-active'));
          const link = map.get(e.target.id);
          if (link) link.classList.add('su-active');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }
  
    /* ---------- 4. Hero con emojis flotantes ---------- */
    function initHero() {
      const hero = $('.hero');
      if (!hero || !CONFIG.heroFlotantes || reduceMotion) return;
      hero.classList.add('su-hero');
      const layer = document.createElement('div');
      layer.className = 'su-floaters';
      const items = ['🌶️', '🍋', '🔥', '🐻', '💥', '🌶️', '🍋', '🔥'];
      const spans = items.map(emoji => {
        const s = document.createElement('span');
        s.textContent = emoji;
        s.style.left = 8 + Math.random() * 84 + '%';
        s.style.top = 10 + Math.random() * 75 + '%';
        s.style.fontSize = 1.6 + Math.random() * 2 + 'rem';
        s.style.animationDuration = 5 + Math.random() * 4 + 's';
        s.style.animationDelay = -Math.random() * 6 + 's';
        s.dataset.depth = (0.2 + Math.random() * 0.8).toFixed(2);
        s.addEventListener('click', e => {
          burst(e.clientX, e.clientY, [emoji, '💥'], 8);
          s.classList.add('pop');
          setTimeout(() => s.classList.remove('pop'), 3000);
        });
        layer.appendChild(s);
        return s;
      });
      hero.appendChild(layer);
  
      if (!finePointer) return;
      hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        spans.forEach(s => {
          const d = +s.dataset.depth;
          s.style.translate = `${-x * 60 * d}px ${-y * 60 * d}px`;
        });
      });
    }
  
    /* ---------- 5. Sabores: tarjetas con medidor de picante ---------- */
    function initSabores() {
      const wrap = $('.sabores > div');
      if (!wrap) return;
      const kids = [...wrap.children];
      const cards = [];
      for (let i = 0; i < kids.length; i += 2) {
        const h = kids[i], p = kids[i + 1];
        if (!h || h.tagName !== 'H3') continue;
        const key = Object.keys(CONFIG.sabores).find(k => h.textContent.includes(k));
        const cfg = CONFIG.sabores[key] || { picante: 3, color: '#f7941d' };
        const card = document.createElement('div');
        card.className = 'su-sabor';
        card.style.setProperty('--c', cfg.color);
        card.tabIndex = 0;
        card.append(h);
        if (p) card.append(p);
  
        const heat = document.createElement('div');
        heat.className = 'su-heat';
        heat.setAttribute('aria-label', `Nivel de picante: ${cfg.picante} de 5`);
        for (let n = 1; n <= 5; n++) {
          const c = document.createElement('span');
          c.textContent = '🌶️';
          c.style.setProperty('--i', n);
          if (n <= cfg.picante) c.classList.add('on');
          heat.appendChild(c);
        }
        card.append(heat);
  
        const icon = Array.from(h.textContent.trim())[0] || '🔥';
        const explode = e => {
          const r = card.getBoundingClientRect();
          const x = e.clientX || r.left + r.width / 2;
          const y = e.clientY || r.top + r.height / 2;
          burst(x, y, [icon, '🌶️', '💥'], 12);
        };
        card.addEventListener('click', explode);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); explode(e); } });
        cards.push(card);
      }
      wrap.classList.add('su-sabores-grid');
      cards.forEach(c => wrap.appendChild(c));
    }
  
    /* ---------- 6. Aparecer al hacer scroll + tilt 3D ---------- */
    function initReveal() {
      if (reduceMotion || !('IntersectionObserver' in window)) return;
      const targets = $$('.productos h2, .producto, .sabores h2, .su-sabor, .nosotros h2, .nosotros p, .contacto-intro, .contacto-card, .contacto-footer-msg');
      targets.forEach(el => el.classList.add('su-reveal'));
      const io = new IntersectionObserver(entries => {
        entries.filter(e => e.isIntersecting).forEach((e, i) => {
          io.unobserve(e.target);
          setTimeout(() => e.target.classList.add('su-visible'), i * 120);
        });
      }, { threshold: 0.15 });
      targets.forEach(el => io.observe(el));
    }
  
    function initTilt() {
      if (!finePointer || reduceMotion) return;
      $$('.producto').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5;
          const y = (e.clientY - r.top) / r.height - .5;
          card.style.setProperty('--rx', -y * 12 + 'deg');
          card.style.setProperty('--ry', x * 12 + 'deg');
          card.classList.add('tilting');
        });
        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
          card.classList.remove('tilting');
        });
      });
    }
  
    /* ---------- 7. Carrito con explosión ---------- */
    function initCart() {
      const buttons = $$('.producto button');
      const tienda = $('.btn-tienda');
      if (!buttons.length || !tienda) return;

      // PRECIOS EN COP. Si cambian, edita los valores de PRECIOS y el precio mostrado en index.html.
      // El teléfono debe ir con indicativo de país, solo números (Colombia: 57 + número).
      const WHATSAPP_NUMBER = '573105987479'; // WhatsApp de Spicy Up (+57 310 5987479)
      const PRECIOS = {
        'Ahogadas': 5500,
        'Clásicas': 4500,
        'Empanizadas': 5500,
        'Combo Emprendedor': 44000
      };
      const moneda = valor => new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
      }).format(valor);

      let carrito = [];
      try {
        const guardado = JSON.parse(sessionStorage.getItem('su-carrito') || '[]');
        if (Array.isArray(guardado)) {
          carrito = guardado.filter(p => p && typeof p.nombre === 'string' &&
            Number.isInteger(p.cantidad) && p.cantidad > 0).map(p => ({
              ...p,
              precio: PRECIOS[p.nombre] ?? 0
            }));
        }
      } catch (_) { carrito = []; }

      const overlay = document.createElement('div');
      overlay.className = 'carrito-overlay';
      overlay.setAttribute('aria-hidden', 'true');

      const panel = document.createElement('aside');
      panel.className = 'carrito-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-label', 'Carrito de compras Spicy Up');
      panel.setAttribute('aria-hidden', 'true');
      panel.innerHTML = `
        <div class="carrito-header">
          <div><span class="carrito-eyebrow">SPICY UP · TU PEDIDO</span><h2>🔥 MI CARRITO</h2></div>
          <button class="carrito-cerrar" type="button" aria-label="Cerrar carrito">×</button>
        </div>
        <div class="carrito-contenido" aria-live="polite"></div>
        <div class="carrito-footer">
          <div class="carrito-resumen"><span>Productos diferentes</span><strong class="carrito-tipos">0</strong></div>
          <div class="carrito-resumen"><span>Total de unidades</span><strong class="carrito-unidades">0</strong></div>
          <div class="carrito-resumen carrito-total"><span>TOTAL A PAGAR</span><strong class="carrito-total-valor">$0</strong></div>
          <p class="carrito-nota">Precios en pesos colombianos (COP). Confirma disponibilidad y entrega por WhatsApp.</p>
          <button class="carrito-btn carrito-pedir" type="button">PREPARAR MI PEDIDO 🌶️</button>
          <button class="carrito-vaciar" type="button">Vaciar carrito</button>
        </div>`;
      document.body.append(overlay, panel);

      const contenido = $('.carrito-contenido', panel);
      const cerrar = $('.carrito-cerrar', panel);
      const vaciar = $('.carrito-vaciar', panel);
      const pedir = $('.carrito-pedir', panel);
      const badge = document.createElement('b');
      badge.className = 'su-badge';
      badge.hidden = true;
      badge.setAttribute('aria-label', 'Cantidad de unidades en el carrito');
      tienda.appendChild(badge);

      const totalUnidades = () => carrito.reduce((suma, p) => suma + p.cantidad, 0);
      const totalPagar = () => carrito.reduce((suma, p) => suma + (p.precio * p.cantidad), 0);

      function guardar() {
        try {
          sessionStorage.setItem('su-carrito', JSON.stringify(carrito));
          sessionStorage.setItem('su-count', String(totalUnidades()));
        } catch (_) { /* El carrito funciona mientras la página esté abierta. */ }
      }
      function abrirCarrito() {
        panel.classList.add('activo'); overlay.classList.add('activo');
        panel.setAttribute('aria-hidden', 'false'); overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('carrito-bloqueado'); cerrar.focus();
      }
      function cerrarCarrito() {
        panel.classList.remove('activo'); overlay.classList.remove('activo');
        panel.setAttribute('aria-hidden', 'true'); overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('carrito-bloqueado'); tienda.focus();
      }
      function renderizar() {
        const unidades = totalUnidades();
        badge.textContent = unidades; badge.hidden = unidades === 0;
        $('.carrito-tipos', panel).textContent = carrito.length;
        $('.carrito-unidades', panel).textContent = unidades;
        $('.carrito-total-valor', panel).textContent = moneda(totalPagar());
        pedir.disabled = carrito.length === 0; vaciar.disabled = carrito.length === 0;

        if (!carrito.length) {
          contenido.innerHTML = `<div class="carrito-vacio"><div class="carrito-vacio-icono" aria-hidden="true">🛍️</div><h3>¡Todavía no hay fuego!</h3><p>Tu carrito está vacío. Agrega tus gomitas favoritas para armar tu pedido.</p><button class="carrito-seguir" type="button">EXPLORAR PRODUCTOS</button></div>`;
          return;
        }
        contenido.replaceChildren();
        carrito.forEach((producto, indice) => {
          const articulo = document.createElement('article'); articulo.className = 'carrito-item';
          if (producto.imagen) {
            const imagen = document.createElement('img'); imagen.src = producto.imagen;
            imagen.alt = producto.nombre; imagen.loading = 'lazy';
            imagen.onerror = () => { imagen.hidden = true; }; articulo.appendChild(imagen);
          }
          const info = document.createElement('div'); info.className = 'carrito-item-info';
          const titulo = document.createElement('h3'); titulo.textContent = producto.nombre;
          const descripcion = document.createElement('p'); descripcion.textContent = producto.descripcion || 'Producto Spicy Up';
          const precio = document.createElement('span'); precio.className = 'carrito-item-precio';
          precio.textContent = `${moneda(producto.precio)} c/u · Subtotal: ${moneda(producto.precio * producto.cantidad)}`;
          const controles = document.createElement('div'); controles.className = 'carrito-item-controles';
          const cantidad = document.createElement('div'); cantidad.className = 'carrito-cantidad';
          const menos = document.createElement('button'); menos.type = 'button'; menos.textContent = '−';
          menos.setAttribute('aria-label', `Disminuir cantidad de ${producto.nombre}`); menos.dataset.accion = 'menos'; menos.dataset.indice = indice;
          const numero = document.createElement('span'); numero.textContent = producto.cantidad;
          const mas = document.createElement('button'); mas.type = 'button'; mas.textContent = '+';
          mas.setAttribute('aria-label', `Aumentar cantidad de ${producto.nombre}`); mas.dataset.accion = 'mas'; mas.dataset.indice = indice;
          const eliminar = document.createElement('button'); eliminar.type = 'button'; eliminar.className = 'carrito-eliminar';
          eliminar.textContent = 'Eliminar'; eliminar.dataset.accion = 'eliminar'; eliminar.dataset.indice = indice;
          cantidad.append(menos, numero, mas); controles.append(cantidad, eliminar);
          info.append(titulo, descripcion, precio, controles); articulo.appendChild(info); contenido.appendChild(articulo);
        });
      }

      tienda.addEventListener('click', event => { event.preventDefault(); abrirCarrito(); });
      cerrar.addEventListener('click', cerrarCarrito);
      overlay.addEventListener('click', cerrarCarrito);
      panel.addEventListener('click', event => {
        if (event.target.closest('.carrito-seguir')) {
          cerrarCarrito(); $('#productos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && panel.classList.contains('activo')) cerrarCarrito();
      });

      buttons.forEach(boton => boton.addEventListener('click', () => {
        const tarjeta = boton.closest('.producto'); if (!tarjeta) return;
        const nombre = $('h3', tarjeta)?.textContent.trim() || 'Gomitas Spicy Up';
        const descripcion = $('p', tarjeta)?.textContent.trim() || 'Producto Spicy Up';
        const imagen = $('img', tarjeta)?.getAttribute('src') || '';
        const precio = PRECIOS[nombre] ?? 0;
        const existente = carrito.find(p => p.nombre === nombre);
        if (existente) existente.cantidad++;
        else carrito.push({ nombre, descripcion, imagen, precio, cantidad: 1 });
        guardar(); renderizar();
        const r = boton.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2);
        toast(`${nombre} agregado al carrito 🌶️`); abrirCarrito();
      }));

      contenido.addEventListener('click', event => {
        const boton = event.target.closest('button[data-accion]'); if (!boton) return;
        const producto = carrito[Number(boton.dataset.indice)]; if (!producto) return;
        if (boton.dataset.accion === 'mas') producto.cantidad++;
        if (boton.dataset.accion === 'menos') {
          producto.cantidad--;
          if (producto.cantidad <= 0) carrito.splice(Number(boton.dataset.indice), 1);
        }
        if (boton.dataset.accion === 'eliminar') carrito.splice(Number(boton.dataset.indice), 1);
        guardar(); renderizar();
      });
      vaciar.addEventListener('click', () => {
        if (!carrito.length) return;
        carrito = []; guardar(); renderizar(); toast('Carrito vacío. ¡Volvamos a empezar! 🔥');
      });

      pedir.addEventListener('click', () => {
        if (!carrito.length) return;
        if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER) || WHATSAPP_NUMBER.includes('X') ) {
          toast('Configura el número real de WhatsApp en main.js para activar los pedidos.');
          return;
        }
        const lineas = carrito.map(p => `• ${p.nombre} x ${p.cantidad} — ${moneda(p.precio)} c/u = ${moneda(p.precio * p.cantidad)}`);
        const mensaje = [
          '¡Hola, Spicy Up! 🌶️ Quiero realizar este pedido:', '', ...lineas, '',
          `TOTAL A PAGAR: ${moneda(totalPagar())}`, '',
          'Por favor, confirmen disponibilidad y opciones de entrega. ¡Gracias!'
        ].join('\n');
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });

      renderizar();
    }

        /* ---------- 7b. Botón amarillo "COMPRAR AHORA" del banner ---------- */
    function initHeroCta() {
      const cta = $('.hero-cta');
      const productos = $('#productos');
      if (!cta || !productos) return;
      cta.addEventListener('click', e => {
        e.preventDefault();
        const r = cta.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, ['🔥', '🌶️', '💥'], 12);
        productos.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        $$('.producto', productos).forEach((card, i) => {
          setTimeout(() => {
            card.classList.remove('su-pulse'); void card.offsetWidth; card.classList.add('su-pulse');
          }, 500 + i * 120);
        });
      });
    }
  
    /* ---------- 7c. Si falta la foto de un producto, se oculta ---------- */
    function initImgFallback() {
      $$('.producto img').forEach(img => {
        const falla = () => { img.hidden = true; };
        if (img.complete && img.naturalWidth === 0) falla();
        else img.addEventListener('error', falla, { once: true });
      });
    }
  
    /* ---------- 7d. Nosotros: el fuego se enciende al llegar ---------- */
    function initFuego() {
      const sec = $('.nosotros');
      if (!sec || !$('.fuego', sec)) return;
      if (!('IntersectionObserver' in window)) { sec.classList.add('encendido'); return; }
      const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        setTimeout(() => sec.classList.add('encendido'), 250);
      }, { threshold: 0.25 });
      io.observe(sec);
    }
  
    /* ---------- 8. Contacto: termómetro de picante + validación ---------- */
    // Reemplaza esta función por tu envío real (fetch a tu backend, Formspree, etc.)
    const enviar = datos => new Promise(resolve => setTimeout(() => resolve(datos), 900));
  
    function initContacto() {
      const form = $('.contacto-form form');
      if (!form) return;
      const nombre = $('#nombre'), correo = $('#correo'), mensaje = $('#mensaje');
      const btnSubmit = $('button[type="submit"]', form);
      const card = form.closest('.contacto-card');
  
      // Termómetro
      const meter = document.createElement('div');
      meter.className = 'su-meter';
      meter.innerHTML = '<div class="su-meter-bar"><i></i></div><span>Nivel de picante del mensaje: <b>Frío 🧊</b></span>';
      mensaje.after(meter);
      const levels = [[0, 'Frío 🧊'], [15, 'Tibio 😐'], [50, 'Pica rico 🌶️'], [110, '¡Fuego! 🔥'], [190, 'BOOM DE SABOR 💥']];
      const WORDS = /picante|fuego|chile|boom|gomita|limón|limon|🔥|🌶/gi;
      const updateMeter = () => {
        const v = mensaje.value;
        const score = v.length + (v.match(WORDS) || []).length * 20;
        const level = levels.filter(l => score >= l[0]).pop();
        meter.style.setProperty('--h', Math.min(100, score / 190 * 100) + '%');
        meter.classList.toggle('boom', score >= 190);
        $('b', meter).textContent = level[1];
      };
      mensaje.addEventListener('input', updateMeter);
  
      // Validación
      const MSG = {
        nombre: '¿Cómo te llamas? Hasta el chile más bravo tiene nombre 🌶️',
        correo: 'Ese correo no prende 🔌 revisa que tenga @ y dominio',
        mensaje: 'Cuéntanos algo, aunque sea un "quiero gomitas" 🍬',
      };
      const setError = (input, msg) => {
        let err = input.nextElementSibling;
        if (!err || !err.classList.contains('su-error')) {
          err = document.createElement('small');
          err.className = 'su-error';
          err.setAttribute('role', 'alert');
          input.after(err);
        }
        err.textContent = msg;
        input.classList.toggle('su-invalid', !!msg);
        if (!msg) err.remove();
      };
      const validators = {
        nombre: () => nombre.value.trim().length >= 2,
        correo: () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.value.trim()),
        mensaje: () => mensaje.value.trim().length >= 5,
      };
      const fields = { nombre, correo, mensaje };
      Object.keys(fields).forEach(k => {
        fields[k].addEventListener('input', () => { if (validators[k]()) setError(fields[k], ''); });
      });
  
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const bad = Object.keys(fields).filter(k => !validators[k]());
        Object.keys(fields).forEach(k => setError(fields[k], bad.includes(k) ? MSG[k] : ''));
        if (bad.length) {
          fields[bad[0]].focus();
          card.classList.remove('su-shake'); void card.offsetWidth; card.classList.add('su-shake');
          return;
        }
  
        const textoOriginal = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'ENCENDIENDO… 🔥';
        try {
          await enviar({ nombre: nombre.value, correo: correo.value, mensaje: mensaje.value });
          const primerNombre = nombre.value.trim().split(/\s+/)[0];
          const r = card.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2, EMOJIS, 30);
          toast(`¡BOOM, ${primerNombre}! Tu mensaje ya está encendido 🔥`);
          form.reset();
          updateMeter();
        } catch (_) {
          toast('Uy, se apagó la llama. Intenta otra vez 🥲');
        } finally {
          btnSubmit.disabled = false;
          btnSubmit.textContent = textoOriginal;
        }
      });
  
      // Botón "CONTÁCTANOS" lleva al formulario
      const cta = $('.contacto-info .btn-amarillo');
      if (cta) cta.addEventListener('click', e => {
        e.preventDefault();
        card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        card.classList.remove('su-pulse'); void card.offsetWidth; card.classList.add('su-pulse');
        setTimeout(() => nombre.focus({ preventScroll: true }), 500);
      });
    }
  
    /* ---------- 9. Secretos ---------- */
    function initEasterEggs() {
      // 5 clics rápidos al logo
      const logo = $('.logo img');
      let clicks = 0, timer;
      if (logo) logo.addEventListener('click', () => {
        clicks++;
        clearTimeout(timer);
        timer = setTimeout(() => { clicks = 0; }, 2000);
        if (clicks >= 5) { clicks = 0; fireRain(); toast('🔥 ¡LLUVIA DE FUEGO! 🔥'); }
      });
  
      // Código Konami
      const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      let pos = 0;
      addEventListener('keydown', e => {
        const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        pos = k === code[pos] ? pos + 1 : (k === code[0] ? 1 : 0);
        if (pos === code.length) { pos = 0; fireRain(60); toast('💥 BOOM DE SABOR DESBLOQUEADO 💥'); }
      });
  
      // Pestaña inactiva
      const titulo = document.title;
      document.addEventListener('visibilitychange', () => {
        document.title = document.hidden ? 'Se te apagó el fuego 🥶' : titulo;
      });
    }
  

    /* ---------- 0. Logo: el GIF se reproduce UNA vez y vuelve al logo normal ---------- */
    function initLogoGif() {
      const img = $('.logo img');
      if (!img || reduceMotion) return;
      const estatico = img.getAttribute('src');
      const GIF = 'img/logo-animado.gif';
      const DURACION = 4000; // 100 cuadros x 40 ms
      const pre = new Image();
      pre.onload = () => {
        // el parámetro evita que el navegador reutilice el GIF ya terminado
        img.src = GIF + '?v=' + Date.now();
        setTimeout(() => { img.src = estatico; }, DURACION + 150);
      };
      pre.src = GIF;
    }

    /* ---------- Arranque ---------- */
    function init() {
      injectStyles();
      initLogoGif();
      initSabores();   // antes del reveal para que las tarjetas nuevas también aparezcan
      initReveal();
      initTilt();
      initCart();
      initHeroCta();
      initFuego();
      initImgFallback();
      initHero();
      initNav();
      initFuse();
      initEmbers();
      initContacto();
      initEasterEggs();
    }
  
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  })();