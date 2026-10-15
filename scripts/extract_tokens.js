// design-steal token extractor
// Paste the whole file into the Chrome JavaScript tool on the page you want to analyze.
// Returns a JSON string with the most frequent design values on the page.
// Re-run after opening menus/modals or after scrolling, to catch lazy content.

(() => {
  const TOP = 15;
  const inc = (m, k, sample) => {
    if (!k) return;
    const e = m.get(k) || { n: 0, sample };
    e.n++;
    m.set(k, e);
  };
  const top = (m, n = TOP) =>
    [...m.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, n)
      .map(([v, e]) => (e.sample ? { v, n: e.n, eg: e.sample } : { v, n: e.n }));
  const tag = (el) =>
    el.tagName.toLowerCase() + (el.classList[0] ? '.' + String(el.classList[0]).slice(0, 30) : '');

  const visible = [...document.querySelectorAll('body *')].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }).slice(0, 5000);

  const M = {};
  ['text', 'bg', 'border', 'font', 'typo', 'radius', 'shadow', 'padding', 'margin', 'gap',
   'transition', 'backdrop', 'maxWidth', 'gridCols', 'opacity'].forEach((k) => (M[k] = new Map()));

  for (const el of visible) {
    const s = getComputedStyle(el);
    const t = tag(el);
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

    if (hasText) {
      inc(M.text, s.color);
      inc(M.font, s.fontFamily);
      inc(M.typo, `${s.fontSize} | lh ${s.lineHeight} | w ${s.fontWeight} | ls ${s.letterSpacing}`, t);
    }
    if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') inc(M.bg, s.backgroundColor, t);
    if (s.backgroundImage !== 'none' && s.backgroundImage.includes('gradient')) inc(M.bg, s.backgroundImage.slice(0, 160), t);
    if (parseFloat(s.borderTopWidth) > 0) inc(M.border, `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`);
    if (s.borderRadius !== '0px') inc(M.radius, s.borderRadius, t);
    if (s.boxShadow !== 'none') inc(M.shadow, s.boxShadow, t);
    if (s.backdropFilter && s.backdropFilter !== 'none') inc(M.backdrop, s.backdropFilter, t);
    if (s.opacity !== '1') inc(M.opacity, s.opacity);

    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const p = s['padding' + side]; if (p !== '0px') inc(M.padding, p);
      const mg = s['margin' + side]; if (mg !== '0px' && mg !== 'auto') inc(M.margin, mg);
    }
    if ((s.display.includes('flex') || s.display.includes('grid')) && s.gap !== 'normal' && s.gap !== '0px') inc(M.gap, s.gap);
    if (s.maxWidth !== 'none') inc(M.maxWidth, s.maxWidth, t);
    if (s.display.includes('grid') && s.gridTemplateColumns !== 'none') {
      inc(M.gridCols, `${s.gridTemplateColumns.split(' ').length} cols`, t);
    }

    const durs = s.transitionDuration.split(', ');
    if (durs.some((d) => d !== '0s')) {
      const props = s.transitionProperty.split(', ');
      const eases = s.transitionTimingFunction.split(/,\s(?![^(]*\))/);
      const delays = s.transitionDelay.split(', ');
      props.forEach((p, i) => {
        const d = durs[i % durs.length];
        if (d === '0s') return;
        inc(M.transition, `${p} ${d} ${eases[i % eases.length]}${delays[i % delays.length] !== '0s' ? ' delay ' + delays[i % delays.length] : ''}`, t);
      });
    }
  }

  // Stylesheet walk: custom properties, interaction-state rules, keyframes, breakpoints
  const vars = {};
  const stateRules = [];
  const keyframes = {};
  const breakpoints = new Map();
  const blocked = [];
  const walk = (rules) => {
    for (const r of rules) {
      if (r.type === 1) { // style rule
        const sel = r.selectorText || '';
        if (/^(:root|html|body|\.dark|\.light|\[data-theme)/.test(sel)) {
          for (const p of r.style) if (p.startsWith('--')) vars[`${sel.slice(0, 40)} ${p}`] = r.style.getPropertyValue(p).trim().slice(0, 120);
        }
        if (/:(hover|active|focus-visible|focus|pressed)|\[data-state|\[aria-expanded/.test(sel) && stateRules.length < 60) {
          stateRules.push(`${sel.slice(0, 90)} { ${r.style.cssText.slice(0, 200)} }`);
        }
      } else if (r.type === 7) { // keyframes
        keyframes[r.name] = [...r.cssRules].map((k) => `${k.keyText}{${k.style.cssText.slice(0, 120)}}`).join(' ').slice(0, 400);
      } else if (r.type === 4) { // media
        const m = r.conditionText || r.media.mediaText;
        const bp = m.match(/(min|max)-width:\s*([\d.]+(px|em|rem))/g);
        if (bp) bp.forEach((b) => inc(breakpoints, b));
        if (/prefers-(reduced-motion|color-scheme|contrast|reduced-transparency)/.test(m)) inc(breakpoints, m.slice(0, 80));
        walk(r.cssRules);
      } else if (r.cssRules) {
        walk(r.cssRules); // supports, layer, container
      }
    }
  };
  for (const sh of document.styleSheets) {
    try { walk(sh.cssRules); } catch (e) { blocked.push(sh.href); }
  }
  // Computed :root vars also catch CSS-in-JS / inline-injected tokens
  const rootStyle = getComputedStyle(document.documentElement);
  for (const p of rootStyle) if (p.startsWith('--') && !Object.keys(vars).some((k) => k.endsWith(' ' + p))) {
    vars[`:root(computed) ${p}`] = rootStyle.getPropertyValue(p).trim().slice(0, 120);
  }

  // Library / stack detection
  const html = document.documentElement.outerHTML.slice(0, 400000);
  const libs = {
    tailwind: /\b(px|py|mt|mb|gap|text|bg|rounded)-[\w[\]/.-]+\b/.test(document.body.className + ' ' + [...document.querySelectorAll('[class]')].slice(0, 200).map((e) => e.className).join(' ')),
    framerMotion: !!document.querySelector('[data-projection-id], [data-framer-appear-id], [style*="--framer"]') || /framer-motion|motion\.dev/.test(html),
    framerSite: !!document.querySelector('[data-framer-name], [data-framer-component-type]'),
    gsap: !!window.gsap || !!window.TweenMax,
    lenis: !!window.lenis || document.documentElement.classList.contains('lenis'),
    radix: !!document.querySelector('[data-radix-collection-item], [data-radix-popper-content-wrapper]'),
    nextjs: !!window.__NEXT_DATA__ || !!document.querySelector('script[src*="/_next/"]'),
    webflow: !!document.querySelector('html[data-wf-site]'),
  };

  const running = document.getAnimations().slice(0, 20).map((a) => {
    const tm = a.effect && a.effect.getTiming ? a.effect.getTiming() : {};
    return {
      name: a.animationName || a.transitionProperty || a.constructor.name,
      duration: tm.duration, easing: tm.easing, delay: tm.delay, iterations: tm.iterations,
      target: a.effect && a.effect.target ? tag(a.effect.target) : null,
    };
  });

  const out = {
    url: location.href,
    viewport: `${innerWidth}x${innerHeight}`,
    scannedElements: visible.length,
    stack: libs,
    colors: { text: top(M.text), background: top(M.bg), border: top(M.border, 10) },
    typography: { families: top(M.font, 6), combos: top(M.typo, 20) },
    spacing: { padding: top(M.padding, 20), margin: top(M.margin, 15), gap: top(M.gap, 12), maxWidth: top(M.maxWidth, 8), grid: top(M.gridCols, 8) },
    shape: { radius: top(M.radius, 12), shadow: top(M.shadow, 10), backdrop: top(M.backdrop, 6), opacity: top(M.opacity, 8) },
    motion: { transitions: top(M.transition, 20), keyframes, runningAnimations: running },
    stateRules,
    breakpoints: top(breakpoints, 15),
    cssVariables: Object.fromEntries(Object.entries(vars).slice(0, 150)),
    crossOriginSheetsNotRead: blocked.filter(Boolean).slice(0, 10),
  };
  return JSON.stringify(out);
})();
