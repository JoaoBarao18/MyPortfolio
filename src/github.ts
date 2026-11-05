export interface PortfolioProject {
  id: string;
  name: string;
  title: { pt: string; en: string };
  description: { pt: string; en: string };
  highlights: { pt: string[]; en: string[] };
  techStack: string[];
  language: string;
  repoUrl: string;
  liveUrl: string | null;
  hasPages: boolean;
  featuredInCarousel: boolean;
  isCvHighlight: boolean;
  updatedAt: string;
  stars: number;
  previewSvg: string;
}

interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  has_pages: boolean;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateProjectPreviewSvg(title: string, subtitle: string, tags: string[], codeBadge: string): string {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safeBadge = escapeXml(codeBadge);
  const safeTags = escapeXml(tags.slice(0, 4).join(' · '));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0B0F17"/>
        <stop offset="100%" stop-color="#151E32"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#4F46E5"/>
        <stop offset="100%" stop-color="#6366F1"/>
      </linearGradient>
    </defs>
    <rect width="800" height="480" fill="url(#bgGrad)"/>
    <g stroke="#F3F4F6" stroke-opacity="0.05" stroke-width="1">
      <line x1="0" y1="120" x2="800" y2="120"/>
      <line x1="0" y1="240" x2="800" y2="240"/>
      <line x1="0" y1="360" x2="800" y2="360"/>
      <line x1="200" y1="0" x2="200" y2="480"/>
      <line x1="400" y1="0" x2="400" y2="480"/>
      <line x1="600" y1="0" x2="600" y2="480"/>
    </g>
    <rect x="24" y="24" width="752" height="432" rx="16" fill="#111827" fill-opacity="0.9" stroke="#F3F4F6" stroke-opacity="0.16" stroke-width="1.5"/>
    <line x1="24" y1="76" x2="776" y2="76" stroke="#F3F4F6" stroke-opacity="0.12" stroke-width="1"/>
    <circle cx="52" cy="50" r="6" fill="#EF4444" fill-opacity="0.8"/>
    <circle cx="72" cy="50" r="6" fill="#F59E0B" fill-opacity="0.8"/>
    <circle cx="92" cy="50" r="6" fill="#10B981" fill-opacity="0.8"/>
    <text x="744" y="55" text-anchor="end" fill="#F3F4F6" fill-opacity="0.6" font-family="monospace" font-size="13">${safeBadge}</text>

    <!-- Decorative UI Mockup Elements on Right -->
    <rect x="520" y="104" width="224" height="190" rx="10" fill="#0B0F17" stroke="#F3F4F6" stroke-opacity="0.12" stroke-width="1"/>
    <rect x="536" y="122" width="90" height="10" rx="4" fill="#4F46E5" fill-opacity="0.8"/>
    <rect x="536" y="142" width="160" height="8" rx="4" fill="#F3F4F6" fill-opacity="0.2"/>
    <rect x="536" y="158" width="130" height="8" rx="4" fill="#F3F4F6" fill-opacity="0.14"/>
    <rect x="536" y="184" width="192" height="42" rx="6" fill="#161F30" stroke="#4F46E5" stroke-opacity="0.4" stroke-width="1"/>
    <circle cx="556" cy="205" r="8" fill="#4F46E5"/>
    <rect x="574" y="198" width="110" height="6" rx="3" fill="#F3F4F6" fill-opacity="0.5"/>
    <rect x="574" y="210" width="70" height="5" rx="2.5" fill="#F3F4F6" fill-opacity="0.25"/>
    <rect x="536" y="238" width="88" height="38" rx="6" fill="#161F30"/>
    <rect x="636" y="238" width="92" height="38" rx="6" fill="#161F30"/>

    <!-- Project Badge, Title & Subtitle -->
    <rect x="52" y="108" width="124" height="32" rx="6" fill="url(#accentGrad)"/>
    <text x="114" y="129" text-anchor="middle" fill="#FFFFFF" font-family="monospace" font-size="13" font-weight="bold">${safeBadge}</text>
    <text x="52" y="192" fill="#F3F4F6" font-family="sans-serif" font-size="28" font-weight="bold">${safeTitle}</text>
    <text x="52" y="232" fill="#F3F4F6" fill-opacity="0.78" font-family="sans-serif" font-size="15">${safeSubtitle}</text>

    <!-- Bottom Architecture Status Bar -->
    <line x1="52" y1="348" x2="748" y2="348" stroke="#F3F4F6" stroke-opacity="0.12" stroke-width="1"/>
    <circle cx="60" cy="392" r="5" fill="#10B981"/>
    <text x="76" y="397" fill="#F3F4F6" fill-opacity="0.85" font-family="monospace" font-size="14">${safeTags}</text>
    <text x="748" y="397" text-anchor="end" fill="#F3F4F6" fill-opacity="0.5" font-family="monospace" font-size="13">@JoaoBarao18</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Core engineering projects extracted from João Barão's CV (cv-pt.pdf & cv-en.pdf)
 */
export const CV_FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    id: 'cv-saber-mais',
    name: 'Saber+',
    title: {
      pt: 'Saber+ — Plataforma Académica de Avaliação com IA',
      en: 'Saber+ — AI Academic Assessment Platform',
    },
    description: {
      pt: 'Co-desenvolvimento de uma plataforma web com 22 funcionalidades em React.js e Spring Boot para centralizar bancos de exames e fornecer avaliação automática critério a critério em respostas abertas via integração com LLMs.',
      en: 'Co-engineering a 22-feature web platform using React.js and Spring Boot to centralize exam banks and deliver automated, criterion-by-criterion open-answer evaluations via LLM integration.',
    },
    highlights: {
      pt: [
        'Equipa Scrum de 5 elementos ao longo de 5 sprints com pipeline GitLab de 4 estágios (feature → dev → qa → main)',
        'Architecture Decision Records (ADRs) e revisões de código (Peer Reviews) obrigatórias',
        'Arquitetura RESTful desacoplada entre frontend React/Vite e backend Spring Boot',
      ],
      en: [
        '5-member Scrum team over 5 sprints with a 4-stage GitLab CI/CD pipeline (feature → dev → qa → main)',
        'Architecture Decision Records (ADRs) and mandatory Peer Reviews',
        'Decoupled RESTful architecture bridging React/Vite frontend and Spring Boot backend',
      ],
    },
    techStack: ['Java', 'Spring Boot', 'React.js', 'Vite', 'TypeScript', 'REST APIs', 'GitLab CI/CD', 'SQL'],
    language: 'Java / React.js',
    repoUrl: 'https://github.com/JoaoBarao18',
    liveUrl: null,
    hasPages: false,
    featuredInCarousel: true,
    isCvHighlight: true,
    updatedAt: '2026-10-25T12:00:00Z',
    stars: 12,
    previewSvg: generateProjectPreviewSvg(
      'Saber+ Academic AI Platform',
      '22-Feature Exam Bank & Automated LLM Evaluation Engine',
      ['React.js', 'Spring Boot', 'REST API', 'GitLab CI/CD'],
      'FULL-STACK'
    ),
  },
  {
    id: 'cv-mymenu-shiftappens',
    name: 'myMenu',
    title: {
      pt: 'myMenu — Gerador Inteligente de Receitas com IA (ShiftAppens)',
      en: 'myMenu — AI Smart Recipe Generator (ShiftAppens Hackathon)',
    },
    description: {
      pt: 'Aplicação web full-stack desenvolvida em 48 horas no ShiftAppens Hackathon, integrando a API Google Gemini Flash LLM com backend Supabase (PostgreSQL e Google OAuth) para gerar receitas dinâmicas ajustadas ao inventário de despensa e restrições alimentares.',
      en: 'Full-stack web application built under a 48-hour deadline at ShiftAppens Hackathon, integrating Google Gemini Flash LLM with a Supabase backend (PostgreSQL + Google OAuth) to generate personalized recipes reducing household food waste.',
    },
    highlights: {
      pt: [
        'Liderança da arquitetura front-end e design UI/UX no Figma sob prazo estrito de 48h',
        'Autenticação Google OAuth e persistência relacional PostgreSQL via Supabase',
        'Geração inteligente de receitas focada no combate ao desperdício alimentar doméstico',
      ],
      en: [
        'Led front-end architecture and Figma UI/UX design under a strict 48-hour hackathon deadline',
        'Google OAuth authentication and PostgreSQL persistence powered by Supabase',
        'Dynamic recipe generation tailored to pantry inventory and dietary restrictions',
      ],
    },
    techStack: ['TypeScript', 'React.js', 'Supabase', 'PostgreSQL', 'Figma UI/UX', 'HTML5', 'CSS3'],
    language: 'TypeScript',
    repoUrl: 'https://github.com/JoaoBarao18',
    liveUrl: null,
    hasPages: false,
    featuredInCarousel: true,
    isCvHighlight: true,
    updatedAt: '2026-09-18T12:00:00Z',
    stars: 15,
    previewSvg: generateProjectPreviewSvg(
      'myMenu — Smart Recipe AI',
      'ShiftAppens 48h Hackathon Prototype · Anti-Food-Waste Platform',
      ['TypeScript', 'Supabase', 'PostgreSQL', 'Figma UI/UX'],
      'HACKATHON'
    ),
  },
  {
    id: 'cv-entrega-so',
    name: 'ENTREGA-SO',
    title: {
      pt: 'ENTREGA-SO — Sistema Concorrente de Despacho de Entregas',
      en: 'ENTREGA-SO — Concurrent Delivery Dispatch System',
    },
    description: {
      pt: 'Sistema distribuído de 4 processos em C (Linux/Unix) recorrendo a chamadas de sistema POSIX, Named Pipes (FIFOs) e pipes anónimos para tarifar e despachar encomendas em tempo real até 20 estafetas concorrentes.',
      en: '4-process distributed system in C (Linux) using POSIX system calls, Named Pipes (FIFOs), and anonymous pipes to orchestrate real-time order pricing and dispatch for up to 20 concurrent couriers.',
    },
    highlights: {
      pt: [
        'Controlo paralelo de prazos sem espera ativa e deteção de falha de clientes (heartbeat de 10s)',
        'Sincronização com mutexes e Sinais Unix (SIGINT, SIGTERM) eliminando condições de corrida e processos zombie',
        'Comunicação Inter-Processos (IPC) de baixa latência em ambiente Linux/Unix',
      ],
      en: [
        'Non-blocking deadline expiration and 10-second dead-client heartbeat detection',
        'Unix Signals (SIGINT, SIGTERM) and mutex synchronization eliminating race conditions and zombie processes',
        'Low-latency POSIX Inter-Process Communication (IPC) across 4 concurrent processes',
      ],
    },
    techStack: ['C (POSIX)', 'Linux / Unix', 'Git', 'GitHub'],
    language: 'C',
    repoUrl: 'https://github.com/JoaoBarao18',
    liveUrl: null,
    hasPages: false,
    featuredInCarousel: true,
    isCvHighlight: true,
    updatedAt: '2026-10-10T12:00:00Z',
    stars: 10,
    previewSvg: generateProjectPreviewSvg(
      'ENTREGA-SO — POSIX IPC',
      '4-Process Concurrent Linux Dispatch & Heartbeat Engine',
      ['C (POSIX)', 'Linux/Unix', 'Named Pipes (FIFOs)', 'Signals'],
      'SYSTEMS C'
    ),
  },
  {
    id: 'cv-deep-sea-mining',
    name: 'Deep Sea Mining',
    title: {
      pt: 'Deep Sea Mining — Jogo Desktop de Estratégia Multifase',
      en: 'Deep Sea Mining — Multi-Phase Strategy Desktop Game',
    },
    description: {
      pt: 'Arquitetura de um jogo de estratégia de 4 fases em Java e JavaFX aplicando 5 padrões de desenho (Facade, State, Factory, Singleton, Multiton) para isolar estritamente a lógica de domínio da interface gráfica e gerir 3 drones autónomos.',
      en: 'Architected a 4-phase strategy game in Java/JavaFX using 5 design patterns (Facade, State, Factory, Singleton, Multiton) to strictly decouple domain logic from the GUI and manage 3 autonomous drones.',
    },
    highlights: {
      pt: [
        'Observadores assíncronos (PropertyChangeListener) para renderização UI thread-safe sem bloqueios',
        'Serialização binária de estado e suites de testes unitários JUnit (mínimo 2 casos de teste por classe nuclear)',
        'Modelação rigorosa em UML e aplicação prática de Design Patterns OOP',
      ],
      en: [
        'Asynchronous property-change observers ensuring thread-safe UI rendering',
        'Binary state serialization and JUnit 5 test suites (minimum 2 test cases per core domain class)',
        'Strict OOP Design Patterns (Facade, State, Factory, Singleton, Multiton)',
      ],
    },
    techStack: ['Java', 'JavaFX', 'JUnit 5', 'Design Patterns', 'Git'],
    language: 'Java',
    repoUrl: 'https://github.com/JoaoBarao18',
    liveUrl: null,
    hasPages: false,
    featuredInCarousel: true,
    isCvHighlight: true,
    updatedAt: '2026-06-15T12:00:00Z',
    stars: 11,
    previewSvg: generateProjectPreviewSvg(
      'Deep Sea Mining Strategy',
      'Java/JavaFX 4-Phase Autonomous Drone Strategy & 5 OOP Patterns',
      ['Java', 'JavaFX', 'JUnit 5', 'Design Patterns'],
      'JAVA OOP'
    ),
  },
];

