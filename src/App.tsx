import React, { useCallback, useEffect, useState } from 'react';
import {
  CertificationItem,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_SPOKEN_LANGUAGES,
  DEFAULT_THEME_PALETTE,
  LanguageCode,
  PERSONAL_INFO,
  RoutePath,
  SpokenLanguageItem,
  ThemeMode,
  ThemePaletteConfig,
} from './i18n';
import {
  CV_FALLBACK_PROJECTS,
  PortfolioProject,
} from './github';
import {
  getSeoMetadataForRoute,
  resolveRouteFromLocation,
  sanitizeThemePalette,
} from './portfolioLogic';
import {
  AboutSection,
  AdminDashboardView,
  CareerTimelineSection,
  CertificationsAndLanguagesSection,
  ContactAndFooterSection,
  ContactSidebar,
  CookieConsentBanner,
  FullWorkView,
  HeroSection,
  InvertedPyramidTechStack,
  LegalView,
  LoadingScreen,
  NotFound404View,
  ProjectsCarouselSection,
  ThankYouView,
  TopNavbar,
} from './components';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEYS = {
  lang: 'jb_portfolio_lang',
  theme: 'jb_portfolio_theme',
  palette: 'jb_portfolio_palette_v2',
  certs: 'jb_portfolio_certs_v3',
  langs: 'jb_portfolio_spoken_langs',
  projects: 'jb_portfolio_projects_manual_v1',
  cookieConsent: 'jb_portfolio_cookie_consent',
};

function initializeGoogleAnalytics(measurementId: string) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ga-gtag-script')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });

  const script = document.createElement('script');
  script.id = 'ga-gtag-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

