import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCarouselCardTransform,
  computePixelDepthAndBrightness,
  filterProjects,
  getSeoMetadataForRoute,
  resolveRouteFromLocation,
  sanitizeThemePalette,
  verifyAdminCredentials,
} from './portfolioLogic';
import { CV_FALLBACK_PROJECTS, mergeGitHubReposWithCvProjects } from './github';
import { DEFAULT_THEME_PALETTE } from './i18n';

test('resolveRouteFromLocation maps hash and path routes accurately including 404', () => {
  assert.equal(resolveRouteFromLocation('', '/'), 'home');
  assert.equal(resolveRouteFromLocation('#/work', '/'), 'work');
  assert.equal(resolveRouteFromLocation('#/thank-you', '/'), 'thank-you');
  assert.equal(resolveRouteFromLocation('#/privacy', '/'), 'privacy');
  assert.equal(resolveRouteFromLocation('#/terms', '/'), 'terms');
  assert.equal(resolveRouteFromLocation('#/admin', '/'), 'admin');
  assert.equal(resolveRouteFromLocation('#tech-stack', '/'), 'home');
  assert.equal(resolveRouteFromLocation('#/non-existent-route', '/'), '404');
});

test('getSeoMetadataForRoute returns localized titles and descriptions for PT and EN', () => {
  const ptHome = getSeoMetadataForRoute('home', 'pt');
  const enWork = getSeoMetadataForRoute('work', 'en');
  const pt404 = getSeoMetadataForRoute('404', 'pt');

  assert.ok(ptHome.title.includes('João Barão'));
  assert.ok(ptHome.description.includes('ISEC'));
  assert.ok(enWork.title.includes('Archive'));
  assert.ok(pt404.title.includes('404'));
});

test('filterProjects filters CV projects by technology and search query', () => {
  const springProjects = filterProjects(CV_FALLBACK_PROJECTS, 'Spring Boot', '', 'pt');
  assert.equal(springProjects.length, 1);
  assert.equal(springProjects[0].id, 'cv-saber-mais');

  const cProjects = filterProjects(CV_FALLBACK_PROJECTS, 'c', 'POSIX', 'en');
  assert.equal(cProjects.length, 1);
  assert.equal(cProjects[0].id, 'cv-entrega-so');
});

test('mergeGitHubReposWithCvProjects prioritizes GitHub Pages repos and keeps CV highlights', () => {
  const mockApiRepos = [
    {
      id: 999,
      name: 'portfolio-3d-live',
      full_name: 'JoaoBarao18/portfolio-3d-live',
      html_url: 'https://github.com/JoaoBarao18/portfolio-3d-live',
      description: 'Interactive 3D WebGL Portfolio',
      homepage: 'https://joaobarao18.github.io/portfolio-3d-live/',
      has_pages: true,
      language: 'TypeScript',
      topics: ['threejs', 'typescript'],
      stargazers_count: 5,
      updated_at: '2026-11-01T10:00:00Z',
      fork: false,
    },
  ];

  const merged = mergeGitHubReposWithCvProjects(mockApiRepos, 'JoaoBarao18');
  assert.ok(merged.length > CV_FALLBACK_PROJECTS.length);
  assert.equal(merged[0].name, 'portfolio-3d-live');
  assert.equal(merged[0].hasPages, true);
  assert.equal(merged[0].liveUrl, 'https://joaobarao18.github.io/portfolio-3d-live/');
});

test('computeCarouselCardTransform calculates symmetric circular offsets and active state', () => {
  const activeState = computeCarouselCardTransform(2, 2, 5);
  assert.equal(activeState.isActive, true);
  assert.equal(activeState.relativeOffset, 0);
  assert.equal(activeState.scale, 1);

  const rightNeighbor = computeCarouselCardTransform(3, 2, 5);
  assert.equal(rightNeighbor.isActive, false);
  assert.equal(rightNeighbor.relativeOffset, 1);
  assert.ok(rightNeighbor.translateXPercent > 0);
});

test('computePixelDepthAndBrightness filters dark background and maps bright facial features to positive Z', () => {
  const darkBg = computePixelDepthAndBrightness(8, 8, 10, 255);
  assert.equal(darkBg.isVisible, false);

  const brightSkin = computePixelDepthAndBrightness(220, 195, 175, 255);
  assert.equal(brightSkin.isVisible, true);
  assert.ok(brightSkin.zDepth > 0.5);
  assert.ok(brightSkin.pointSize > 2.5);
});

test('sanitizeThemePalette preserves valid 60-30-10 hex codes and falls back on invalid values', () => {
  const sanitized = sanitizeThemePalette({
    darkDominant60: '#042f24',
    darkAccent10: 'not-a-color',
  });
  assert.equal(sanitized.darkDominant60, '#042F24');
  assert.equal(sanitized.darkAccent10, DEFAULT_THEME_PALETTE.darkAccent10);
});

test('verifyAdminCredentials validates SHA-256 admin password and rejects legacy demo passwords', async () => {
  const legacy1 = await verifyAdminCredentials('admin123');
  const legacy2 = await verifyAdminCredentials('barão2026');
  const invalid = await verifyAdminCredentials('wrong-pass');

  assert.equal(legacy1, false);
  assert.equal(legacy2, false);
  assert.equal(invalid, false);
});

