import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PANELS, THEMES, escape, page, socialButton } from './panels.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const WIDE = 846;
const NARROW = 340;
const BUTTON = 260;
const profile = JSON.parse(readFileSync(join(ROOT, 'profile.json'), 'utf8'));
const source = process.env.PROFILE_SOURCE ?? profile.source;

const dataUri = (bytes, type) => `data:${type};base64,${Buffer.from(bytes).toString('base64')}`;
const local = (path, type) => dataUri(readFileSync(join(ROOT, path)), type);

const fetchOk = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response;
};

const fetchLogo = async (id) => {
  const small = await fetch(`${source}/assets/projects/${id}/logo-128.avif`);
  if (small.ok) return dataUri(await small.arrayBuffer(), 'image/avif');
  const full = await fetchOk(`${source}/assets/projects/${id}/logo.png`);
  return dataUri(await full.arrayBuffer(), 'image/png');
};

const formatDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const loadData = async () => {
  const releases = (await (await fetchOk(`${source}/assets/releases.json`)).json()).projects;
  const copy = await (await fetchOk(`${source}/assets/locale/en.json`)).json();
  const darkArt = new Set(profile.darkArt);

  const enrich = async (entry, needsRelease) => {
    const tagline = copy.project?.[entry.id]?.tagline;
    if (!tagline) throw new Error(`${source} has no tagline for ${entry.id}`);
    const release = releases.find((r) => r.id === entry.id);
    if (needsRelease && !release) throw new Error(`${source} has no release for ${entry.id}`);
    return {
      ...entry,
      tagline,
      version: release?.version,
      isoDate: release?.date,
      date: release ? formatDate(release.date) : undefined,
      logo: await fetchLogo(entry.id),
      plate: darkArt.has(entry.id),
    };
  };

  const released = await Promise.all(profile.released.map((p) => enrich(p, true)));
  const inTheWorks = await Promise.all(profile.inTheWorks.map((p) => enrich(p, false)));
  const tooling = await Promise.all(profile.tooling.map((p) => enrich(p, false)));
  const newest = [...released, ...inTheWorks].filter((p) => p.isoDate).sort((a, b) => b.isoDate.localeCompare(a.isoDate))[0];

  return {
    headline: profile.headline,
    subline: profile.subline,
    released,
    inTheWorks,
    tooling,
    newest,
    art: { wave: local('assets/art/wave.png', 'image/png'), socials: local('assets/art/socials.png', 'image/png') },
  };
};

const icon = (name) =>
  readFileSync(join(ROOT, 'assets/icons', `${name}.svg`), 'utf8')
    .replace(/ class="ionicon"/, '')
    .replace(/ data-name="[^"]*"/, '')
    .replace('<svg ', '<svg aria-hidden="true" ');

const toSvg = async (browser, html, width) => {
  const tab = await browser.newPage({ viewport: { width, height: 400 } });
  await tab.setContent(html, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  const { height, markup } = await tab.evaluate(() => {
    const root = document.querySelector('.root');
    return {
      height: Math.ceil(root.lastElementChild.getBoundingClientRect().height),
      markup: new XMLSerializer().serializeToString(root),
    };
  });
  await tab.close();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject x="0" y="0" width="${width}" height="${height}">${markup}</foreignObject></svg>\n`;
};

const write = (name, svg) => {
  const path = join(ROOT, 'images', `${name}.svg`);
  if (existsSync(path) && readFileSync(path, 'utf8') === svg) return false;
  writeFileSync(path, svg);
  return true;
};

const picture = (name, alt, { narrow = true, attrs = 'width="100%"' } = {}) => [
  '<picture>',
  ...(narrow
    ? [
        `<source media="(prefers-color-scheme: dark) and (max-width: 600px)" srcset="images/${name}-dark-narrow.svg">`,
        `<source media="(max-width: 600px)" srcset="images/${name}-light-narrow.svg">`,
      ]
    : []),
  `<source media="(prefers-color-scheme: dark)" srcset="images/${name}-dark.svg">`,
  `<img alt="${escape(alt)}" src="images/${name}-light.svg" ${attrs}>`,
  '</picture>',
].join('\n');

const readme = (d) => `<!-- Written by scripts/render.mjs from profile.json and ${source}; edit those, not this file. -->
<a href="${source}">
${picture('banner', `Haembina. ${d.headline} ${d.subline}`)}
</a>

<a href="${source}/work/${d.newest.id}">
${picture('newest', `Newest: ${d.newest.name} v${d.newest.version}, released ${d.newest.date}`)}
</a>

## Projects

<a href="${source}/work">
${picture('projects', `Released: ${d.released.map((p) => `${p.name} v${p.version}`).join(', ')}. In the works: ${d.inTheWorks.map((p) => p.name).join(', ')}.`)}
</a>

## Tooling

<a href="${source}/work">
${picture('tooling', `Tooling: ${d.tooling.map((p) => `${p.name}, ${p.tagline}`).join(' ')}`)}
</a>

## Elsewhere

${picture('art', 'The Haembina duck at a keyboard, thinking of its social accounts', { narrow: false, attrs: 'align="left" width="38%"' })}
${profile.socials.map((s) => `<a href="${s.url}">${picture(`social-${s.id}`, `${s.name}: ${s.handle}`, { narrow: false, attrs: 'width="30%"' })}</a>`).join('\n')}
<br clear="left">
`;

const writeReadme = (text) => {
  const path = join(ROOT, 'README.md');
  if (existsSync(path) && readFileSync(path, 'utf8') === text) return false;
  writeFileSync(path, text);
  return true;
};

const data = await loadData();
const fonts = {
  gabarito: local('assets/fonts/gabarito-latin.woff2', 'font/woff2'),
  nunito: local('assets/fonts/nunito-sans-latin.woff2', 'font/woff2'),
};
const browser = await chromium.launch();
const changed = [];
for (const theme of Object.keys(THEMES)) {
  for (const [name, build] of Object.entries(PANELS)) {
    const sizes = name === 'art' ? [[WIDE, '']] : [[WIDE, ''], [NARROW, '-narrow']];
    for (const [width, suffix] of sizes) {
      const svg = await toSvg(browser, page(theme, fonts, suffix !== '', build(data)), width);
      if (write(`${name}-${theme}${suffix}`, svg)) changed.push(`${name}-${theme}${suffix}`);
    }
  }
  for (const social of profile.socials) {
    const svg = await toSvg(browser, page(theme, fonts, false, socialButton(social, icon(social.icon))), BUTTON);
    if (write(`social-${social.id}-${theme}`, svg)) changed.push(`social-${social.id}-${theme}`);
  }
}
await browser.close();
if (writeReadme(readme(data))) changed.push('README.md');
console.log(changed.length ? `redrew ${changed.join(', ')}` : 'nothing changed');