function trackAnalyticsEvent(eventName: string, params: Record<string, string>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export default function App() {
  // Check ?autostart=1 to skip intro loading screen immediately when requested
  const isAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [loadingProgress, setLoadingProgress] = useState<number>(isAutostart ? 100 : 0);
  const [showLoader, setShowLoader] = useState<boolean>(!isAutostart);

  // Default language is English ('en')
  const [lang, setLang] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.lang);
      if (saved === 'pt' || saved === 'en') return saved;
    } catch {
      // Ignore storage error
    }
    return 'en';
  });

  // Default theme is strictly dark mode
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.theme);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // Ignore storage error
    }
    return 'dark';
  });

  const [palette, setPalette] = useState<ThemePaletteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.palette);
      if (saved) return sanitizeThemePalette(JSON.parse(saved));
    } catch {
      // Ignore storage error
    }
    return DEFAULT_THEME_PALETTE;
  });

  const [route, setRoute] = useState<RoutePath>(() =>
    typeof window !== 'undefined'
      ? resolveRouteFromLocation(window.location.hash, window.location.pathname)
      : 'home'
  );

  const [activeSection, setActiveSection] = useState<string>('hero');

  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.projects);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return CV_FALLBACK_PROJECTS;
  });
  const [syncSource] = useState<'syncing' | 'live' | 'fallback'>('fallback');

  const [certifications, setCertifications] = useState<CertificationItem[]>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEYS.certs) ||
        localStorage.getItem('jb_portfolio_certs_v2') ||
        localStorage.getItem('jb_portfolio_certs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Ensure removed default certificates (Ciência Viva & English C2) do not reappear from older cache
          const cleaned = parsed.filter(
            (c: CertificationItem) =>
              c.id !== 'cert-ciencia-viva-2022' && c.id !== 'cert-english-c2'
          );
          localStorage.setItem(STORAGE_KEYS.certs, JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch {
      // Ignore storage error
    }
    return DEFAULT_CERTIFICATIONS;
  });

  const [spokenLanguages, setSpokenLanguages] = useState<SpokenLanguageItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.langs);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return DEFAULT_SPOKEN_LANGUAGES;
  });

  const [cookieBannerOpen, setCookieBannerOpen] = useState<boolean>(false);

  // Respect "No Arrival Popups" rule: only show Cookie Consent Banner after >= 10s dwell + user scroll, or via Footer "Preferências de Cookies" button
  useEffect(() => {
    let dwellReady = false;
    let scrolled = false;
    const checkOpen = () => {
      try {
        if (!localStorage.getItem(STORAGE_KEYS.cookieConsent) && dwellReady && scrolled) {
          setCookieBannerOpen(true);
        }
      } catch {
        // Ignore storage error
      }
    };
    const timer = window.setTimeout(() => {
      dwellReady = true;
      checkOpen();
    }, 10500);
    const onScroll = () => {
      if (window.scrollY > 240) {
        scrolled = true;
        checkOpen();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // 1. Apply Theme & 60-30-10 CSS Variables to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--color-dominant-60', palette.darkDominant60);
      root.style.setProperty('--color-secondary-30', palette.darkSecondary30);
      root.style.setProperty('--color-accent-10', palette.darkAccent10);
      root.style.setProperty('--text-primary', palette.darkSecondary30);
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-dominant-60', palette.lightDominant60);
      root.style.setProperty('--color-secondary-30', palette.lightSecondary30);
      root.style.setProperty('--color-accent-10', palette.lightAccent10);
      root.style.setProperty('--text-primary', palette.lightSecondary30);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Ignore storage error
    }
  }, [theme, palette]);

  // 2. Dynamic SEO Title, Meta Description, OpenGraph & Canonical URL Updater
  useEffect(() => {
    const seo = getSeoMetadataForRoute(route, lang);
    document.title = seo.title;
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en-US';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seo.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);

    const dynamicOrigin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : PERSONAL_INFO.canonicalPlaceholder;
    const canonicalEl = document.getElementById('canonical-link');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', `${dynamicOrigin}${seo.canonicalPath}`);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.lang, lang);
    } catch {
      // Ignore storage error
    }
  }, [route, lang]);

  // 3. Initialize Google Analytics if consent was already granted
  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem(STORAGE_KEYS.cookieConsent);
      if (savedConsent === 'accepted') {
        initializeGoogleAnalytics(PERSONAL_INFO.gaMeasurementId);
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  // 4. Load /portfolio-data.json + 5-second minimum realistic loading progress
  useEffect(() => {
    let mounted = true;

    fetch('/portfolio-data.json', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !data || typeof data !== 'object') return;
        const remoteTime = data.exportedAt ? new Date(data.exportedAt).getTime() : 0;
        const localTimeRaw = localStorage.getItem('jb_portfolio_local_updated_at');
        const localTime = localTimeRaw ? Number(localTimeRaw) : 0;
        const shouldUseRemote = remoteTime > localTime;

        if (Array.isArray(data.projects) && (shouldUseRemote || !localStorage.getItem(STORAGE_KEYS.projects))) {
          setProjects(data.projects);
        }
        if (Array.isArray(data.certifications) && (shouldUseRemote || !localStorage.getItem(STORAGE_KEYS.certs))) {
          setCertifications(data.certifications);
        }
        if (Array.isArray(data.spokenLanguages) && (shouldUseRemote || !localStorage.getItem(STORAGE_KEYS.langs))) {
          setSpokenLanguages(data.spokenLanguages);
        }
        if (data.palette && (shouldUseRemote || !localStorage.getItem(STORAGE_KEYS.palette))) {
          setPalette(sanitizeThemePalette(data.palette));
        }
      })
      .catch(() => {
        // No external portfolio-data.json present; use built-in defaults + localStorage
      });

    if (isAutostart) {
      setLoadingProgress(100);
      setShowLoader(false);
      return;
    }

    // Progression over 5000ms (~5 seconds minimum)
    const startTime = Date.now();
    const duration = 5000;

    const interval = window.setInterval(() => {
      if (!mounted) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));

      setLoadingProgress(pct);

      if (pct >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          if (mounted) {
            setShowLoader(false);
          }
        }, 350);
      }
    }, 50);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [isAutostart]);

  // 5. Listen to Hash & Popstate Navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const nextRoute = resolveRouteFromLocation(window.location.hash, window.location.pathname);
      setRoute(nextRoute);
    };
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // 6. ScrollSpy for Top Navbar Active Indicator
  useEffect(() => {
    if (route !== 'home') return;
    const sectionIds = ['hero', 'about', 'tech-stack', 'career', 'projects', 'certifications', 'contact'];
    const onScroll = () => {
      const scrollY = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [route]);

  const navigateToRoute = useCallback((targetRoute: RoutePath) => {
    setRoute(targetRoute);
    const hashValue = targetRoute === 'home' ? '#/' : `#/${targetRoute}`;
    if (window.location.hash !== hashValue) {
      window.history.pushState(null, '', hashValue);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToHomeSection = useCallback(
    (sectionId: string) => {
      if (route !== 'home') {
        setRoute('home');
        window.history.pushState(null, '', `#${sectionId}`);
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        setActiveSection(sectionId);
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    [route]
  );

  // CV Download Handler -> Triggers Real PDF Download + Navigates to Thank You Page
  const handleDownloadCv = useCallback(
    (cvLang: LanguageCode, redirectThankYou: boolean = true) => {
      const pdfUrl = PERSONAL_INFO.cvFiles[cvLang];
      const fileName =
        cvLang === 'pt' ? 'Joao_Barao_CV_PT.pdf' : 'Joao_Barao_CV_EN.pdf';

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      trackAnalyticsEvent('cv_download', { language: cvLang });

      if (redirectThankYou) {
        navigateToRoute('thank-you');
      }
    },
    [navigateToRoute]
  );

  return (
    <div className="min-h-screen flex flex-col surface-dominant selection:bg-[var(--color-accent-10)] selection:text-[var(--text-on-accent)]">
      {showLoader && (
        <LoadingScreen
          progress={loadingProgress}
          lang={lang}
          onSkip={() => setShowLoader(false)}
        />
      )}

      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <TopNavbar
        lang={lang}
        activeSection={activeSection}
        onNavigateHomeSection={navigateToHomeSection}
        onDownloadCv={(cvLang) => handleDownloadCv(cvLang, true)}
      />

      {/* Fixed Social Contact Sidebar on Desktop */}
      <ContactSidebar />

      {/* Main Content Router */}
      <main className="flex-1">
        {route === 'home' && (
          <>
            <HeroSection
              lang={lang}
              theme={theme}
              palette={palette}
              onToggleLanguage={() => setLang((prev) => (prev === 'pt' ? 'en' : 'pt'))}
              onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              onDownloadCv={(cvLang) => handleDownloadCv(cvLang, true)}
              onNavigateHomeSection={navigateToHomeSection}
              onNavigateRoute={navigateToRoute}
              onSceneProgress={(pct) =>
                setLoadingProgress((prev) => Math.max(prev, Math.round(pct * 0.85)))
              }
            />

            <AboutSection lang={lang} />

            <InvertedPyramidTechStack lang={lang} />

            <CareerTimelineSection lang={lang} />

            <ProjectsCarouselSection
              lang={lang}
              projects={projects}
              syncSource={syncSource}
              onOpenFullWork={() => navigateToRoute('work')}
              onTrackProjectClick={(projectName) =>
                trackAnalyticsEvent('project_click', { project_name: projectName })
              }
            />

            <CertificationsAndLanguagesSection
              lang={lang}
              certifications={certifications}
              spokenLanguages={spokenLanguages}
            />
          </>
        )}

        {route === 'work' && (
          <FullWorkView
            lang={lang}
            projects={projects}
            onBackToLanding={() => navigateToRoute('home')}
            onTrackProjectClick={(projectName) =>
              trackAnalyticsEvent('project_click', { project_name: projectName })
            }
          />
        )}

        {route === 'thank-you' && (
          <ThankYouView
            lang={lang}
            onDownloadCvAgain={(cvLang) => handleDownloadCv(cvLang, false)}
            onBackHome={() => navigateToRoute('home')}
          />
        )}

        {route === 'privacy' && (
          <LegalView
            lang={lang}
            mode="privacy"
            onBackHome={() => navigateToRoute('home')}
          />
        )}

        {route === 'terms' && (
          <LegalView
            lang={lang}
            mode="terms"
            onBackHome={() => navigateToRoute('home')}
          />
        )}

        {route === 'admin' && (
          <AdminDashboardView
            lang={lang}
            certifications={certifications}
            spokenLanguages={spokenLanguages}
            projects={projects}
            palette={palette}
            onUpdateCertifications={(next) => {
              setCertifications(next);
              try {
                localStorage.setItem(STORAGE_KEYS.certs, JSON.stringify(next));
                localStorage.setItem('jb_portfolio_local_updated_at', String(Date.now()));
              } catch {
                // Ignore storage error
              }
            }}
            onUpdateLanguages={(next) => {
              setSpokenLanguages(next);
              try {
                localStorage.setItem(STORAGE_KEYS.langs, JSON.stringify(next));
                localStorage.setItem('jb_portfolio_local_updated_at', String(Date.now()));
              } catch {
                // Ignore storage error
              }
            }}
            onUpdateProjects={(next) => {
              setProjects(next);
              try {
                localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(next));
                localStorage.setItem('jb_portfolio_local_updated_at', String(Date.now()));
              } catch {
                // Ignore storage error
              }
            }}
            onUpdatePalette={(next) => {
              setPalette(next);
              try {
                localStorage.setItem(STORAGE_KEYS.palette, JSON.stringify(next));
                localStorage.setItem('jb_portfolio_local_updated_at', String(Date.now()));
              } catch {
                // Ignore storage error
              }
            }}
            onResetAllDefaults={() => {
              setCertifications(DEFAULT_CERTIFICATIONS);
              setSpokenLanguages(DEFAULT_SPOKEN_LANGUAGES);
              setProjects(CV_FALLBACK_PROJECTS);
              setPalette(DEFAULT_THEME_PALETTE);
              try {
                localStorage.removeItem(STORAGE_KEYS.certs);
                localStorage.removeItem(STORAGE_KEYS.langs);
                localStorage.removeItem(STORAGE_KEYS.projects);
                localStorage.removeItem(STORAGE_KEYS.palette);
                localStorage.removeItem('jb_portfolio_local_updated_at');
              } catch {
                // Ignore storage error
              }
            }}
            onBackHome={() => navigateToRoute('home')}
          />
        )}

        {route === '404' && (
          <NotFound404View lang={lang} onBackHome={() => navigateToRoute('home')} />
        )}
      </main>

      {/* Contact Section & Footer with Real Location (Coimbra, Portugal) */}
      <ContactAndFooterSection
        lang={lang}
        onDownloadCv={(cvLang) => handleDownloadCv(cvLang, true)}
        onNavigateRoute={navigateToRoute}
        onOpenCookieSettings={() => setCookieBannerOpen(true)}
      />

      {/* GDPR Cookie Consent Banner */}
      <CookieConsentBanner
        lang={lang}
        isOpen={cookieBannerOpen}
        onAcceptAll={() => {
          setCookieBannerOpen(false);
          try {
            localStorage.setItem(STORAGE_KEYS.cookieConsent, 'accepted');
          } catch {
            // Ignore storage error
          }
          initializeGoogleAnalytics(PERSONAL_INFO.gaMeasurementId);
        }}
        onEssentialOnly={() => {
          setCookieBannerOpen(false);
          try {
            localStorage.setItem(STORAGE_KEYS.cookieConsent, 'essential');
          } catch {
            // Ignore storage error
          }
        }}
      />
    </div>
  );
}
