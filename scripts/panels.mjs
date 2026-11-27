export const THEMES = {
  light: {
    ground: '#fbf8e6', raised: '#fffdf2', fg: '#12266b', muted: '#4b5578', rule: '#e9e2b6',
    bannerGround: '#f3edbe', bannerInk: '#12266b', mark: '#e0004b', plate: '#f3edbe', shadow: 'rgb(18 38 107 / 0.08)',
  },
  dark: {
    ground: '#1a1c20', raised: '#222429', fg: '#f3edbe', muted: '#b9b49a', rule: '#2e3137',
    bannerGround: '#1a1c20', bannerInk: '#f3edbe', mark: '#ff3d7a', plate: '#f3edbe', shadow: 'rgb(0 0 0 / 0.3)',
  },
};

const STATUS = {
  live: { label: 'Released', color: '#3f9e57' },
  testing: { label: 'Testing', color: '#3f7fbe' },
  building: { label: 'Building', color: '#d9760f' },
};

export const escape = (text) =>
  String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const css = (theme, fonts) => `
@font-face { font-family: Gabarito; src: url(${fonts.gabarito}) format('woff2'); font-weight: 400 900; }
@font-face { font-family: "Nunito Sans"; src: url(${fonts.nunito}) format('woff2'); font-weight: 200 1000; }
.root { --ground: ${theme.ground}; --raised: ${theme.raised}; --fg: ${theme.fg}; --muted: ${theme.muted}; --rule: ${theme.rule};
  --banner-ground: ${theme.bannerGround}; --banner-ink: ${theme.bannerInk}; --mark: ${theme.mark}; --plate: ${theme.plate}; --shadow: ${theme.shadow};
  margin: 0; font-family: "Nunito Sans", sans-serif; color: var(--fg); -webkit-font-smoothing: antialiased; }
.root * { box-sizing: border-box; }
.root p, .root ul, .root h3 { margin: 0; padding: 0; }
.panel { border-radius: 16px; background: var(--ground); overflow: hidden; }

.banner { background: var(--banner-ground); color: var(--banner-ink); display: grid; grid-template-columns: minmax(0, 1fr) 210px; align-items: end; gap: 16px; padding: 0 28px 0 40px; }
.banner-copy { align-self: center; padding: 36px 0; }
.wordmark { font-family: Gabarito, sans-serif; font-weight: 800; font-size: 64px; line-height: 1; letter-spacing: -0.02em; color: var(--mark); }
.headline { margin-top: 16px !important; max-width: 24ch; font-family: Gabarito, sans-serif; font-weight: 600; font-size: 22px; line-height: 1.3; }
.subline { margin-top: 8px !important; font-size: 14px; color: var(--muted); }
.duck { width: 210px; display: block; transform-origin: 50% 100%; animation: rock 3.2s ease-in-out infinite; }
@keyframes rock { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-2.5deg); } }
@media (prefers-reduced-motion: reduce) { .duck { animation: none; } }

.newest { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; font-size: 14px; }
.newest img { width: 28px; height: 28px; border-radius: 8px; }
.newest b { font-weight: 800; }

.projects { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 32px; padding: 22px 28px 10px; }
.col-title { display: flex; align-items: center; gap: 8px; padding-bottom: 8px; font-family: Gabarito, sans-serif; font-weight: 700; font-size: 17px; }
.count { font-family: "Nunito Sans", sans-serif; font-size: 12px; font-weight: 800; color: var(--muted); }
.rows { list-style: none; }
.row { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 14px; align-items: start; padding: 12px 0; border-top: 1px solid var(--rule); }
.logo { width: 44px; height: 44px; border-radius: 11px; object-fit: cover; image-rendering: pixelated; display: block; }
.logo--plate { background: var(--plate); }
.row-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; }
.row-name { font-family: Gabarito, sans-serif; font-weight: 700; font-size: 16px; line-height: 1.3; }
.row-meta { font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }
.row-meta b { color: var(--fg); }
.row-line { font-size: 14px; color: var(--muted); line-height: 1.4; }
.row-platforms { margin-top: 2px !important; font-size: 12px; font-weight: 700; color: var(--muted); }
.status { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 800; color: var(--muted); }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

.tooling { padding: 8px 28px 14px; }
.tooling .rows { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 32px; }
.tooling .row { grid-template-columns: 40px minmax(0, 1fr); }
.tooling .logo { width: 40px; height: 40px; }
.tooling .row:nth-child(-n + 2) { border-top: 0; }

.art { padding: 20px 24px; }
.art img { display: block; width: 100%; }

.social { display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 12px 0 9px; border-radius: 12px; background: var(--raised); border: 1px solid var(--rule); box-shadow: 0 1px 2px var(--shadow); }
.mark { flex: none; width: 36px; height: 36px; border-radius: 9px; display: grid; place-items: center; color: #fff; }
.mark svg { width: 20px; height: 20px; fill: currentColor; }
.social-text { display: grid; line-height: 1.25; min-width: 0; }
.social-text b { font-family: Gabarito, sans-serif; font-size: 15px; font-weight: 700; }
.social-text span { font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.narrow .banner { grid-template-columns: minmax(0, 1fr) 96px; padding: 0 12px 0 20px; gap: 8px; }
.narrow .banner-copy { padding: 22px 0; }
.narrow .wordmark { font-size: 38px; }
.narrow .headline { font-size: 17px; }
.narrow .subline { font-size: 13px; }
.narrow .duck { width: 96px; }
.narrow .projects { grid-template-columns: 1fr; padding: 18px 16px 4px; }
.narrow .works { margin-top: 16px; }
.narrow .tooling { padding: 4px 16px 8px; }
.narrow .tooling .rows { grid-template-columns: 1fr; }
.narrow .tooling .row:nth-child(2) { border-top: 1px solid var(--rule); }
`;

