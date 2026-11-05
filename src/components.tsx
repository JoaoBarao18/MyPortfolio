import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CAREER_TIMELINE,
  CertificationItem,
  DEFAULT_THEME_PALETTE,
  I18N_DICTIONARY,
  LanguageCode,
  PERSONAL_INFO,
  RoutePath,
  SpokenLanguageItem,
  TECH_STACK_PYRAMID,
  TechItem,
  ThemeMode,
  ThemePaletteConfig,
} from './i18n';
import { generateProjectPreviewSvg, PortfolioProject } from './github';
import {
  computeCarouselCardTransform,
  filterProjects,
  sanitizeThemePalette,
  verifyAdminCredentials,
} from './portfolioLogic';
import { Face3DController, initFace3DScene } from './face3d';

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   1. SVG ICON RENDERER FOR TECH STACK & SOCIALS
   ========================================================================== */
export function TechStackIcon({ icon }: { icon: string }) {
  const commonProps = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (icon) {
    case 'java':
      return (
        <svg {...commonProps}>
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="2" x2="6" y2="5" />
          <line x1="10" y1="2" x2="10" y2="5" />
          <line x1="14" y1="2" x2="14" y2="5" />
        </svg>
      );
    case 'spring':
      return (
        <svg {...commonProps}>
          <path d="M12 2a10 10 0 1 0 10 10c0-5.52-4.48-10-10-10z" />
          <path d="M8 15c2-4 5-6 9-6-1 4-4 7-9 6z" />
        </svg>
      );
    case 'react':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
        </svg>
      );
    case 'typescript':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10h5M10.5 10v7" />
          <path d="M17 11.5c-.8-.6-2.2-.5-2.2.6 0 1.5 2.5 1.1 2.5 2.8 0 1.2-1.6 1.4-2.6.6" />
        </svg>
      );
    case 'javascript':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M10 10v5.5a1.5 1.5 0 0 1-3 0" />
          <path d="M17 11.5c-.8-.6-2.2-.5-2.2.6 0 1.5 2.5 1.1 2.5 2.8 0 1.2-1.6 1.4-2.6.6" />
        </svg>
      );
    case 'c':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9.5a4 4 0 1 0 0 5" />
        </svg>
      );
    case 'cpp':
      return (
        <svg {...commonProps}>
          <path d="M10 9.5a3.5 3.5 0 1 0 0 5" />
          <path d="M14 12h3M15.5 10.5v3M18.5 12h3M20 10.5v3" />
        </svg>
      );
    case 'kotlin':
      return (
        <svg {...commonProps}>
          <polygon points="4 4 20 4 12 12 20 20 4 20 4 4" />
        </svg>
      );
    case 'sql':
    case 'postgresql':
    case 'mysql':
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
        </svg>
      );
    case 'supabase':
      return (
        <svg {...commonProps}>
          <polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2" />
        </svg>
      );
    case 'docker':
      return (
        <svg {...commonProps}>
          <rect x="4" y="10" width="3" height="3" />
          <rect x="8" y="10" width="3" height="3" />
          <rect x="12" y="10" width="3" height="3" />
          <rect x="8" y="6" width="3" height="3" />
          <path d="M2 14c1 4 5 6 10 6 6 0 9-3 10-7H2z" />
        </svg>
      );
    case 'linux':
      return (
        <svg {...commonProps}>
          <path d="M12 3c-2.5 0-4 2-4 5v4l-2 4c-.5 1 0 3 2 3h8c2 0 2.5-2 2-3l-2-4V8c0-3-1.5-5-4-5z" />
          <circle cx="10.5" cy="7.5" r="0.8" />
          <circle cx="13.5" cy="7.5" r="0.8" />
        </svg>
      );
    case 'git':
    case 'github':
    case 'gitlab':
      return (
        <svg {...commonProps}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <path d="M6 8.5v7M18 8.5c0 4.5-12 2.5-12 7" />
        </svg>
      );
    case 'figma':
      return (
        <svg {...commonProps}>
          <path d="M9 3h3v6H9a3 3 0 0 1 0-6z" />
          <path d="M12 3h3a3 3 0 0 1 0 6h-3V3z" />
          <path d="M12 9h3a3 3 0 0 1 0 6h-3V9z" />
          <path d="M9 9h3v6H9a3 3 0 0 1 0-6z" />
          <path d="M9 15h3v3a3 3 0 1 1-3-3z" />
        </svg>
      );
    case 'threejs':
      return (
        <svg {...commonProps}>
          <polygon points="12 2 21 19 3 19 12 2" />
          <polygon points="12 9 16.5 17.5 7.5 17.5 12 9" />
        </svg>
      );
    case 'embedded':
      return (
        <svg {...commonProps}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        </svg>
      );
    case 'dart':
    case 'flutter':
      return (
        <svg {...commonProps}>
          <polygon points="14 2 4 12 8 16 20 4 14 2" />
          <polygon points="10 14 14 18 20 12 14 12 10 14" />
        </svg>
      );
    case 'csharp':
      return (
        <svg {...commonProps}>
          <path d="M10 8a4 4 0 1 0 0 8" />
          <path d="M14 10h6M14 14h6M15.5 8v8M18.5 8v8" />
        </svg>
      );
    case 'html5':
      return (
        <svg {...commonProps}>
          <polygon points="4 3 20 3 18.5 18.5 12 21 5.5 18.5 4 3" />
          <path d="M8 8h8l-.5 4H9l.3 3 2.7.8 2.7-.8.2-2" />
        </svg>
      );
    case 'css3':
      return (
        <svg {...commonProps}>
          <polygon points="4 3 20 3 18.5 18.5 12 21 5.5 18.5 4 3" />
          <path d="M8 8h8l-4 4h4l-.5 4-3.5 1-3.5-1" />
        </svg>
      );
    case 'vite':
      return (
        <svg {...commonProps}>
          <polygon points="12 21 3 6 10 8 12 3 14 8 21 6 12 21" />
        </svg>
      );
    case 'nodejs':
    case 'express':
      return (
        <svg {...commonProps}>
          <polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2" />
          <path d="M9 15V9l6 6V9" />
        </svg>
      );
    case 'api':
      return (
        <svg {...commonProps}>
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <line x1="8.3" y1="10.8" x2="15.7" y2="7.2" />
          <line x1="8.3" y1="13.2" x2="15.7" y2="16.8" />
        </svg>
      );
    case 'junit':
      return (
        <svg {...commonProps}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case 'patterns':
    case 'javafx':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}

/* ==========================================================================
   2. INTERACTIVE LOADING SCREEN (0% -> 100%)
   ========================================================================== */
