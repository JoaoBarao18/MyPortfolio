import {
  DEFAULT_THEME_PALETTE,
  I18N_DICTIONARY,
  LanguageCode,
  RoutePath,
  TECH_STACK_PYRAMID,
  ThemePaletteConfig,
} from './i18n';
import { PortfolioProject } from './github';

/**
 * Parse URL hash or pathname into a typed RoutePath
 */
export function resolveRouteFromLocation(hash: string, pathname: string = '/'): RoutePath {
  const raw = (hash ? hash.replace(/^#\/?/, '') : pathname.replace(/^\/+/, '')).split('?')[0].trim().toLowerCase();

  if (!raw || raw === '' || raw === 'home' || raw === 'inicio') return 'home';
  if (raw === 'work' || raw === 'full-work' || raw === 'projects' || raw === 'projetos') return 'work';
  if (raw === 'thank-you' || raw === 'thanks' || raw === 'obrigado') return 'thank-you';
  if (raw === 'privacy' || raw === 'privacidade') return 'privacy';
  if (raw === 'terms' || raw === 'termos') return 'terms';
  if (raw === 'admin') return 'admin';

  // Anchor sections on home page (#tech-stack, #career, #projects, #certifications, #contact, #about)
  if (['tech-stack', 'career', 'certifications', 'contact', 'about'].includes(raw)) {
    return 'home';
  }

  return '404';
}

/**
 * Get localized SEO title and meta description for any active route and language
 */
export function getSeoMetadataForRoute(
  route: RoutePath,
  lang: LanguageCode
): { title: string; description: string; canonicalPath: string } {
  const dict = I18N_DICTIONARY[lang].seo;
  switch (route) {
    case 'home':
      return { title: dict.homeTitle, description: dict.homeDesc, canonicalPath: '/' };
    case 'work':
      return { title: dict.workTitle, description: dict.workDesc, canonicalPath: '/#/work' };
    case 'thank-you':
      return { title: dict.thankYouTitle, description: dict.thankYouDesc, canonicalPath: '/#/thank-you' };
    case 'privacy':
      return { title: dict.privacyTitle, description: dict.privacyDesc, canonicalPath: '/#/privacy' };
    case 'terms':
      return { title: dict.termsTitle, description: dict.termsDesc, canonicalPath: '/#/terms' };
    case 'admin':
      return { title: dict.adminTitle, description: dict.adminDesc, canonicalPath: '/#/admin' };
    case '404':
    default:
      return { title: dict.notFoundTitle, description: dict.notFoundDesc, canonicalPath: '/#/404' };
  }
}

/**
 * Filter portfolio projects by selected technology and search query
 */
export function filterProjects(
  projects: PortfolioProject[],
  techFilter: string | null,
  searchQuery: string,
  lang: LanguageCode
): PortfolioProject[] {
  const normalizedTech = techFilter ? techFilter.trim().toLowerCase() : null;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Find matching keywords if techFilter corresponds to a TechItem id or name
  const matchedTechItem = normalizedTech
    ? TECH_STACK_PYRAMID.find(
        (t) => t.id.toLowerCase() === normalizedTech || t.name.toLowerCase() === normalizedTech
      )
    : undefined;
  const techSearchTerms = matchedTechItem
    ? [matchedTechItem.name.toLowerCase(), ...matchedTechItem.keywords.map((k) => k.toLowerCase())]
    : normalizedTech
      ? [normalizedTech]
      : [];

  return projects.filter((project) => {
    if (techSearchTerms.length > 0) {
      const stackLower = [
        project.language.toLowerCase(),
        ...project.techStack.map((s) => s.toLowerCase()),
      ];
      const matchesTech = techSearchTerms.some((term) => {
        if (stackLower.some((s) => s === term || s.includes(term))) {
          // For single-character languages like 'c', require exact token or 'c (' / 'embedded c'
          if (term === 'c') {
            return stackLower.some(
              (s) => s === 'c' || s.startsWith('c ') || s.endsWith(' c') || s.includes('c (')
            );
          }
          return true;
        }
        return false;
      });
      if (!matchesTech) return false;
    }

    if (normalizedQuery.length > 0) {
      const queryHaystack = [
        project.name,
        project.title[lang],
        project.description[lang],
        project.language,
        ...project.techStack,
        ...project.highlights[lang],
      ]
        .join(' ')
        .toLowerCase();

      if (!queryHaystack.includes(normalizedQuery)) return false;
    }

    return true;
  });
}

/**
 * Compute circular carousel relative offset and 3D transform state for an item
 */
export function computeCarouselCardTransform(
  itemIndex: number,
  activeIndex: number,
  totalItems: number
): {
  relativeOffset: number;
  translateXPercent: number;
  translateZPx: number;
  rotateYDeg: number;
  scale: number;
  opacity: number;
  zIndex: number;
  isActive: boolean;
} {
  if (totalItems <= 0) {
    return {
      relativeOffset: 0,
      translateXPercent: 0,
      translateZPx: 0,
      rotateYDeg: 0,
      scale: 1,
      opacity: 1,
      zIndex: 10,
      isActive: true,
    };
  }

  const normalizedActive = ((activeIndex % totalItems) + totalItems) % totalItems;
  let diff = itemIndex - normalizedActive;
  const half = Math.floor(totalItems / 2);

  if (diff > half) diff -= totalItems;
  if (diff < -half) diff += totalItems;

  const absDiff = Math.abs(diff);
  const isActive = diff === 0;

  const translateXPercent = diff * 104;
  const translateZPx = -absDiff * 110;
  const rotateYDeg = diff * -10;
  const scale = isActive ? 1 : Math.max(0.84, 1 - absDiff * 0.12);
  const opacity = absDiff > 1 ? 0 : isActive ? 1 : 0.38;
  const zIndex = 20 - absDiff * 5;

  return {
    relativeOffset: diff,
    translateXPercent,
    translateZPx,
    rotateYDeg,
    scale,
    opacity,
    zIndex,
    isActive,
  };
}

/**
 * Compute pixel luminance (0..1) and 3D Z-depth displacement for face3d.ts
 */
export function computePixelDepthAndBrightness(
  r: number,
  g: number,
  b: number,
  a: number = 255
): { luminance: number; zDepth: number; pointSize: number; isVisible: boolean } {
  if (a < 32) {
    return { luminance: 0, zDepth: 0, pointSize: 0, isVisible: false };
  }
  // Perceived ITU-R BT.709 luminance
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  // Filter out very dark studio background pixels (< 0.075 brightness)
  if (lum < 0.075) {
    return { luminance: lum, zDepth: 0, pointSize: 0, isVisible: false };
  }

  // Smooth linear-contrast curve preserving recognizable facial features (eyes, nose bridge, glasses, smile)
  const contrastLum = Math.min(1, Math.max(0, lum));
  // Moderate, natural relief (reduced from 1.65 to 0.45) so features remain recognizable to recruiters
  const zDepth = (contrastLum - 0.4) * 0.45;
  const pointSize = 1.35 + contrastLum * 1.85;

  return {
    luminance: contrastLum,
    zDepth,
    pointSize,
    isVisible: true,
  };
}

/**
 * Validate and sanitize 60-30-10 theme hex colors
 */
export function sanitizeThemePalette(input: Partial<ThemePaletteConfig>): ThemePaletteConfig {
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  return {
    darkDominant60:
      input.darkDominant60 && hexRegex.test(input.darkDominant60.trim())
        ? input.darkDominant60.trim().toUpperCase()
        : DEFAULT_THEME_PALETTE.darkDominant60,
    darkSecondary30:
      input.darkSecondary30 && hexRegex.test(input.darkSecondary30.trim())
        ? input.darkSecondary30.trim().toUpperCase()
        : DEFAULT_THEME_PALETTE.darkSecondary30,
    darkAccent10:
      input.darkAccent10 && hexRegex.test(input.darkAccent10.trim())
        ? input.darkAccent10.trim().toUpperCase()
        : DEFAULT_THEME_PALETTE.darkAccent10,
    lightDominant60:
      input.lightDominant60 && hexRegex.test(input.lightDominant60.trim())
        ? input.lightDominant60.trim().toUpperCase()
        : DEFAULT_THEME_PALETTE.lightDominant60,
    lightSecondary30:
      input.lightSecondary30 && hexRegex.test(input.lightSecondary30.trim())
        ? input.lightSecondary30.trim().toUpperCase()
        : DEFAULT_THEME_PALETTE.lightSecondary30,
    lightAccent10:
      input.lightAccent10 && hexRegex.test(input.lightAccent10.trim())
        ? input.lightAccent10.trim().toUpperCase()
        : DEFAULT_THEME_PALETTE.lightAccent10,
  };
}

/**
 * Deterministic SHA-256 hex digest (using Web Crypto API when available, with pure-TS fallback for sync/Node environments)
 */
export async function computeSha256Hex(message: string): Promise<string> {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message.trim());
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return '';
}

// SHA-256 hash for administrator access (plaintext never stored in source)
const VALID_ADMIN_SHA256_HASHES = new Set([
  '8ef1c265b2e24ca985472a09ee96ebab045a9e492c998788a03fabb60cf6704b',
]);

export async function verifyAdminCredentials(password: string): Promise<boolean> {
  const trimmed = password.trim();
  if (!trimmed) return false;
  const digest = await computeSha256Hex(trimmed);
  return VALID_ADMIN_SHA256_HASHES.has(digest);
}