const logoImg = (project) =>
  `<img class="logo${project.plate ? ' logo--plate' : ''}" src="${project.logo}" alt="" />`;

const dot = (status) => `<span class="dot" style="background:${STATUS[status].color}"></span>`;

const releasedRow = (p) => `
  <li class="row">${logoImg(p)}
    <div>
      <p class="row-head"><span class="row-name">${escape(p.name)}</span><span class="row-meta"><b>v${escape(p.version)}</b> · ${escape(p.date)}</span></p>
      <p class="row-line">${escape(p.tagline)}</p>
      <p class="row-platforms">${escape(p.platforms)}</p>
    </div>
  </li>`;

const worksRow = (p) => `
  <li class="row">${logoImg(p)}
    <div>
      <p class="row-head"><span class="row-name">${escape(p.name)}</span><span class="status">${dot(p.status)}${STATUS[p.status].label}</span></p>
      <p class="row-line">${escape(p.tagline)}</p>
      <p class="row-platforms">${escape(p.platforms)}${p.version ? ` · v${escape(p.version)}` : ''}</p>
    </div>
  </li>`;

const toolRow = (p) => `
  <li class="row">${logoImg(p)}
    <div>
      <p class="row-head"><span class="row-name">${escape(p.name)}</span></p>
      <p class="row-line">${escape(p.tagline)}</p>
    </div>
  </li>`;

export const PANELS = {
  banner: (d) => `
<div class="panel banner">
  <div class="banner-copy">
    <p class="wordmark">Haembina</p>
    <p class="headline">${escape(d.headline)}</p>
    <p class="subline">${escape(d.subline)}</p>
  </div>
  <img class="duck" src="${d.art.wave}" alt="" />
</div>`,
  newest: (d) => `
<p class="panel newest"><img src="${d.newest.logo}" alt="" /><span>Newest: <b>${escape(d.newest.name)} v${escape(d.newest.version)}</b>, released ${escape(d.newest.date)}</span></p>`,
  projects: (d) => `
<div class="panel projects">
  <section>
    <h3 class="col-title">${dot('live')}Released<span class="count">${d.released.length}</span></h3>
    <ul class="rows">${d.released.map(releasedRow).join('')}</ul>
  </section>
  <section class="works">
    <h3 class="col-title">In the works<span class="count">${d.inTheWorks.length}</span></h3>
    <ul class="rows">${d.inTheWorks.map(worksRow).join('')}</ul>
  </section>
</div>`,
  tooling: (d) => `
<div class="panel tooling"><ul class="rows">${d.tooling.map(toolRow).join('')}</ul></div>`,
  art: (d) => `
<div class="panel art"><img src="${d.art.socials}" alt="" /></div>`,
};

export const socialButton = (social, iconSvg) => `
<div class="social"><span class="mark" style="background:${social.color}">${iconSvg}</span><span class="social-text"><b>${escape(social.name)}</b><span>${escape(social.handle)}</span></span></div>`;

export const page = (themeName, fonts, narrow, body) => `<!doctype html>
<html><head><meta charset="utf-8" /><style>html, body { margin: 0; background: transparent; }</style></head>
<body><div class="root ${themeName}${narrow ? ' narrow' : ''}"><style>${css(THEMES[themeName], fonts)}</style>${body}</div></body></html>`;