export function LoadingScreen({
  progress,
  lang,
  onSkip,
}: {
  progress: number;
  lang: LanguageCode;
  onSkip: () => void;
}) {
  const dict = I18N_DICTIONARY[lang].loading;
  const statusText =
    progress < 35
      ? dict.initializing
      : progress < 75
        ? dict.buildingMesh
        : progress < 98
          ? dict.syncingGithub
          : dict.ready;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 md:p-14 surface-dominant"
    >
      <div className="w-full max-w-6xl flex items-center justify-between text-xs font-mono-code opacity-75">
        <span>JOÃO BARÃO · PORTFÓLIO 3D</span>
        <span>COIMBRA, PORTUGAL</span>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center text-center gap-6">
        <div className="font-display text-6xl md:text-8xl font-semibold tracking-tight font-mono-code">
          {Math.min(100, Math.round(progress))}%
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-card)]">
          <div
            className="h-full bg-[var(--color-accent-10)] transition-all duration-150"
            style={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>
        <p className="text-sm md:text-base opacity-85 min-h-[1.75rem]">{statusText}</p>
        <button
          type="button"
          onClick={onSkip}
          className="btn-secondary-matte text-xs mt-2"
        >
          {dict.skipButton}
        </button>
      </div>

      <div className="w-full max-w-6xl flex items-center justify-between text-xs font-mono-code opacity-60">
        <span>ISEC · ENGENHARIA INFORMÁTICA</span>
        <span>WEBGL / THREE.JS</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. TOP NAVBAR (Strict 3-Zone Top Bar Contract) + SECONDARY UTILITY BAR
   ========================================================================== */
export function TopNavbar({
  lang,
  activeSection,
  onNavigateHomeSection,
  onDownloadCv,
}: {
  lang: LanguageCode;
  activeSection: string;
  onNavigateHomeSection: (sectionId: string) => void;
  onDownloadCv: (cvLang: LanguageCode) => void;
}) {
  const dict = I18N_DICTIONARY[lang].nav;

  const navItems = [
    { id: 'hero', label: dict.home },
    { id: 'about', label: dict.about },
    { id: 'tech-stack', label: dict.techStack },
    { id: 'career', label: dict.career },
    { id: 'projects', label: dict.projects },
    { id: 'certifications', label: dict.certifications },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--surface-header)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHomeSection('hero');
          }}
          className="text-lg font-bold tracking-tight whitespace-nowrap shrink-0 fitts-target"
        >
          João Barão
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Navegação Principal" className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isCurrent = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHomeSection(item.id);
                }}
                className={`whitespace-nowrap shrink-0 py-2 transition-colors border-b-2 ${
                  isCurrent
                    ? 'border-[var(--color-accent-10)] font-semibold opacity-100'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onDownloadCv(lang)}
            className="btn-royal-iris whitespace-nowrap shrink-0"
          >
            {dict.ctaDownloadCv}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ==========================================================================
   4. FIXED SIDEBAR SOCIAL CONTACTS & ACCESSIBLE PREFERENCES RIBBON
   ========================================================================== */
export function ContactSidebar() {
  return (
    <aside
      aria-label="Contactos Sociais Diretos"
      className="hidden xl:flex fixed left-5 bottom-0 z-30 flex-col items-center gap-3"
    >
      <a
        href={PERSONAL_INFO.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub @JoaoBarao18"
        className="fitts-target rounded-lg border border-transparent hover:border-[var(--border-strong)] hover:bg-[var(--surface-card)] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      </a>
      <a
        href={PERSONAL_INFO.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn de João Barão"
        className="fitts-target rounded-lg border border-transparent hover:border-[var(--border-strong)] hover:bg-[var(--surface-card)] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
      <a
        href={`mailto:${PERSONAL_INFO.email}`}
        aria-label={`Enviar email para ${PERSONAL_INFO.email}`}
        className="fitts-target rounded-lg border border-transparent hover:border-[var(--border-strong)] hover:bg-[var(--surface-card)] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </a>
      <div className="w-px h-24 bg-[var(--border-strong)] mt-1" />
    </aside>
  );
}

/* ==========================================================================
   5. HERO SECTION WITH 3D FACE POINT CLOUD & UTILITY CONTROLS
   ========================================================================== */
export function HeroSection({
  lang,
  theme,
  palette,
  onToggleLanguage,
  onToggleTheme,
  onDownloadCv,
  onNavigateHomeSection,
  onNavigateRoute,
  onSceneProgress,
}: {
  lang: LanguageCode;
  theme: ThemeMode;
  palette: ThemePaletteConfig;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onDownloadCv: (cvLang: LanguageCode) => void;
  onNavigateHomeSection: (sectionId: string) => void;
  onNavigateRoute: (route: RoutePath) => void;
  onSceneProgress?: (percent: number) => void;
}) {
  const dict = I18N_DICTIONARY[lang].hero;
  const navDict = I18N_DICTIONARY[lang].nav;
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<Face3DController | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [wireframeOn, setWireframeOn] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);

  // Initialize Three.js scene once in isolated ref container
  useEffect(() => {
    if (!canvasMountRef.current) return;
    const ctrl = initFace3DScene(canvasMountRef.current, theme, (pct) => {
      onSceneProgress?.(pct);
    });
    controllerRef.current = ctrl;
    return () => {
      ctrl.dispose();
      controllerRef.current = null;
    };
  }, []);

  // Sync theme and custom 60-30-10 palette updates without tearing down canvas
  useEffect(() => {
    if (!controllerRef.current) return;
    controllerRef.current.setTheme(theme, {
      dominant60: theme === 'dark' ? palette.darkDominant60 : palette.lightDominant60,
      secondary30: theme === 'dark' ? palette.darkSecondary30 : palette.lightSecondary30,
      accent10: theme === 'dark' ? palette.darkAccent10 : palette.lightAccent10,
    });
  }, [theme, palette]);

  return (
    <section id="hero" className="relative pt-6 pb-16 md:pt-10 md:pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Workspace Utility Strip (Language Switch PT/EN, Theme Switch Light/Dark, Direct Email & Mobile Quick Nav) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-mono-code opacity-85">
          <span>{dict.kicker}</span>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${PERSONAL_INFO.email}`} className="underline hover:opacity-100">
            {PERSONAL_INFO.email}
          </a>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Circular Language Switcher (PT or EN) */}
          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label={navDict.langSwitch}
            className="w-11 h-11 rounded-full border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] flex items-center justify-center text-xs font-mono-code font-semibold transition-colors cursor-pointer shrink-0"
          >
            {lang === 'pt' ? 'PT' : 'EN'}
          </button>

          {/* Circular Light / Dark Mode Switcher (Sun or Moon icon only) */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? navDict.themeLight : navDict.themeDark}
            className="w-11 h-11 rounded-full border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            {theme === 'dark' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main Hero 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
        {/* Left Column: Editorial Typographic Hierarchy & CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="text-xs sm:text-sm font-mono-code tracking-wide opacity-80">
            {dict.roleBadge}
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.06]"
            style={{ textWrap: 'balance' }}
          >
            <span className="block text-2xl sm:text-3xl font-normal opacity-80 mb-2">
              {dict.greeting}
            </span>
            {PERSONAL_INFO.fullName}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed opacity-90 max-w-2xl">
            {PERSONAL_INFO.title[lang]}
          </p>

          <p className="text-sm sm:text-base leading-relaxed opacity-75 max-w-xl">
            {lang === 'pt'
              ? 'Arquitetura de sistemas Full-Stack e Backend em Java, Spring Boot, React.js, TypeScript e C/C++ — combinando rigor algorítmico no ISEC com prototipagem rápida em hackathons.'
              : 'Architecting Full-Stack and Backend systems in Java, Spring Boot, React.js, TypeScript, and C/C++ — combining algorithmic rigor at ISEC with rapid 48-hour hackathon execution.'}
          </p>

          {/* Action Buttons (Fitts's Law >= 44px height) */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => onDownloadCv(lang)}
              className="btn-royal-iris flex items-center gap-2.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{dict.primaryCta}</span>
            </button>

            <button
              type="button"
              onClick={() => onDownloadCv(lang === 'pt' ? 'en' : 'pt')}
              className="btn-secondary-matte"
            >
              {dict.secondaryCta}
            </button>

            <button
              type="button"
              onClick={() => onNavigateHomeSection('projects')}
              className="btn-secondary-matte"
            >
              {dict.exploreWorkCta}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Three.js 3D Face Point Cloud & Subtle Below-Card Controls */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative w-full h-[420px] sm:h-[490px] lg:h-[520px] rounded-2xl matte-card overflow-hidden">
            {/* Dedicated Empty Ref Container for WebGL Canvas */}
            <div
              ref={canvasMountRef}
              data-testid="face3d-canvas-container"
              className="absolute inset-0 w-full h-full z-0"
            />
          </div>

          {/* Subtle 3D Controls placed underneath the 3D portrait card */}
          <div className="mt-2.5 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              className="px-2.5 py-1 text-[11px] font-mono-code opacity-45 hover:opacity-85 transition-opacity cursor-pointer"
            >
              {dockCollapsed ? '▴ Controlos 3D' : '▾ Controlos 3D'}
            </button>

            {!dockCollapsed && (
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono-code opacity-60 hover:opacity-95 transition-opacity">
                <button
                  type="button"
                  onClick={() => {
                    const next = !isPaused;
                    setIsPaused(next);
                    controllerRef.current?.setPaused(next);
                  }}
                  className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--surface-card)] whitespace-nowrap cursor-pointer"
                >
                  {isPaused ? dict.resumeMotion : dict.pauseMotion}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (controllerRef.current) {
                      setWireframeOn(controllerRef.current.toggleWireframe());
                    }
                  }}
                  className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--surface-card)] whitespace-nowrap cursor-pointer"
                >
                  {dict.wireframeToggle}: {wireframeOn ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={() => controllerRef.current?.resetView()}
                  className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--surface-card)] whitespace-nowrap cursor-pointer"
                >
                  {dict.resetCamera}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   6. ABOUT ME SECTION (Editorial Monograph Layout)
   ========================================================================== */