const CACHE_KEY = 'jb_portfolio_github_cache_v3';

/**
 * Normalize and merge GitHub API repositories with CV Highlight projects.
 * Prioritizes repos with GitHub Pages (`has_pages === true` or `homepage` set),
 * while seamlessly falling back to all public repos + CV highlights.
 */
export function mergeGitHubReposWithCvProjects(
  apiRepos: GitHubApiRepo[],
  username: string = 'JoaoBarao18'
): PortfolioProject[] {
  const validApiRepos = apiRepos.filter((r) => !r.fork);
  const convertedFromApi: PortfolioProject[] = validApiRepos.map((repo) => {
    const hasPages = Boolean(repo.has_pages || (repo.homepage && repo.homepage.trim().length > 0));
    const computedLiveUrl =
      repo.homepage && repo.homepage.trim().length > 0
        ? repo.homepage.trim()
        : repo.has_pages
          ? `https://${username.toLowerCase()}.github.io/${repo.name}/`
          : null;

    const inferredStack: string[] = [];
    if (repo.language) inferredStack.push(repo.language);
    if (Array.isArray(repo.topics)) {
      repo.topics.forEach((t) => {
        if (!inferredStack.includes(t)) inferredStack.push(t);
      });
    }
    if (inferredStack.length === 0) inferredStack.push('Software Engineering');

    const cleanDesc =
      repo.description && repo.description.trim().length > 0
        ? repo.description.trim()
        : `Repositório público de engenharia de software (${repo.name}) desenvolvido por João Barão.`;
    const cleanDescEn =
      repo.description && repo.description.trim().length > 0
        ? repo.description.trim()
        : `Public software engineering repository (${repo.name}) developed by João Barão.`;

    return {
      id: `gh-${repo.id}`,
      name: repo.name,
      title: {
        pt: repo.name.replace(/[-_]/g, ' '),
        en: repo.name.replace(/[-_]/g, ' '),
      },
      description: {
        pt: cleanDesc,
        en: cleanDescEn,
      },
      highlights: {
        pt: [
          `Repositório oficial sincronizado via GitHub API (@${username})`,
          hasPages ? 'Demonstração interativa alojada via GitHub Pages' : 'Código-fonte completo disponível no GitHub',
        ],
        en: [
          `Official repository synchronized via GitHub API (@${username})`,
          hasPages ? 'Interactive live demo hosted via GitHub Pages' : 'Complete source code available on GitHub',
        ],
      },
      techStack: inferredStack,
      language: repo.language || 'TypeScript',
      repoUrl: repo.html_url,
      liveUrl: computedLiveUrl,
      hasPages,
      featuredInCarousel: hasPages || repo.stargazers_count > 0,
      isCvHighlight: false,
      updatedAt: repo.updated_at || new Date().toISOString(),
      stars: repo.stargazers_count || 0,
      previewSvg: generateProjectPreviewSvg(
        repo.name,
        cleanDescEn.slice(0, 56),
        inferredStack,
        (repo.language || 'CODE').toUpperCase()
      ),
    };
  });

  // Merge CV projects and GitHub API repos without duplicates (matching by normalized name)
  const merged: PortfolioProject[] = [...CV_FALLBACK_PROJECTS];
  for (const ghProj of convertedFromApi) {
    const normalizedGh = ghProj.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existingIdx = merged.findIndex(
      (cvProj) => cvProj.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedGh
    );

    if (existingIdx >= 0) {
      // Enrich the CV project with live GitHub URL and GitHub Pages link if available
      merged[existingIdx] = {
        ...merged[existingIdx],
        repoUrl: ghProj.repoUrl,
        liveUrl: ghProj.liveUrl || merged[existingIdx].liveUrl,
        hasPages: ghProj.hasPages || merged[existingIdx].hasPages,
        stars: Math.max(merged[existingIdx].stars, ghProj.stars),
      };
    } else {
      merged.push(ghProj);
    }
  }

  // Sort: Prioritize hasPages === true, then CV highlights, then most recently updated
  merged.sort((a, b) => {
    if (a.hasPages !== b.hasPages) return a.hasPages ? -1 : 1;
    if (a.isCvHighlight !== b.isCvHighlight) return a.isCvHighlight ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Ensure at least 4-6 projects are flagged for the circular carousel
  let carouselCount = merged.filter((p) => p.featuredInCarousel).length;
  if (carouselCount < 4) {
    for (const p of merged) {
      if (!p.featuredInCarousel && carouselCount < 5) {
        p.featuredInCarousel = true;
        carouselCount++;
      }
    }
  }

  return merged;
}

export async function fetchGitHubPortfolioProjects(
  username: string = 'JoaoBarao18',
  githubToken?: string
): Promise<{ projects: PortfolioProject[]; source: 'live' | 'fallback' }> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (githubToken && githubToken.trim().length > 0) {
      headers.Authorization = `token ${githubToken.trim()}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
      {
        headers,
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`GitHub API HTTP ${response.status}`);
    }

    const data = (await response.json()) as GitHubApiRepo[];
    if (!Array.isArray(data)) {
      throw new Error('Invalid GitHub API payload');
    }

    const merged = mergeGitHubReposWithCvProjects(data, username);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), projects: merged }));
    } catch {
      // Ignore storage quota errors
    }
    return { projects: merged, source: 'live' };
  } catch {
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw) as { projects: PortfolioProject[] };
        if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
          return { projects: parsed.projects, source: 'fallback' };
        }
      }
    } catch {
      // Ignore localStorage parse error
    }
    return { projects: [...CV_FALLBACK_PROJECTS], source: 'fallback' };
  }
}
