import { writeFileSync } from 'node:fs';
import { SITE_URL } from '@/lib/seo';
import allRouteList from '@/res/json/all_route_list.json';
import mtrData from '@/res/json/mtr_lines_and_stations.json';

const paths = ['/bus', '/mtr'];

for (const entry of allRouteList.data) {
  paths.push(`/bus/${entry.co}/${entry.route}/${entry.bound}/${entry.service_type}`);
}

for (const line of Object.keys(mtrData.data)) {
  paths.push(`/mtr/${line}/DT`, `/mtr/${line}/UT`);
}

const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const lastmod = new Date().toISOString().slice(0, 10);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map(
    (path) =>
      `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc><lastmod>${lastmod}</lastmod></url>`,
  ),
  '</urlset>',
  '',
].join('\n');

writeFileSync('public/sitemap.xml', xml);