export function AboutSection({ lang }: { lang: LanguageCode }) {
  const dict = I18N_DICTIONARY[lang].about;
  const paragraphs = PERSONAL_INFO.bio[lang].split('. ').reduce<string[]>((acc, sentence, i, arr) => {
    const groupIdx = Math.floor(i / 3);
    const formatted = sentence.endsWith('.') || i === arr.length - 1 ? sentence : `${sentence}.`;
    acc[groupIdx] = acc[groupIdx] ? `${acc[groupIdx]} ${formatted}` : formatted;
    return acc;
  }, []);

  return (
    <section id="about" className="py-16 md:py-24 surface-alt border-y border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-mono-code opacity-75">{dict.sectionIndex}</div>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {dict.heading}
            </h2>

            {/* Reference Portrait Card + Key Facts */}
            <div className="p-5 rounded-xl matte-card space-y-4 mt-4">
              <div className="flex items-center gap-4">
                <img
                  src="/face-reference.jpg"
                  alt={
                    lang === 'pt'
                      ? 'Fotografia de retrato de João Barão — Engenheiro Informático no ISEC'
                      : 'Portrait photograph of João Barão — Computer Science & Engineering Student at ISEC'
                  }
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover border border-[var(--border-strong)] shrink-0"
                />
                <div>
                  <div className="font-semibold text-lg">{PERSONAL_INFO.fullName}</div>
                  <div className="text-xs opacity-75">{PERSONAL_INFO.location}</div>
                  <div className="text-xs font-mono-code opacity-75 mt-1">GitHub: @{PERSONAL_INFO.githubUsername}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="opacity-65">{dict.educationLabel}: </span>
                  <span className="font-medium">{dict.educationValue}</span>
                </div>
                <div>
                  <span className="opacity-65">{dict.focusLabel}: </span>
                  <span className="font-medium">{dict.focusValue}</span>
                </div>
                <div>
                  <span className="opacity-65">{dict.locationLabel}: </span>
                  <span className="font-medium">{PERSONAL_INFO.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5 text-base sm:text-lg leading-relaxed opacity-90">
            {paragraphs.map((p, index) => (
              <p key={index}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   7. INVERTED PYRAMID TECH STACK SECTION (Matching Reference Image 1)
   ========================================================================== */
export function InvertedPyramidTechStack({
  lang,
}: {
  lang: LanguageCode;
}) {
  const dict = I18N_DICTIONARY[lang].techStack;
  const rows: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

  return (
    <section id="tech-stack" className="py-20 md:py-28 px-4 sm:px-8 max-w-7xl mx-auto pyramid-background-mesh">
      {/* Subtle Radial Geometric Wireframe SVG Background matching Reference Screenshot */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15 overflow-hidden">
        <svg width="900" height="650" viewBox="0 0 900 650" fill="none" stroke="currentColor" strokeWidth="0.75">
          <circle cx="450" cy="325" r="120" />
          <circle cx="450" cy="325" r="220" />
          <circle cx="450" cy="325" r="320" />
          <circle cx="450" cy="325" r="420" />
          <line x1="50" y1="325" x2="850" y2="325" />
          <line x1="450" y1="20" x2="450" y2="630" />
          <line x1="150" y1="80" x2="750" y2="570" />
          <line x1="750" y1="80" x2="150" y2="570" />
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="text-xs font-mono-code opacity-75">{dict.sectionIndex}</div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-widest uppercase">
          {dict.heading}
        </h2>
      </div>

      {/* Inverted Pyramid Rows (Row 1 = 9 items -> Row 2 = 7 items -> Row 3 = 6 items -> Row 4 = 5 items -> Row 5 = 3 items) */}
      <div className="relative z-10 flex flex-col items-center space-y-2.5">
        {rows.map((rowNum) => {
          const rowItems: TechItem[] = TECH_STACK_PYRAMID.filter((item) => item.row === rowNum);
          return (
            <div key={rowNum} className="pyramid-row">
              {rowItems.map((tech) => (
                <a
                  key={tech.id}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    lang === 'pt'
                      ? `Abrir página oficial de ${tech.name}`
                      : `Open official ${tech.name} website`
                  }
                  className="tech-tile"
                >
                  <TechStackIcon icon={tech.icon} />
                  <span className="text-[11px] font-medium leading-tight text-center truncate w-full">
                    {tech.name}
                  </span>
                </a>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ==========================================================================
   8. CAREER & EXPERIENCE TIMELINE (Matching Reference Image 2 + GSAP ScrollTrigger)
   ========================================================================== */
export function CareerTimelineSection({ lang }: { lang: LanguageCode }) {
  const dict = I18N_DICTIONARY[lang].career;
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0.35);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const total = rect.height;
      const scrolled = windowH * 0.65 - rect.top;
      const ratio = Math.max(0.15, Math.min(1, scrolled / Math.max(1, total)));
      setScrollProgress(ratio);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="career"
      ref={sectionRef}
      className="py-20 md:py-28 surface-alt border-y border-[var(--border-subtle)] career-timeline-wrapper"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Centered Header Matching Reference Image 2 ("My career & experience") */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-mono-code opacity-75">{dict.sectionIndex}</div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
            {dict.heading}
          </h2>
          <p className="text-sm sm:text-base opacity-80">{dict.subtitle}</p>
        </div>

        {/* Timeline Rows with Central Dynamic Vertical Line */}
        <div className="relative">
          {/* Desktop Central Vertical Track & Dynamic Accent Progress Bar with Subtle Glow */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-[2px] bg-[var(--border-subtle)]"
          >
            <div
              ref={progressBarRef}
              className="w-full bg-[var(--color-accent-10)] transition-all duration-150 relative career-line-glow"
              style={{ height: `${Math.round(scrollProgress * 100)}%` }}
            >
              {/* Glowing Node at the active tip of the timeline line */}
              <div className="w-4 h-4 rounded-full bg-[var(--color-accent-10)] border-2 border-[var(--text-primary)] absolute -bottom-2 left-1/2 -translate-x-1/2 career-node-glow" />
            </div>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] lg:divide-y-0">
            {CAREER_TIMELINE.map((item) => (
              <article key={item.id} className="career-row">
                {/* Column 1: Role Title & Organization Subtitle */}
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-semibold leading-snug">
                    {item.role[lang]}
                  </h3>
                  <div className="text-sm font-medium opacity-80">
                    {item.organization[lang]}
                  </div>
                  <div className="text-xs font-mono-code opacity-65">
                    {item.location} · {item.period[lang]}
                  </div>
                </div>

                {/* Column 2: Large Year Display ("2026", "NOW", "2024", "2023", "2022") */}
                <div className="lg:text-right flex items-center lg:justify-end">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-semibold font-mono-code tracking-tight opacity-90">
                    {item.year}
                  </span>
                </div>

                {/* Column 3: Exact Center Channel for the Vertical Line */}
                <div className="hidden lg:block" aria-hidden="true" />

                {/* Column 4: Detailed Engineering Description & Unboxed Highlights */}
                <div className="space-y-3">
                  <p className="text-sm sm:text-base leading-relaxed opacity-85">
                    {item.description[lang]}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-code opacity-75">
                    {item.highlights[lang].map((hl, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span aria-hidden="true">·</span>}
                        <span>{hl}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   9. CIRCULAR PROJECT CAROUSEL + "SEE FULL WORK" CTA (Hick's & Fitts's Law)
   ========================================================================== */
export function ProjectsCarouselSection({
  lang,
  projects,
  syncSource,
  onOpenFullWork,
  onTrackProjectClick,
}: {
  lang: LanguageCode;
  projects: PortfolioProject[];
  syncSource: 'syncing' | 'live' | 'fallback';
  onOpenFullWork: () => void;
  onTrackProjectClick: (projectName: string) => void;
}) {
  const dict = I18N_DICTIONARY[lang].projects;

  const carouselProjects = React.useMemo(() => {
    const featured = projects.filter((p) => p.featuredInCarousel);
    return featured.length > 0 ? featured : projects.slice(0, 5);
  }, [projects]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [carouselProjects.length]);

  const total = carouselProjects.length;
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + total) % Math.max(1, total));
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % Math.max(1, total));

  return (
    <section id="projects" className="py-20 md:py-28 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-mono-code opacity-75">{dict.sectionIndex}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight">
            {dict.heading}
          </h2>
        </div>
      </div>

      {/* Circular 3D/2D Interactive Carousel Stage */}
      <div className="carousel-stage my-4" role="region" aria-label="Carrossel Circular de Projetos">
        {carouselProjects.map((project, index) => {
          const tf = computeCarouselCardTransform(index, activeIndex, total);
          return (
            <article
              key={project.id}
              onClick={() => {
                if (!tf.isActive) setActiveIndex(index);
              }}
              style={{
                transform: `translateX(${tf.translateXPercent}%) translateZ(${tf.translateZPx}px) rotateY(${tf.rotateYDeg}deg) scale(${tf.scale})`,
                opacity: tf.opacity,
                zIndex: tf.zIndex,
                pointerEvents: Math.abs(tf.relativeOffset) <= 1 ? 'auto' : 'none',
              }}
              className={`carousel-card-item rounded-2xl p-6 ${
                tf.isActive ? 'border-[var(--color-accent-10)]' : 'cursor-pointer'
              }`}
            >
              <div>
                <div className="w-full h-44 rounded-xl overflow-hidden mb-4 border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shrink-0">
                  <img
                    src={project.previewSvg}
                    alt={`${project.title[lang]} — ${project.techStack.join(', ')}`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover block"
                  />
                </div>

                {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                <div className="flex items-center gap-2 text-xs font-mono-code opacity-75 mb-1.5 truncate">
                  <span>{project.language}</span>
                  {project.isCvHighlight && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{dict.featuredTag}</span>
                    </>
                  )}
                  {project.hasPages && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{dict.githubPagesTag}</span>
                    </>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-semibold leading-snug mb-2 line-clamp-2 min-h-[3.25rem]">
                  {project.title[lang]}
                </h3>
                <p className="text-sm opacity-85 line-clamp-3 min-h-[3.9rem]">
                  {project.description[lang]}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] mt-auto">
                {/* Tech Stack Unboxed Separator List */}
                <div className="text-xs font-mono-code opacity-75 truncate mb-3.5">
                  {project.techStack.join(' · ')}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onTrackProjectClick(project.name)}
                    className="btn-royal-iris text-xs"
                  >
                    {dict.viewRepo}
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onTrackProjectClick(`${project.name}-live`)}
                      className="btn-secondary-matte text-xs"
                    >
                      {dict.liveDemo}
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Carousel Controls (Generous Fitts's Law Touch Targets >= 44x44px) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={dict.prevProject}
            className="btn-secondary-matte fitts-target px-4"
          >
            ← {dict.prevProject}
          </button>
          <span className="text-sm font-mono-code px-3">
            {total > 0 ? activeIndex + 1 : 0} / {total}
          </span>
          <button
            type="button"
            onClick={handleNext}
            aria-label={dict.nextProject}
            className="btn-secondary-matte fitts-target px-4"
          >
            {dict.nextProject} →
          </button>
        </div>

        {/* Single Clear CTA to Open Full Work Archive (Hick's Law) */}
        <button
          type="button"
          onClick={onOpenFullWork}
          className="btn-royal-iris px-6 py-3 text-sm font-semibold"
        >
          {dict.seeFullWork} ({projects.length}) →
        </button>
      </div>
    </section>
  );
}

/* ==========================================================================
   10. FULL WORK ARCHIVE VIEW ("See Full Work")
   ========================================================================== */
export function FullWorkView({
  lang,
  projects,
  onBackToLanding,
  onTrackProjectClick,
}: {
  lang: LanguageCode;
  projects: PortfolioProject[];
  onBackToLanding: () => void;
  onTrackProjectClick: (projectName: string) => void;
}) {
  const dict = I18N_DICTIONARY[lang].projects;
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = ['Java', 'Spring Boot', 'React.js', 'TypeScript', 'C (POSIX)', 'Supabase', 'JavaFX'];
  const visibleProjects = filterProjects(projects, selectedTech, searchQuery, lang);

  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 max-w-7xl mx-auto min-h-[80vh]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button type="button" onClick={onBackToLanding} className="btn-secondary-matte text-xs">
          ← {dict.backToLanding}
        </button>
        <span className="text-xs font-mono-code opacity-75">
          GITHUB: @{PERSONAL_INFO.githubUsername} · {visibleProjects.length} / {projects.length}
        </span>
      </div>

      <div className="max-w-3xl space-y-3 mb-10">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold">{dict.fullWorkTitle}</h1>
        <p className="text-base opacity-85">{dict.fullWorkSubtitle}</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 p-4 rounded-xl matte-card">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedTech(null)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors fitts-target ${
              selectedTech === null
                ? 'bg-[var(--color-accent-10)] text-[var(--text-on-accent)]'
                : 'hover:bg-[var(--surface-card-hover)]'
            }`}
          >
            {dict.allFilter}
          </button>
          {filterTabs.map((tab) => {
            const active = selectedTech?.toLowerCase() === tab.toLowerCase();
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTech(active ? null : tab)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors fitts-target ${
                  active
                    ? 'bg-[var(--color-accent-10)] text-[var(--text-on-accent)]'
                    : 'hover:bg-[var(--surface-card-hover)]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="w-full lg:w-80">
          <label htmlFor="project-archive-search" className="sr-only">
            {dict.searchPlaceholder}
          </label>
          <input
            id="project-archive-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-full px-4 py-2.5 rounded-lg text-sm bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:opacity-55"
          />
        </div>
      </div>

      {/* Responsive Project Cards Grid */}
      {visibleProjects.length === 0 ? (
        <div className="p-12 rounded-2xl matte-card text-center space-y-4">
          <p className="text-lg opacity-85">{dict.noProjectsFound}</p>
          <button
            type="button"
            onClick={() => {
              setSelectedTech(null);
              setSearchQuery('');
            }}
            className="btn-royal-iris text-xs"
          >
            {dict.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project) => (
            <article key={project.id} className="rounded-2xl p-6 matte-card flex flex-col justify-between">
              <div>
                <div className="w-full h-44 rounded-xl overflow-hidden mb-4 border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shrink-0">
                  <img
                    src={project.previewSvg}
                    alt={`${project.title[lang]} — ${project.language}`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover block"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs font-mono-code opacity-75 mb-1.5 truncate">
                  <span>{project.language}</span>
                  {project.isCvHighlight && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{dict.featuredTag}</span>
                    </>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-semibold leading-snug mb-2 line-clamp-2 min-h-[3.25rem]">
                  {project.title[lang]}
                </h2>
                <p className="text-sm opacity-85 line-clamp-3 min-h-[3.9rem] mb-4">
                  {project.description[lang]}
                </p>

                {project.highlights[lang] && project.highlights[lang].length > 0 && (
                  <ul className="space-y-1.5 text-xs opacity-80 mb-5 list-disc list-inside">
                    {project.highlights[lang].slice(0, 3).map((hl, idx) => (
                      <li key={idx} className="line-clamp-2">{hl}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3.5 mt-auto">
                <div className="text-xs font-mono-code opacity-75 truncate">{project.techStack.join(' · ')}</div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onTrackProjectClick(project.name)}
                    className="btn-royal-iris text-xs"
                  >
                    {dict.viewRepo}
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onTrackProjectClick(`${project.name}-live`)}
                      className="btn-secondary-matte text-xs"
                    >
                      {dict.liveDemo}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   11. CERTIFICATIONS & LANGUAGES SECTION (3 Essential Elements + Lightbox)
   ========================================================================== */
export function CertificationsAndLanguagesSection({
  lang,
  certifications,
  spokenLanguages,
}: {
  lang: LanguageCode;
  certifications: CertificationItem[];
  spokenLanguages: SpokenLanguageItem[];
}) {
  const dict = I18N_DICTIONARY[lang].certifications;
  const [lightboxCert, setLightboxCert] = useState<CertificationItem | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxCert(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <section
      id="certifications"
      className="py-20 md:py-28 surface-alt border-y border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-2xl space-y-2 mb-12">
          <div className="text-xs font-mono-code opacity-75">{dict.sectionIndex}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold">{dict.heading}</h2>
        </div>

        {/* Sub-section 1: Certifications (Strictly the 3 requested elements: Photo, Name, Completion Date) */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <article key={cert.id} className="rounded-2xl p-5 matte-card flex flex-col justify-between">
                {/* 1. Foto / Imagem do Certificado com Lightbox */}
                <button
                  type="button"
                  onClick={() => setLightboxCert(cert)}
                  aria-label={`${dict.openLightbox}: ${cert.name[lang]}`}
                  className="w-full h-48 rounded-xl overflow-hidden border border-[var(--border-subtle)] mb-4 group relative cursor-pointer"
                >
                  <img
                    src={cert.image}
                    alt={`Certificado: ${cert.name[lang]} (${cert.date})`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 block"
                  />
                  <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded text-[11px] font-mono-code bg-[var(--surface-header)] border border-[var(--border-subtle)]">
                    🔍 Lightbox
                  </span>
                </button>

                {/* 2. Nome da Certificação */}
                <h4 className="text-base sm:text-lg font-semibold leading-snug mb-2">
                  {cert.name[lang]}
                </h4>

                {/* 3. Data de Conclusão (Mês/Ano) */}
                <div className="text-xs font-mono-code opacity-75 pt-2 border-t border-[var(--border-subtle)]">
                  {dict.completedIn} {cert.date}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Sub-section 2: Spoken Languages (Strictly the 2 requested elements: Language & Proficiency Level) */}
        <div>
          <h3 className="text-xl font-semibold mb-6">{dict.langsSubheading}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spokenLanguages.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl matte-card flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  {/* 1. Língua */}
                  <span className="text-xl font-semibold">{item.language[lang]}</span>
                  {/* 2. Nível de Proficiência */}
                  <span className="text-sm font-mono-code opacity-85">{item.level[lang]}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-accent-10)]"
                    style={{ width: `${item.proficiencyPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Certificate Lightbox Modal */}
      {lightboxCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxCert.name[lang]}
          onClick={() => setLightboxCert(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full rounded-2xl p-6 surface-dominant border border-[var(--border-strong)] space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{lightboxCert.name[lang]}</h3>
                <p className="text-xs font-mono-code opacity-75">
                  {dict.completedIn} {lightboxCert.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxCert(null)}
                aria-label={dict.closeLightbox}
                className="btn-secondary-matte text-xs"
              >
                ✕ {dict.closeLightbox}
              </button>
            </div>
            <div className="w-full rounded-xl overflow-hidden border border-[var(--border-subtle)]">
              <img
                src={lightboxCert.image}
                alt={`Certificado ampliado: ${lightboxCert.name[lang]}`}
                className="w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   12. CONTACT SECTION & FOOTER (With Physical Address Coimbra, Portugal)
   ========================================================================== */
export function ContactAndFooterSection({
  lang,
  onDownloadCv,
  onNavigateRoute,
  onOpenCookieSettings,
}: {
  lang: LanguageCode;
  onDownloadCv: (cvLang: LanguageCode) => void;
  onNavigateRoute: (route: RoutePath) => void;
  onOpenCookieSettings: () => void;
}) {
  const dict = I18N_DICTIONARY[lang].contact;
  const footerDict = I18N_DICTIONARY[lang].footer;

  return (
    <>
      <section id="contact" className="py-20 md:py-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl p-8 sm:p-12 matte-card grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-mono-code opacity-75">{dict.sectionIndex}</div>
            <h2
              className="font-display text-3xl sm:text-5xl font-semibold leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {dict.heading}
            </h2>
            <p className="text-sm sm:text-base opacity-85 max-w-2xl">{dict.subtitle}</p>

            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <a href={`mailto:${PERSONAL_INFO.email}`} className="btn-royal-iris">
                ✉ {dict.sendEmailCta}
              </a>
              <button
                type="button"
                onClick={() => onDownloadCv('pt')}
                className="btn-secondary-matte"
              >
                {dict.downloadCvPt}
              </button>
              <button
                type="button"
                onClick={() => onDownloadCv('en')}
                className="btn-secondary-matte"
              >
                {dict.downloadCvEn}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 p-6 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
            <div>
              <div className="text-xs font-mono-code opacity-65">{dict.emailLabel}</div>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="text-base sm:text-lg font-semibold underline"
              >
                {PERSONAL_INFO.email}
              </a>
            </div>
            <div>
              <div className="text-xs font-mono-code opacity-65">{dict.locationLabel}</div>
              <div className="text-base font-medium">{PERSONAL_INFO.location}</div>
            </div>
            <div>
              <div className="text-xs font-mono-code opacity-65">GitHub &amp; LinkedIn</div>
              <div className="flex items-center gap-4 text-sm font-mono-code pt-1">
                <a
                  href={PERSONAL_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  github.com/JoaoBarao18
                </a>
                <span>·</span>
                <a
                  href={PERSONAL_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border-subtle)] py-10 px-4 sm:px-8 surface-alt">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm opacity-80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{PERSONAL_INFO.fullName}</span>
            <span aria-hidden="true">·</span>
            <address className="not-italic">{PERSONAL_INFO.location}</address>
            <span aria-hidden="true">·</span>
            <span>
              © {new Date().getFullYear()} {footerDict.rights}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onNavigateRoute('privacy')}
              className="hover:underline fitts-target"
            >
              {footerDict.privacyLink}
            </button>
            <button
              type="button"
              onClick={() => onNavigateRoute('terms')}
              className="hover:underline fitts-target"
            >
              {footerDict.termsLink}
            </button>
            <button
              type="button"
              onClick={onOpenCookieSettings}
              className="hover:underline fitts-target"
            >
              {footerDict.cookiesLink}
            </button>
            <button
              type="button"
              onClick={() => onNavigateRoute('admin')}
              aria-label="Aceder ao Painel de Administração"
              className="hover:underline fitts-target flex items-center gap-1 font-mono-code"
            >
              <span>🔒</span>
              <span>{footerDict.adminLink}</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ==========================================================================
   13. THANK YOU VIEW (Post-CV Download Closure Dialog — Shneiderman's Rule 4)
   ========================================================================== */
export function ThankYouView({
  lang,
  onDownloadCvAgain,
  onBackHome,
}: {
  lang: LanguageCode;
  onDownloadCvAgain: (cvLang: LanguageCode) => void;
  onBackHome: () => void;
}) {
  const dict = I18N_DICTIONARY[lang].thankYou;

  return (
    <section className="py-20 md:py-28 px-4 sm:px-8 max-w-3xl mx-auto min-h-[75vh] flex flex-col justify-center">
      <div className="rounded-2xl p-8 sm:p-12 matte-card space-y-6 text-center">
        <div className="text-xs font-mono-code opacity-80">{dict.kicker}</div>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold">{dict.heading}</h1>
        <p className="text-base leading-relaxed opacity-85">{dict.message}</p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
          <a
            href={PERSONAL_INFO.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-royal-iris"
          >
            {dict.connectLinkedin}
          </a>
          <a href={`mailto:${PERSONAL_INFO.email}`} className="btn-secondary-matte">
            {dict.sendDirectEmail}
          </a>
          <button
            type="button"
            onClick={() => onDownloadCvAgain('pt')}
            className="btn-secondary-matte text-xs"
          >
            {dict.downloadAgainPt}
          </button>
          <button
            type="button"
            onClick={() => onDownloadCvAgain('en')}
            className="btn-secondary-matte text-xs"
          >
            {dict.downloadAgainEn}
          </button>
        </div>

        <div className="pt-6 border-t border-[var(--border-subtle)]">
          <button type="button" onClick={onBackHome} className="text-sm underline fitts-target">
            ← {dict.backHome}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   14. LEGAL VIEW (GDPR Privacy Policy & Terms of Use)
   ========================================================================== */
export function LegalView({
  lang,
  mode,
  onBackHome,
}: {
  lang: LanguageCode;
  mode: 'privacy' | 'terms';
  onBackHome: () => void;
}) {
  const dict = I18N_DICTIONARY[lang].legal;
  const title = mode === 'privacy' ? dict.privacyTitle : dict.termsTitle;
  const updated = mode === 'privacy' ? dict.privacyUpdated : dict.termsUpdated;
  const sections = mode === 'privacy' ? dict.privacySections : dict.termsSections;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-8 max-w-4xl mx-auto min-h-[75vh]">
      <button type="button" onClick={onBackHome} className="btn-secondary-matte text-xs mb-8">
        ← {dict.backButton}
      </button>

      <div className="rounded-2xl p-8 sm:p-12 matte-card space-y-6">
        <div className="border-b border-[var(--border-subtle)] pb-4">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">{title}</h1>
          <p className="text-xs font-mono-code opacity-70 mt-1">{updated}</p>
        </div>

        <div className="space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h2 className="text-lg font-semibold">{sec.h}</h2>
              <p className="text-sm sm:text-base leading-relaxed opacity-85">{sec.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   15. CUSTOM 404 PAGE VIEW
   ========================================================================== */
export function NotFound404View({
  lang,
  onBackHome,
}: {
  lang: LanguageCode;
  onBackHome: () => void;
}) {
  const dict = I18N_DICTIONARY[lang].notFound;

  return (
    <section className="py-20 md:py-28 px-4 sm:px-8 max-w-3xl mx-auto min-h-[75vh] flex flex-col justify-center text-center">
      <div className="rounded-2xl p-10 matte-card space-y-5">
        <div className="text-xs font-mono-code opacity-75">{dict.code}</div>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold">{dict.heading}</h1>
        <p className="text-base opacity-85 max-w-lg mx-auto">{dict.message}</p>
        <div className="pt-4">
          <button type="button" onClick={onBackHome} className="btn-royal-iris">
            ← {dict.backHome}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   16. ADMIN DASHBOARD VIEW (/admin — Certifications, Languages, Projects & 60-30-10 Palette)
   ========================================================================== */
export function AdminDashboardView({
  lang,
  certifications,
  spokenLanguages,
  projects,
  palette,
  onUpdateCertifications,
  onUpdateLanguages,
  onUpdateProjects,
  onUpdatePalette,
  onResetAllDefaults,
  onBackHome,
}: {
  lang: LanguageCode;
  certifications: CertificationItem[];
  spokenLanguages: SpokenLanguageItem[];
  projects: PortfolioProject[];
  palette: ThemePaletteConfig;
  onUpdateCertifications: (next: CertificationItem[]) => void;
  onUpdateLanguages: (next: SpokenLanguageItem[]) => void;
  onUpdateProjects: (next: PortfolioProject[]) => void;
  onUpdatePalette: (next: ThemePaletteConfig) => void;
  onResetAllDefaults: () => void;
  onBackHome: () => void;
}) {
  const dict = I18N_DICTIONARY[lang].admin;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('jb_admin_auth') === '1';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [saveBanner, setSaveBanner] = useState('');

  // Certification Form State (Strictly: Name, Photo, Date)
  const [certNamePt, setCertNamePt] = useState('');
  const [certNameEn, setCertNameEn] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certImage, setCertImage] = useState('');

  // Spoken Language Form State (Strictly: Language, Level)
  const [langNamePt, setLangNamePt] = useState('');
  const [langNameEn, setLangNameEn] = useState('');
  const [langLevelPt, setLangLevelPt] = useState('');
  const [langLevelEn, setLangLevelEn] = useState('');

  // Palette Form State
  const [draftPalette, setDraftPalette] = useState<ThemePaletteConfig>(palette);

  // Manual Repository / Project Form State (Add & Edit)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitlePt, setProjTitlePt] = useState('');
  const [projTitleEn, setProjTitleEn] = useState('');
  const [projDescPt, setProjDescPt] = useState('');
  const [projDescEn, setProjDescEn] = useState('');
  const [projLanguage, setProjLanguage] = useState('');
  const [projTechStack, setProjTechStack] = useState('');
  const [projRepoUrl, setProjRepoUrl] = useState('');
  const [projLiveUrl, setProjLiveUrl] = useState('');
  const [projImage, setProjImage] = useState('');
  const [projInCarousel, setProjInCarousel] = useState(true);

  const showClosureMessage = () => {
    setSaveBanner(dict.savedSuccess);
    setTimeout(() => setSaveBanner(''), 4000);
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjTitlePt('');
    setProjTitleEn('');
    setProjDescPt('');
    setProjDescEn('');
    setProjLanguage('');
    setProjTechStack('');
    setProjRepoUrl('');
    setProjLiveUrl('');
    setProjImage('');
    setProjInCarousel(true);
  };

  const handleStartEditProject = (p: PortfolioProject) => {
    setEditingProjectId(p.id);
    setProjTitlePt(p.title.pt);
    setProjTitleEn(p.title.en);
    setProjDescPt(p.description.pt);
    setProjDescEn(p.description.en);
    setProjLanguage(p.language);
    setProjTechStack(p.techStack.join(', '));
    setProjRepoUrl(p.repoUrl);
    setProjLiveUrl(p.liveUrl || '');
    setProjImage(p.previewSvg.startsWith('data:image/svg+xml') ? '' : p.previewSvg);
    setProjInCarousel(p.featuredInCarousel);
  };

  const handleNewProjectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProjImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitlePt.trim() || !projDescPt.trim()) return;

    const cleanTitlePt = projTitlePt.trim();
    const cleanTitleEn = projTitleEn.trim() || cleanTitlePt;
    const cleanDescPt = projDescPt.trim();
    const cleanDescEn = projDescEn.trim() || cleanDescPt;
    const cleanLang = projLanguage.trim() || 'TypeScript';
    const parsedStack = projTechStack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const finalStack = parsedStack.length > 0 ? parsedStack : [cleanLang];
    const cleanRepo = projRepoUrl.trim() || 'https://github.com/JoaoBarao18';
    const cleanLive = projLiveUrl.trim() ? projLiveUrl.trim() : null;

    if (editingProjectId) {
      const updated = projects.map((p) => {
        if (p.id !== editingProjectId) return p;
        const nextPreview =
          projImage.trim().length > 0
            ? projImage.trim()
            : p.previewSvg.startsWith('data:image/svg+xml')
              ? generateProjectPreviewSvg(
                  cleanTitleEn.slice(0, 32),
                  cleanDescEn.slice(0, 56),
                  finalStack,
                  cleanLang.toUpperCase().slice(0, 12)
                )
              : p.previewSvg;

        return {
          ...p,
          name: cleanTitlePt.split('—')[0].trim(),
          title: { pt: cleanTitlePt, en: cleanTitleEn },
          description: { pt: cleanDescPt, en: cleanDescEn },
          language: cleanLang,
          techStack: finalStack,
          repoUrl: cleanRepo,
          liveUrl: cleanLive,
          hasPages: Boolean(cleanLive),
          featuredInCarousel: projInCarousel,
          previewSvg: nextPreview,
        };
      });
      onUpdateProjects(updated);
    } else {
      const generatedCover =
        projImage.trim().length > 0
          ? projImage.trim()
          : generateProjectPreviewSvg(
              cleanTitleEn.slice(0, 32),
              cleanDescEn.slice(0, 56),
              finalStack,
              cleanLang.toUpperCase().slice(0, 12)
            );

      const newProj: PortfolioProject = {
        id: `manual-proj-${Date.now()}`,
        name: cleanTitlePt.split('—')[0].trim(),
        title: { pt: cleanTitlePt, en: cleanTitleEn },
        description: { pt: cleanDescPt, en: cleanDescEn },
        highlights: {
          pt: [cleanDescPt],
          en: [cleanDescEn],
        },
        techStack: finalStack,
        language: cleanLang,
        repoUrl: cleanRepo,
        liveUrl: cleanLive,
        hasPages: Boolean(cleanLive),
        featuredInCarousel: projInCarousel,
        isCvHighlight: true,
        updatedAt: new Date().toISOString(),
        stars: 1,
        previewSvg: generatedCover,
      };
      onUpdateProjects([newProj, ...projects]);
    }

    resetProjectForm();
    showClosureMessage();
  };

  const handleDeleteProject = (projectId: string) => {
    const updated = projects.filter((p) => p.id !== projectId);
    onUpdateProjects(updated);
    if (editingProjectId === projectId) {
      resetProjectForm();
    }
    showClosureMessage();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await verifyAdminCredentials(passwordInput);
    if (ok) {
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
      try {
        sessionStorage.setItem('jb_admin_auth', '1');
      } catch {
        // Ignore storage error
      }
    } else {
      setAuthError(dict.invalidPassword);
    }
  };

  const handleCertFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCertImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNamePt.trim() || !certDate.trim()) return;
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: {
        pt: certNamePt.trim(),
        en: certNameEn.trim() || certNamePt.trim(),
      },
      date: certDate.trim(),
      issuer: 'João Barão Portfolio',
      image: certImage.trim() || '/og-image.jpg',
    };
    onUpdateCertifications([newCert, ...certifications]);
    setCertNamePt('');
    setCertNameEn('');
    setCertDate('');
    setCertImage('');
    showClosureMessage();
  };

  const handleDeleteCertification = (id: string) => {
    onUpdateCertifications(certifications.filter((c) => c.id !== id));
    showClosureMessage();
  };

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!langNamePt.trim() || !langLevelPt.trim()) return;
    const newLang: SpokenLanguageItem = {
      id: `lang-${Date.now()}`,
      language: {
        pt: langNamePt.trim(),
        en: langNameEn.trim() || langNamePt.trim(),
      },
      level: {
        pt: langLevelPt.trim(),
        en: langLevelEn.trim() || langLevelPt.trim(),
      },
      code: langNamePt.trim().slice(0, 2).toUpperCase(),
      proficiencyPercent: 85,
    };
    onUpdateLanguages([...spokenLanguages, newLang]);
    setLangNamePt('');
    setLangNameEn('');
    setLangLevelPt('');
    setLangLevelEn('');
    showClosureMessage();
  };

  const handleDeleteLanguage = (id: string) => {
    onUpdateLanguages(spokenLanguages.filter((l) => l.id !== id));
    showClosureMessage();
  };

  const handleToggleProjectCarousel = (projectId: string) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, featuredInCarousel: !p.featuredInCarousel } : p
    );
    onUpdateProjects(updated);
    showClosureMessage();
  };

  const handleProjectImageUpload = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = projects.map((p) =>
          p.id === projectId ? { ...p, previewSvg: reader.result as string } : p
        );
        onUpdateProjects(updated);
        showClosureMessage();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProjectImageUrlChange = (projectId: string, newUrl: string) => {
    if (!newUrl.trim()) return;
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, previewSvg: newUrl.trim() } : p
    );
    onUpdateProjects(updated);
    showClosureMessage();
  };

  const handleSavePalette = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeThemePalette(draftPalette);
    setDraftPalette(clean);
    onUpdatePalette(clean);
    showClosureMessage();
  };

  const handleExportPortfolioJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      owner: PERSONAL_INFO.fullName,
      palette,
      certifications,
      spokenLanguages,
      projects,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <section className="py-20 px-4 sm:px-8 max-w-lg mx-auto min-h-[75vh] flex flex-col justify-center">
        <button type="button" onClick={onBackHome} className="btn-secondary-matte text-xs mb-6 self-start">
          ← {I18N_DICTIONARY[lang].legal.backButton}
        </button>

        <form onSubmit={handleLogin} className="rounded-2xl p-8 matte-card space-y-5">
          <h1 className="font-display text-3xl font-semibold">{dict.loginHeading}</h1>
          <p className="text-xs opacity-80">{dict.loginHint}</p>

          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="block text-xs font-mono-code">
              {dict.passwordLabel}
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-sm"
            />
          </div>

          {authError && (
            <p role="alert" className="text-xs font-mono-code text-amber-300">
              {authError}
            </p>
          )}

          <button type="submit" className="btn-royal-iris w-full">
            {dict.loginButton}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">{dict.title}</h1>
          <p className="text-sm opacity-80">{dict.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={handleExportPortfolioJson} className="btn-royal-iris text-xs">
            ⬇ {dict.exportJson}
          </button>
          <button type="button" onClick={onResetAllDefaults} className="btn-secondary-matte text-xs">
            {dict.resetDefaults}
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem('jb_admin_auth');
              setIsAuthenticated(false);
            }}
            className="btn-secondary-matte text-xs"
          >
            {dict.logoutButton}
          </button>
          <button type="button" onClick={onBackHome} className="btn-secondary-matte text-xs">
            ← {I18N_DICTIONARY[lang].legal.backButton}
          </button>
        </div>
      </div>

      {saveBanner && (
        <div role="status" className="p-4 rounded-xl bg-[var(--color-accent-10)] text-[var(--text-on-accent)] text-sm font-medium">
          ✓ {saveBanner}
        </div>
      )}

      {/* 1. Manual Repositories & Projects Manager (Full CRUD: Add, Edit, Remove, Cover Image, Carousel Toggle) */}
      <div className="rounded-2xl p-6 sm:p-8 matte-card space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">
            {lang === 'pt'
              ? 'Gestor Manual de Repositórios & Projetos (Adicionar, Editar e Retirar)'
              : 'Manual Repositories & Projects Manager (Add, Edit & Remove)'}
          </h2>
          <p className="text-xs opacity-75">
            {lang === 'pt'
              ? 'Adicione os seus repositórios manualmente com controlo total sobre título, descrição, links, tecnologias e imagem de capa, ou edite/remova qualquer projeto existente.'
              : 'Add your repositories manually with full control over title, description, links, tech stack, and cover image, or edit/remove any existing project.'}
          </p>
        </div>

        <form onSubmit={handleSaveProjectForm} className="p-5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-4">
          <div className="text-sm font-semibold">
            {editingProjectId
              ? lang === 'pt'
                ? '✏️ A Editar Repositório / Projeto'
                : '✏️ Editing Repository / Project'
              : lang === 'pt'
                ? '+ Adicionar Novo Repositório / Projeto'
                : '+ Add New Repository / Project'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="proj-title-pt" className="block text-xs font-mono-code mb-1">
                {lang === 'pt' ? 'Título do Projeto (PT) *' : 'Project Title (PT) *'}
              </label>
              <input
                id="proj-title-pt"
                type="text"
                required
                placeholder="Ex: Saber+ — Plataforma Académica com IA"
                value={projTitlePt}
                onChange={(e) => setProjTitlePt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-sm"
              />
            </div>

            <div>
              <label htmlFor="proj-title-en" className="block text-xs font-mono-code mb-1">
                {lang === 'pt' ? 'Título do Projeto (EN)' : 'Project Title (EN)'}
              </label>
              <input
                id="proj-title-en"
                type="text"
                placeholder="Ex: Saber+ — AI Academic Platform"
                value={projTitleEn}
                onChange={(e) => setProjTitleEn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="proj-desc-pt" className="block text-xs font-mono-code mb-1">
                {lang === 'pt' ? 'Descrição do Projeto (PT) *' : 'Project Description (PT) *'}
              </label>
              <textarea
                id="proj-desc-pt"
                rows={3}
                required
                placeholder="Resumo claro do projeto e principais funcionalidades..."
                value={projDescPt}
                onChange={(e) => setProjDescPt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-sm"
              />
            </div>

            <div>
              <label htmlFor="proj-desc-en" className="block text-xs font-mono-code mb-1">
                {lang === 'pt' ? 'Descrição do Projeto (EN)' : 'Project Description (EN)'}
              </label>
              <textarea
                id="proj-desc-en"
                rows={3}
                placeholder="Clear summary of the project and key architecture..."
                value={projDescEn}
                onChange={(e) => setProjDescEn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="proj-lang" className="block text-xs font-mono-code mb-1">
                {lang === 'pt' ? 'Linguagem Principal' : 'Primary Language'}
              </label>
              <input
                id="proj-lang"
                type="text"
                placeholder="Ex: Java / React.js"
                value={projLanguage}
                onChange={(e) => setProjLanguage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-sm"
              />
            </div>

            <div>
              <label htmlFor="proj-stack" className="block text-xs font-mono-code mb-1">
                {lang === 'pt' ? 'Tecnologias (separadas por vírgula)' : 'Tech Stack (comma-separated)'}
              </label>
              <input
                id="proj-stack"
                type="text"
                placeholder="Java, Spring Boot, React.js, SQL"
                value={projTechStack}
                onChange={(e) => setProjTechStack(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-sm"
              />
            </div>

            <div>
              <label htmlFor="proj-repo-url" className="block text-xs font-mono-code mb-1">
                {lang === 'pt' ? 'URL do Repositório GitHub *' : 'GitHub Repository URL *'}
              </label>
              <input
                id="proj-repo-url"
                type="url"
                required
                placeholder="https://github.com/JoaoBarao18/..."
                value={projRepoUrl}
                onChange={(e) => setProjRepoUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-sm"
              />
            </div>

            <div>
              <label htmlFor="proj-live-url" className="block text-xs font-mono-code mb-1">
                {lang === 'pt' ? 'URL Live Demo (Opcional)' : 'Live Demo URL (Optional)'}
              </label>
              <input
                id="proj-live-url"
                type="url"
                placeholder="https://..."
                value={projLiveUrl}
                onChange={(e) => setProjLiveUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <label className="px-3 py-2 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-strong)] cursor-pointer font-mono-code text-xs bg-[var(--color-dominant-60)]">
                📷 Upload Imagem de Capa
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewProjectFileUpload}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                placeholder={lang === 'pt' ? 'Ou cole URL de imagem (vazio = capa automática)' : 'Or paste image URL (empty = auto cover)'}
                value={projImage}
                onChange={(e) => setProjImage(e.target.value)}
                className="flex-1 min-w-[200px] px-3.5 py-2 rounded-lg bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-code">
                <input
                  type="checkbox"
                  checked={projInCarousel}
                  onChange={(e) => setProjInCarousel(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>{lang === 'pt' ? 'Mostrar no Carrossel Principal' : 'Show in Main Carousel'}</span>
              </label>

              <div className="flex items-center gap-2">
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="btn-secondary-matte text-xs"
                  >
                    {lang === 'pt' ? 'Cancelar' : 'Cancel'}
                  </button>
                )}
                <button type="submit" className="btn-royal-iris text-xs">
                  {editingProjectId
                    ? lang === 'pt'
                      ? 'Guardar Alterações'
                      : 'Save Changes'
                    : lang === 'pt'
                      ? '+ Adicionar Repositório'
                      : '+ Add Repository'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Current Repositories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.previewSvg}
                    alt={p.title[lang]}
                    className="w-16 h-11 rounded object-cover border border-[var(--border-subtle)] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{p.title[lang]}</div>
                    <div className="font-mono-code opacity-70 truncate">
                      {p.language} · {p.techStack.slice(0, 3).join(', ')}
                    </div>
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono-code underline opacity-75 hover:opacity-100 truncate block"
                    >
                      {p.repoUrl}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEditProject(p)}
                    className="px-2.5 py-1.5 rounded border border-[var(--border-subtle)] hover:border-[var(--border-strong)] cursor-pointer font-mono-code"
                  >
                    {lang === 'pt' ? 'Editar' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(p.id)}
                    aria-label={`Remover projeto ${p.title[lang]}`}
                    className="px-2.5 py-1.5 rounded border border-[var(--border-subtle)] hover:border-red-400 text-red-300 cursor-pointer font-mono-code"
                  >
                    {lang === 'pt' ? 'Remover' : 'Remove'}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[var(--border-subtle)]">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <label className="px-2.5 py-1 rounded border border-[var(--border-subtle)] hover:border-[var(--border-strong)] cursor-pointer font-mono-code text-[11px]">
                    📷 Upload Capa
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProjectImageUpload(p.id, e)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    placeholder={lang === 'pt' ? 'Colar URL da capa + Enter...' : 'Paste cover URL + Enter...'}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleProjectImageUrlChange(p.id, (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="flex-1 min-w-[140px] px-2.5 py-1 rounded bg-[var(--color-dominant-60)] border border-[var(--border-subtle)] text-[11px]"
                  />
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer shrink-0 font-mono-code">
                  <span>Carrossel</span>
                  <input
                    type="checkbox"
                    checked={p.featuredInCarousel}
                    onChange={() => handleToggleProjectCarousel(p.id)}
                    className="w-4 h-4"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Certifications CRUD */}
        <div className="rounded-2xl p-6 matte-card space-y-5">
          <h2 className="text-xl font-semibold">{dict.certSectionTitle}</h2>
          <form onSubmit={handleAddCertification} className="space-y-3">
            <div>
              <label htmlFor="cert-name-pt" className="block text-xs font-mono-code mb-1">
                {dict.certNamePtLabel} *
              </label>
              <input
                id="cert-name-pt"
                type="text"
                required
                value={certNamePt}
                onChange={(e) => setCertNamePt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-sm"
              />
            </div>
            <div>
              <label htmlFor="cert-name-en" className="block text-xs font-mono-code mb-1">
                {dict.certNameEnLabel}
              </label>
              <input
                id="cert-name-en"
                type="text"
                value={certNameEn}
                onChange={(e) => setCertNameEn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="cert-date" className="block text-xs font-mono-code mb-1">
                  {dict.certDateLabel} *
                </label>
                <input
                  id="cert-date"
                  type="text"
                  required
                  placeholder="05/2026"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-sm"
                />
              </div>
              <div>
                <label htmlFor="cert-photo-url" className="block text-xs font-mono-code mb-1">
                  {dict.certPhotoLabel}
                </label>
                <input
                  id="cert-photo-url"
                  type="text"
                  placeholder="https://... ou Upload abaixo"
                  value={certImage}
                  onChange={(e) => setCertImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cert-file-upload" className="block text-xs font-mono-code mb-1">
                Upload de Imagem do Certificado
              </label>
              <input
                id="cert-file-upload"
                type="file"
                accept="image/*"
                onChange={handleCertFileUpload}
                className="text-xs"
              />
            </div>
            <button type="submit" className="btn-royal-iris text-xs">
              + {dict.addCertButton}
            </button>
          </form>

          <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)]">
            {certifications.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--surface-elevated)] text-xs"
              >
                <div>
                  <div className="font-semibold">{c.name[lang]}</div>
                  <div className="font-mono-code opacity-70">{c.date}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCertification(c.id)}
                  aria-label={`Remover certificação ${c.name[lang]}`}
                  className="px-2.5 py-1 rounded border border-[var(--border-subtle)] hover:border-red-400"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Spoken Languages CRUD + 60-30-10 Palette Customizer */}
        <div className="space-y-8">
          <div className="rounded-2xl p-6 matte-card space-y-5">
            <h2 className="text-xl font-semibold">{dict.langSectionTitle}</h2>
            <form onSubmit={handleAddLanguage} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="lang-name-pt" className="block text-xs font-mono-code mb-1">
                    {dict.langNamePtLabel} *
                  </label>
                  <input
                    id="lang-name-pt"
                    type="text"
                    required
                    placeholder="Espanhol"
                    value={langNamePt}
                    onChange={(e) => setLangNamePt(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="lang-name-en" className="block text-xs font-mono-code mb-1">
                    {dict.langNameEnLabel}
                  </label>
                  <input
                    id="lang-name-en"
                    type="text"
                    placeholder="Spanish"
                    value={langNameEn}
                    onChange={(e) => setLangNameEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="lang-level-pt" className="block text-xs font-mono-code mb-1">
                    {dict.langLevelPtLabel} *
                  </label>
                  <input
                    id="lang-level-pt"
                    type="text"
                    required
                    placeholder="Intermédio / B2"
                    value={langLevelPt}
                    onChange={(e) => setLangLevelPt(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="lang-level-en" className="block text-xs font-mono-code mb-1">
                    {dict.langLevelEnLabel}
                  </label>
                  <input
                    id="lang-level-en"
                    type="text"
                    placeholder="Intermediate / B2"
                    value={langLevelEn}
                    onChange={(e) => setLangLevelEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-sm"
                  />
                </div>
              </div>
              <button type="submit" className="btn-royal-iris text-xs">
                + {dict.addLangButton}
              </button>
            </form>

            <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)]">
              {spokenLanguages.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--surface-elevated)] text-xs"
                >
                  <div>
                    <span className="font-semibold">{l.language[lang]}</span> ·{' '}
                    <span className="font-mono-code opacity-75">{l.level[lang]}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteLanguage(l.id)}
                    aria-label={`Remover língua ${l.language[lang]}`}
                    className="px-2.5 py-1 rounded border border-[var(--border-subtle)] hover:border-red-400"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSavePalette} className="rounded-2xl p-6 matte-card space-y-4">
            <h2 className="text-xl font-semibold">{dict.paletteSectionTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-code">
              <div>
                <label htmlFor="dark-60" className="block mb-1">Dark 60%</label>
                <input
                  id="dark-60"
                  type="text"
                  value={draftPalette.darkDominant60}
                  onChange={(e) => setDraftPalette({ ...draftPalette, darkDominant60: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
              <div>
                <label htmlFor="dark-30" className="block mb-1">Dark 30%</label>
                <input
                  id="dark-30"
                  type="text"
                  value={draftPalette.darkSecondary30}
                  onChange={(e) => setDraftPalette({ ...draftPalette, darkSecondary30: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
              <div>
                <label htmlFor="dark-10" className="block mb-1">Dark 10%</label>
                <input
                  id="dark-10"
                  type="text"
                  value={draftPalette.darkAccent10}
                  onChange={(e) => setDraftPalette({ ...draftPalette, darkAccent10: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
            </div>
            <button type="submit" className="btn-royal-iris text-xs">
              {dict.savePaletteButton}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   17. GDPR COOKIE CONSENT BANNER (Gates Google Analytics G-8NCX5W9LVV)
   ========================================================================== */
export function CookieConsentBanner({
  lang,
  isOpen,
  onAcceptAll,
  onEssentialOnly,
}: {
  lang: LanguageCode;
  isOpen: boolean;
  onAcceptAll: () => void;
  onEssentialOnly: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(true);
  const dict = I18N_DICTIONARY[lang].cookies;

  if (!isOpen) return null;

  return (
    <aside
      aria-label={dict.title}
      className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-40 rounded-2xl p-5 surface-alt border border-[var(--border-strong)] shadow-2xl space-y-3"
    >
      <div className="text-sm font-semibold">{dict.title}</div>
      <p className="text-xs leading-relaxed opacity-85">{dict.description}</p>

      {showDetails && (
        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked disabled />
            <span>{dict.essentialLabel}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={analyticsChecked}
              onChange={(e) => setAnalyticsChecked(e.target.checked)}
            />
            <span>{dict.analyticsLabel}</span>
          </label>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {!showDetails ? (
          <>
            <button type="button" onClick={onAcceptAll} className="btn-royal-iris text-xs py-2 px-3.5">
              {dict.acceptAll}
            </button>
            <button type="button" onClick={onEssentialOnly} className="btn-secondary-matte text-xs py-2 px-3.5">
              {dict.essentialOnly}
            </button>
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="text-xs underline px-2 py-2"
            >
              {dict.manage}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => (analyticsChecked ? onAcceptAll() : onEssentialOnly())}
            className="btn-royal-iris text-xs py-2 px-4"
          >
            {dict.savePreferences}
          </button>
        )}
      </div>
    </aside>
  );
}
