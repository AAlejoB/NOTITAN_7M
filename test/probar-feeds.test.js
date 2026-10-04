'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { leerCandidatos, leerFeedsJson, analizarCuerpo, dominiosDeLinks, descubrirFeeds } = require('../scripts/probar-feeds.js');

const RSS = `<?xml version="1.0"?><rss version="2.0"><channel><title>X</title>
<item><title>A</title><link>https://www.diario.com/a</link><pubDate>Sat, 03 Oct 2026 03:01:55 +0000</pubDate></item>
<item><title>B</title><link><![CDATA[https://diario.com/b]]></link><pubDate><![CDATA[Sat, 03 Oct 2026 05:00:00 +0000]]></pubDate></item>
</channel></rss>`;

test('RSS: cuenta notas, lee fechas (también dentro de CDATA) y dominios', () => {
  const r = analizarCuerpo(RSS);
  assert.equal(r.formato, 'rss');
  assert.equal(r.items, 2);
  assert.equal(r.masNueva, Date.parse('Sat, 03 Oct 2026 05:00:00 +0000'));
  assert.deepEqual(r.dominios, { 'diario.com': 2 });
});

test('Atom: toma el href del link y la fecha updated', () => {
  const atom = `<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>A</title><link rel="alternate" href="https://www.otro.com/x"/><updated>2026-10-03T10:00:00Z</updated></entry></feed>`;
  const r = analizarCuerpo(atom);
  assert.equal(r.formato, 'atom');
  assert.equal(r.items, 1);
  assert.equal(r.masNueva, Date.parse('2026-10-03T10:00:00Z'));
  assert.deepEqual(r.dominios, { 'otro.com': 1 });
});

test('una página HTML no es un feed', () => {
  const r = analizarCuerpo('<!DOCTYPE html><html><head></head><body>Just a moment...</body></html>');
  assert.equal(r.formato, 'html');
  assert.equal(r.items, 0);
});

test('un cuerpo vacío o con error de texto no tiene formato', () => {
  assert.equal(analizarCuerpo('').formato, null);
  assert.equal(analizarCuerpo('Error: no feed by that name.').formato, null);
});

test('dominiosDeLinks separa subdominios y cuenta cada uno', () => {
  const x = `<item><link>https://www.elpais.com/a</link></item><item><link>https://cincodias.elpais.com/b</link></item><item><link>https://elpais.com/c</link></item>`;
  assert.deepEqual(dominiosDeLinks(x), { 'elpais.com': 2, 'cincodias.elpais.com': 1 });
});

test('descubrirFeeds encuentra el RSS que anuncia la portada y resuelve rutas relativas', () => {
  const html = `<head><link rel="alternate" type="application/rss+xml" href="/rss/ultimas.xml"><link rel="stylesheet" href="/x.css"></head>`;
  assert.deepEqual(descubrirFeeds(html, 'https://www.sitio.com/inicio'), ['https://www.sitio.com/rss/ultimas.xml']);
});

test('leerCandidatos ignora comentarios y líneas vacías', () => {
  const t = '# comentario\n\nClarín|nacional|https://www.clarin.com/rss/lo-ultimo/\nBBC Mundo | internacional | https://feeds.bbci.co.uk/mundo/rss.xml\n';
  assert.deepEqual(leerCandidatos(t), [
    { nombre: 'Clarín', ambito: 'nacional', url: 'https://www.clarin.com/rss/lo-ultimo/' },
    { nombre: 'BBC Mundo', ambito: 'internacional', url: 'https://feeds.bbci.co.uk/mundo/rss.xml' },
  ]);
});

test('config/feeds.json: cada feed activo apunta a un portal de portales.json, sin repetir url', () => {
  const feeds = require('../config/feeds.json');
  const { portales } = require('../config/portales.json');
  assert.ok(feeds.feeds.length > 0);
  for (const f of feeds.feeds) {
    const p = portales.find((x) => x.dominio === f.dominio);
    assert.ok(p, `${f.nombre}: ${f.dominio} no está en portales.json`);
    assert.equal(p.grupo, f.grupo, `${f.nombre}: el grupo no coincide con portales.json`);
    assert.ok(/^https:\/\//.test(f.url), `${f.nombre}: la url tiene que ser https`);
  }
  const urls = [...feeds.feeds, ...feeds.extras].map((f) => f.url);
  assert.equal(new Set(urls).size, urls.length, 'hay una url repetida');
  assert.equal(leerFeedsJson(JSON.stringify(feeds)).length, urls.length);
});

test('config/feeds.json: lo que no tiene feed no figura como activo', () => {
  const feeds = require('../config/feeds.json');
  const activos = new Set(feeds.feeds.map((f) => f.dominio));
  for (const s of feeds.sinFeed) assert.ok(!activos.has(s.dominio), `${s.nombre} está en feeds y en sinFeed`);
});

test('config/portales.json: los portales sin feed están inactivos', () => {
  const feeds = require('../config/feeds.json');
  const { portales } = require('../config/portales.json');
  const sinFeed = feeds.sinFeed.map(f => f.dominio).sort();
  for (const dominio of sinFeed) {
    const p = portales.find(x => x.dominio === dominio);
    assert.ok(p, `${dominio} no está en portales.json`);
    assert.equal(p.activo, false, `${dominio} no tiene feed y tiene que estar inactivo`);
  }
  const inactivos = portales.filter(x => x.activo === false).map(x => x.dominio).sort();
  assert.deepEqual(inactivos, sinFeed, 'ningún otro portal puede estar inactivo');
});
