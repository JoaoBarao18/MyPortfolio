export type LanguageCode = 'pt' | 'en';
export type ThemeMode = 'dark' | 'light';
export type RoutePath = 'home' | 'work' | 'thank-you' | 'privacy' | 'terms' | 'admin' | '404';

export interface TechItem {
  id: string;
  name: string;
  level: 1 | 2 | 3; // 1 = Top wide row, 2 = Middle rows, 3 = Bottom apex rows
  row: 1 | 2 | 3 | 4 | 5; // Pyramid row from top (1 = widest) to bottom (5 = narrowest)
  category: 'core' | 'backend' | 'design';
  keywords: string[];
  icon: string; // SVG identifier
  url: string; // Official technology / company website URL
}

export interface CareerMilestone {
  id: string;
  year: string;
  period: { pt: string; en: string };
  role: { pt: string; en: string };
  organization: { pt: string; en: string };
  location: string;
  description: { pt: string; en: string };
  highlights: { pt: string[]; en: string[] };
}

export interface CertificationItem {
  id: string;
  name: { pt: string; en: string };
  date: string;
  image: string;
  issuer: string;
}

export interface SpokenLanguageItem {
  id: string;
  language: { pt: string; en: string };
  level: { pt: string; en: string };
  code: string;
  proficiencyPercent: number;
}

export interface ThemePaletteConfig {
  darkDominant60: string;
  darkSecondary30: string;
  darkAccent10: string;
  lightDominant60: string;
  lightSecondary30: string;
  lightAccent10: string;
}

export const DEFAULT_THEME_PALETTE: ThemePaletteConfig = {
  darkDominant60: '#0B0F17',
  darkSecondary30: '#F3F4F6',
  darkAccent10: '#4F46E5',
  lightDominant60: '#F3F1EC',
  lightSecondary30: '#1E293B',
  lightAccent10: '#4338CA',
};

export const PERSONAL_INFO = {
  fullName: 'João Barão',
  email: 'jrspsbarao@gmail.com',
  phone: '+351 925 527 576',
  location: 'Coimbra, Portugal',
  githubUsername: 'JoaoBarao18',
  githubUrl: 'https://github.com/JoaoBarao18',
  linkedinUrl: 'https://www.linkedin.com/in/jo%C3%A3orafaelbar%C3%A3o/',
  canonicalPlaceholder: 'https://joaobarao18.github.io',
  gaMeasurementId: 'G-8NCX5W9LVV',
  cvFiles: {
    pt: '/cv-pt.pdf',
    en: '/cv-en.pdf',
  },
  title: {
    pt: 'Estudante do último ano de Engenharia Informática no ISEC | Desenvolvedor Full-Stack e Backend | Java, Spring Boot, React.js, TypeScript e C/C++',
    en: 'Final-Year Computer Science & Engineering Student @ ISEC | Full-Stack & Backend Developer | Java, Spring Boot, React.js, TypeScript & C/C++',
  },
  bio: {
    pt: 'A minha ligação com a tecnologia começou muito antes da universidade. Cresci num ambiente rodeado de computadores e a acompanhar o trabalho do meu pai na programação, pelo que a curiosidade de desmontar código e perceber o funcionamento das coisas sempre foi natural para mim. Em 2024, decidi seguir essa paixão e ingressei em Engenharia Informática no ISEC. Na faculdade, percebi rapidamente que o meu foco estava em construir soluções reais, indo além dos guiões de laboratório. Encontrei o meu equilíbrio no desenvolvimento Full-Stack — interligando a experiência visual à lógica dos bastidores — e tenho um enorme interesse pelo potencial da Inteligência Artificial e sistemas escaláveis. Fora do ecrã, o desporto é essencial para manter o equilíbrio e o foco. O voleibol é a minha grande paixão — a experiência de jogar e de apoiar o treino de equipas mais jovens ensinou-me o verdadeiro valor da comunicação sob pressão, da resiliência e do espírito de equipa. Complementarmente, o treino de ginásio é o meu momento diário de disciplina. No fundo, seja no desporto ou a programar, o meu objetivo é o mesmo: evoluir continuamente e fortalecer a equipa em que estou inserido.',
    en: 'My connection with technology began long before university. Growing up around computers and watching my father code, curiosity about how things worked and a drive to deconstruct software always came naturally to me. In 2024, I followed this lifelong passion and enrolled in Computer Science and Engineering at ISEC. At university, I quickly realized that my true focus lies in building real-world solutions rather than just following academic lab scripts. I found my sweet spot in Full-Stack development—bridging UI/UX design with robust backend logic—and I am deeply fascinated by the potential of Artificial Intelligence and scalable systems. Off-screen, sports are essential for keeping me balanced and focused. Volleyball is a major passion of mine; both competing and assisting in coaching younger teams have taught me the true value of communication under pressure, resilience, and team synergy. In addition, gym training is my daily routine for discipline. Ultimately, whether on the court or writing code, my goal remains the same: to continuously evolve and strengthen the team I am part of.',
  },
};

/**
 * Inverted Pyramid Tech Stack extracted directly from cv-pt.pdf and cv-en.pdf
 * Arranged in 6 decreasing centered rows (9 -> 7 -> 6 -> 5 -> 3 -> 2 = 32 technologies/tools, or clean 3-level pyramid)
 */
export const TECH_STACK_PYRAMID: TechItem[] = [
  // Row 1 (Level 1 — Core Languages & Frameworks — 9 items)
  { id: 'java', name: 'Java', level: 1, row: 1, category: 'core', keywords: ['java', 'javafx', 'junit'], icon: 'java', url: 'https://www.java.com/' },
  { id: 'springboot', name: 'Spring Boot', level: 1, row: 1, category: 'core', keywords: ['spring', 'spring-boot', 'springboot'], icon: 'spring', url: 'https://spring.io/projects/spring-boot' },
  { id: 'react', name: 'React.js', level: 1, row: 1, category: 'core', keywords: ['react', 'tsx', 'jsx', 'frontend'], icon: 'react', url: 'https://react.dev/' },
  { id: 'typescript', name: 'TypeScript', level: 1, row: 1, category: 'core', keywords: ['typescript', 'ts'], icon: 'typescript', url: 'https://www.typescriptlang.org/' },
  { id: 'javascript', name: 'JavaScript', level: 1, row: 1, category: 'core', keywords: ['javascript', 'js', 'es6'], icon: 'javascript', url: 'https://developer.mozilla.org/docs/Web/JavaScript' },
  { id: 'c', name: 'C (POSIX)', level: 1, row: 1, category: 'core', keywords: ['c', 'posix', 'unix', 'embedded'], icon: 'c', url: 'https://en.cppreference.com/w/c' },
  { id: 'cpp', name: 'C++', level: 1, row: 1, category: 'core', keywords: ['c++', 'cpp', 'oop'], icon: 'cpp', url: 'https://isocpp.org/' },
  { id: 'kotlin', name: 'Kotlin', level: 1, row: 1, category: 'core', keywords: ['kotlin', 'android'], icon: 'kotlin', url: 'https://kotlinlang.org/' },
  { id: 'sql', name: 'SQL', level: 1, row: 1, category: 'core', keywords: ['sql', 'postgresql', 'mysql', 'database'], icon: 'sql', url: 'https://www.iso.org/standard/76583.html' },

  // Row 2 (Level 1/2 — Languages & Web Core — 7 items)
  { id: 'dart', name: 'Dart', level: 1, row: 2, category: 'core', keywords: ['dart', 'flutter'], icon: 'dart', url: 'https://dart.dev/' },
  { id: 'csharp', name: 'C#', level: 1, row: 2, category: 'core', keywords: ['c#', 'csharp', '.net'], icon: 'csharp', url: 'https://dotnet.microsoft.com/languages/csharp' },
  { id: 'html5', name: 'HTML5', level: 1, row: 2, category: 'core', keywords: ['html', 'html5', 'web'], icon: 'html5', url: 'https://developer.mozilla.org/docs/Web/HTML' },
  { id: 'css3', name: 'CSS3', level: 1, row: 2, category: 'core', keywords: ['css', 'css3', 'responsive'], icon: 'css3', url: 'https://developer.mozilla.org/docs/Web/CSS' },
  { id: 'vite', name: 'Vite', level: 2, row: 2, category: 'backend', keywords: ['vite', 'react', 'frontend'], icon: 'vite', url: 'https://vite.dev/' },
  { id: 'nodejs', name: 'Node.js', level: 2, row: 2, category: 'backend', keywords: ['node', 'nodejs', 'express'], icon: 'nodejs', url: 'https://nodejs.org/' },
  { id: 'express', name: 'Express.js', level: 2, row: 2, category: 'backend', keywords: ['express', 'node', 'rest'], icon: 'express', url: 'https://expressjs.com/' },

  // Row 3 (Level 2 — Backend, Databases, Cloud & Architecture — 6 items)
  { id: 'supabase', name: 'Supabase', level: 2, row: 3, category: 'backend', keywords: ['supabase', 'postgresql', 'oauth'], icon: 'supabase', url: 'https://supabase.com/' },
  { id: 'postgresql', name: 'PostgreSQL', level: 2, row: 3, category: 'backend', keywords: ['postgresql', 'postgres', 'sql', 'supabase'], icon: 'postgresql', url: 'https://www.postgresql.org/' },
  { id: 'mysql', name: 'MySQL', level: 2, row: 3, category: 'backend', keywords: ['mysql', 'sql', 'database'], icon: 'mysql', url: 'https://www.mysql.com/' },
  { id: 'rest', name: 'REST APIs', level: 2, row: 3, category: 'backend', keywords: ['rest', 'api', 'microservices'], icon: 'api', url: 'https://restfulapi.net/' },
  { id: 'docker', name: 'Docker', level: 2, row: 3, category: 'backend', keywords: ['docker', 'devops', 'containers'], icon: 'docker', url: 'https://www.docker.com/' },
  { id: 'linux', name: 'Linux / Unix', level: 2, row: 3, category: 'backend', keywords: ['linux', 'unix', 'posix', 'ipc'], icon: 'linux', url: 'https://www.kernel.org/' },

  // Row 4 (Level 2 — DevOps, Testing & Practices — 5 items)
  { id: 'git', name: 'Git', level: 2, row: 4, category: 'backend', keywords: ['git', 'version-control'], icon: 'git', url: 'https://git-scm.com/' },
  { id: 'github', name: 'GitHub', level: 2, row: 4, category: 'backend', keywords: ['github', 'ci/cd'], icon: 'github', url: 'https://github.com/' },
  { id: 'gitlab', name: 'GitLab CI/CD', level: 2, row: 4, category: 'backend', keywords: ['gitlab', 'pipeline', 'scrum'], icon: 'gitlab', url: 'https://about.gitlab.com/' },
  { id: 'junit', name: 'JUnit 5', level: 2, row: 4, category: 'backend', keywords: ['junit', 'java', 'testing'], icon: 'junit', url: 'https://junit.org/junit5/' },
  { id: 'patterns', name: 'OOP Patterns', level: 2, row: 4, category: 'backend', keywords: ['design-patterns', 'patterns', 'oop', 'uml', 'architecture'], icon: 'patterns', url: 'https://refactoring.guru/design-patterns' },

  // Row 5 (Level 3 — Mobile, Desktop & UI/UX — 3 items)
  { id: 'flutter', name: 'Flutter', level: 3, row: 5, category: 'design', keywords: ['flutter', 'dart', 'mobile'], icon: 'flutter', url: 'https://flutter.dev/' },
  { id: 'javafx', name: 'JavaFX', level: 3, row: 5, category: 'design', keywords: ['javafx', 'java', 'desktop'], icon: 'javafx', url: 'https://openjfx.io/' },
  { id: 'figma', name: 'Figma UI/UX', level: 3, row: 5, category: 'design', keywords: ['figma', 'ui/ux', 'design'], icon: 'figma', url: 'https://www.figma.com/' },
];

export const CAREER_TIMELINE: CareerMilestone[] = [
  {
    id: 'shiftappens-2026',
    year: '2026',
    period: { pt: '2026 · 48h Hackathon', en: '2026 · 48h Hackathon' },
    role: {
      pt: 'Main Developer & UI/UX Designer – ShiftAppens Hackathon',
      en: 'Main Developer & UI/UX Designer – ShiftAppens Hackathon',
    },
    organization: {
      pt: 'Freelancing / Hackathon (Projeto myMenu)',
      en: 'Freelancing / Hackathon (myMenu Project Pitch)',
    },
    location: 'Coimbra, Portugal',
    description: {
      pt: 'Liderança da arquitetura front-end e design no Figma sob um prazo estrito de 48 horas, desenvolvendo e apresentando um protótipo focado na redução de desperdício alimentar e desenvolvimento backend com recurso a Supabase e programação em TypeScript.',
      en: 'Led front-end architecture and UI/UX design in Figma under a strict 48-hour deadline, developing and pitching a functional web application focused on reducing household food waste with a Supabase backend and TypeScript.',
    },
    highlights: {
      pt: ['Arquitetura Front-End & TypeScript', 'Design de Produto em Figma (48h)', 'Integração Supabase & Gemini Flash API'],
      en: ['Front-End Architecture & TypeScript', 'Product UI/UX in Figma (48h)', 'Supabase & Gemini Flash API Integration'],
    },
  },
  {
    id: 'isec-2024-present',
    year: 'NOW',
    period: { pt: '2024 – Presente (Conclusão Prevista: Jun 2027)', en: '2024 – Present (Expected Graduation: Jun 2027)' },
    role: {
      pt: 'Licenciatura em Engenharia Informática (Desenvolvimento de Software)',
      en: 'B.Sc. in Computer Science & Engineering (Software Development)',
    },
    organization: {
      pt: 'ISEC - Instituto Superior de Engenharia de Coimbra',
      en: 'ISEC - Coimbra Institute of Engineering',
    },
    location: 'Coimbra, Portugal',
    description: {
      pt: 'Especialização Técnica: Engenharia de Software Full-Stack & Mobile, Sistemas Distribuídos e Arquitetura Empresarial. Fundamentos de Engenharia: Arquitetura Orientada a Objetos e Padrões de Desenho, Programação Concorrente e de Baixo Nível, Desenvolvimento de Aplicações Web Modernas (React.js), Modelação de Bases de Dados Relacionais, Microsserviços RESTful, Engenharia Mobile Multiplataforma e Algoritmia Avançada.',
      en: 'Concentrations: Full-Stack & Mobile Software Engineering, Distributed Systems, and Enterprise Software Architecture. Core Engineering Foundations: Object-Oriented Architecture & Design Patterns, Concurrent & Low-Level Systems Programming, Modern Web App Development (React.js), Relational Database Architecture, RESTful Microservices, Cross-Platform Mobile Engineering, and Data Structures & Algorithms.',
    },
    highlights: {
      pt: ['Engenharia de Software Full-Stack & Mobile', 'Sistemas Distribuídos & Concorrência POSIX', 'Padrões de Desenho & Microsserviços RESTful'],
      en: ['Full-Stack & Mobile Software Engineering', 'Distributed Systems & POSIX Concurrency', 'OOP Design Patterns & RESTful Microservices'],
    },
  },
  {
    id: 'aepaa-2022-2024',
    year: '2024',
    period: { pt: '2022 – 2024', en: '2022 – 2024' },
    role: {
      pt: 'Apoio Técnico & Auxiliar de Treino de Voleibol (Iniciados Masculinos)',
      en: 'Volleyball Training Assistant & Team Support (U14 Boys)',
    },
    organization: {
      pt: 'AEPAA — Agrupamento de Escolas Poeta António Aleixo',
      en: 'AEPAA — Poeta António Aleixo School Cluster',
    },
    location: 'Portimão, Portugal',
    description: {
      pt: 'Apoio direto ao treinador principal na condução de treinos e gestão de equipa em contexto competitivo, promovendo a disciplina, espírito de grupo e comunicação tática sob pressão.',
      en: 'Assisted the head coach during training sessions and competitive matches, mentoring young athletes while playing competitively and fostering team discipline and tactical communication under pressure.',
    },
    highlights: {
      pt: ['Liderança e Mentoria de Jovens Atletas', 'Comunicação Tática sob Pressão', 'Gestão de Equipa em Competição'],
      en: ['Youth Athlete Mentorship & Leadership', 'Tactical Communication Under Pressure', 'Competitive Team Coordination'],
    },
  },
  {
    id: 'hospitality-2022-2023',
    year: '2023',
    period: { pt: 'Verões 2022 & 2023', en: 'Summers 2022 & 2023' },
    role: {
      pt: 'Colaborador de Restauração (Experiência Sazonal de Verão)',
      en: 'Food Service Associate (Summer Roles)',
    },
    organization: {
      pt: 'QB Concept (Jul–Set 2023) & KFC (Jun–Set 2022)',
      en: 'QB Concept (Jul–Sep 2023) & KFC (Jun–Sep 2022)',
    },
    location: 'Portimão, Portugal',
    description: {
      pt: 'Atendimento direto ao público em ambientes de elevado fluxo durante picos sazonais de verão, assegurando uma comunicação clara e resolução rápida de problemas em Português e Inglês.',
      en: 'Delivered direct customer-facing service in high-volume hospitality environments during peak summer seasons, resolving client requests swiftly in both Portuguese and English.',
    },
    highlights: {
      pt: ['Comunicação Bilingue (PT / EN)', 'Resiliência em Ambientes de Elevado Fluxo', 'Resolução Rápida de Problemas'],
      en: ['Bilingual Client Communication (PT / EN)', 'High-Volume Operational Resilience', 'Rapid Problem Resolution'],
    },
  },
  {
    id: 'upcb-2022',
    year: '2022',
    period: { pt: '2022', en: '2022' },
    role: {
      pt: 'Programação de Microcontroladores – Curso Ciência Viva',
      en: 'Embedded Systems Trainee – Ciência Viva Course',
    },
    organization: {
      pt: 'UPCB — Sistemas Inteligentes no Dia a Dia',
      en: 'UPCB — Smart Systems & Microcontrollers',
    },
    location: 'Portimão, Portugal',
    description: {
      pt: 'Programação de microcontroladores em C para leitura de sensores e controlo de atuadores, criando protótipos funcionais de automação para ambientes reais.',
      en: 'Programmed microcontrollers in Embedded C to interface with physical hardware sensors and actuators, building automated hardware-software prototypes for real-world environments.',
    },
    highlights: {
      pt: ['Programação em C Embebido', 'Leitura de Sensores Físicos & Atuadores', 'Prototipagem de Automação Hardware-Software'],
      en: ['Embedded C Programming', 'Physical Sensor & Actuator Interfacing', 'Hardware-Software Automation Prototyping'],
    },
  },
];

/**
 * Generate a clean SVG data URI certificate preview card for default certifications
 */
function escapeSvgXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createCertificateDataUri(title: string, subtitle: string, year: string, badge: string): string {
  const safeTitle = escapeSvgXml(title);
  const safeSubtitle = escapeSvgXml(subtitle);
  const safeYear = escapeSvgXml(year);
  const safeBadge = escapeSvgXml(badge);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="540" viewBox="0 0 800 540">
    <rect width="800" height="540" fill="#0B0F17"/>
    <rect x="24" y="24" width="752" height="492" rx="12" fill="#111827" stroke="#F3F4F6" stroke-opacity="0.22" stroke-width="2"/>
    <rect x="42" y="42" width="716" height="456" rx="8" fill="none" stroke="#F3F4F6" stroke-opacity="0.1" stroke-width="1"/>
    <circle cx="400" cy="120" r="38" fill="#4F46E5" stroke="#F3F4F6" stroke-width="1.5" stroke-opacity="0.6"/>
    <text x="400" y="128" text-anchor="middle" fill="#F3F4F6" font-family="Georgia, serif" font-size="22" font-weight="bold">${safeBadge}</text>
    <text x="400" y="205" text-anchor="middle" fill="#F3F4F6" fill-opacity="0.65" font-family="sans-serif" font-size="13" letter-spacing="4">CERTIFICADO OFICIAL · JOÃO BARÃO</text>
    <text x="400" y="265" text-anchor="middle" fill="#F3F4F6" font-family="Georgia, serif" font-size="30" font-weight="bold">${safeTitle}</text>
    <text x="400" y="315" text-anchor="middle" fill="#F3F4F6" fill-opacity="0.82" font-family="sans-serif" font-size="18">${safeSubtitle}</text>
    <line x1="250" y1="365" x2="550" y2="365" stroke="#F3F4F6" stroke-opacity="0.2" stroke-width="1"/>
    <text x="400" y="410" text-anchor="middle" fill="#F3F4F6" font-family="monospace" font-size="16">JOÃO BARÃO · ${safeYear}</text>
    <text x="400" y="455" text-anchor="middle" fill="#F3F4F6" fill-opacity="0.5" font-family="sans-serif" font-size="12">Coimbra / Portimão, Portugal</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEFAULT_CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-shiftappens-2026',
    name: {
      pt: 'ShiftAppens Hackathon — Main Developer & UI/UX Designer (Projeto myMenu)',
      en: 'ShiftAppens Hackathon — Main Developer & UI/UX Designer (myMenu Project)',
    },
    date: '04/2026',
    issuer: 'ShiftAppens · Coimbra',
    image: createCertificateDataUri(
      'ShiftAppens Hackathon 2026',
      'Main Developer & UI/UX Designer — Projeto myMenu (48h)',
      '2026',
      'SA'
    ),
  },
];

export const DEFAULT_SPOKEN_LANGUAGES: SpokenLanguageItem[] = [
  {
    id: 'lang-pt',
    language: { pt: 'Português', en: 'Portuguese' },
    level: { pt: 'Nativo (Língua Materna)', en: 'Native Speaker' },
    code: 'PT',
    proficiencyPercent: 100,
  },
  {
    id: 'lang-en',
    language: { pt: 'Inglês', en: 'English' },
    level: { pt: 'Avançado / C2 (Proficient)', en: 'Proficient / C2 (CEFR)' },
    code: 'EN',
    proficiencyPercent: 95,
  },
];

export const I18N_DICTIONARY = {
  pt: {
    seo: {
      homeTitle: 'João Barão — Engenheiro Informático & Desenvolvedor Full-Stack | Portfólio 3D',
      homeDesc:
        'Portfólio interativo 3D de João Barão — Estudante do último ano de Engenharia Informática no ISEC, Desenvolvedor Full-Stack e Backend (Java, Spring Boot, React.js, TypeScript e C/C++) em Coimbra, Portugal.',
      workTitle: 'Arquivo Completo de Projetos — João Barão | Engenharia de Software',
      workDesc:
        'Explore todos os projetos de engenharia de software e repositórios GitHub de João Barão: Saber+, Deep Sea Mining, ENTREGA-SO, myMenu e soluções em Java, Spring Boot, React.js, TypeScript e C.',
      thankYouTitle: 'Obrigado pelo Download do Currículo — João Barão',
      thankYouDesc:
        'Obrigado por descarregar o currículo de João Barão. Entre em contacto por email ou LinkedIn para oportunidades de Engenharia de Software Full-Stack e Backend.',
      privacyTitle: 'Política de Privacidade (RGPD) — João Barão',
      privacyDesc:
        'Política de Privacidade e proteção de dados pessoais em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) do portfólio de João Barão.',
      termsTitle: 'Termos de Uso — João Barão',
      termsDesc: 'Termos e condições de utilização, propriedade intelectual e direitos de autor do portfólio de João Barão.',
      adminTitle: 'Painel de Administração — João Barão Portfólio',
      adminDesc: 'Gestão de projetos, certificações, idiomas e paleta cromática 60-30-10 do portfólio de João Barão.',
      notFoundTitle: '404 · Página Não Encontrada — João Barão',
      notFoundDesc: 'A página solicitada não existe no portfólio de João Barão. Regresse à página inicial.',
    },
    loading: {
      initializing: 'A iniciar ambiente editorial 3D...',
      buildingMesh: 'A construir malha 3D de pontos a partir do retrato e a calibrar iluminação...',
      syncingGithub: 'A sincronizar repositórios do GitHub (@JoaoBarao18) e projetos do CV...',
      ready: 'Portfólio pronto. A entrar...',
      skipButton: 'Entrar Diretamente',
    },
    nav: {
      home: 'Início',
      about: 'Sobre Mim',
      techStack: 'Tech Stack',
      career: 'Carreira',
      projects: 'Projetos',
      certifications: 'Certificações',
      contact: 'Contacto',
      fullWork: 'Arquivo',
      ctaDownloadCv: 'Descarregar CV',
      ctaContact: 'Contactar',
      themeLight: 'Mudar para Modo Claro (Champagne)',
      themeDark: 'Mudar para Modo Escuro (Emerald Ink)',
      langSwitch: 'Mudar idioma para Inglês',
    },
    hero: {
      kicker: 'Coimbra, Portugal · ISEC Engenharia Informática',
      greeting: 'Olá, eu sou o',
      roleBadge: 'Engenharia de Software Full-Stack & Backend',
      primaryCta: 'Descarregar CV (PT)',
      secondaryCta: 'Descarregar CV (EN)',
      exploreWorkCta: 'Explorar Projetos',
      contactCta: 'Falar Comigo',
      canvasHint: 'Mova o cursor sobre a malha 3D para interagir com os pontos de profundidade',
      pauseMotion: 'Pausar Malha 3D',
      resumeMotion: 'Ativar Malha 3D',
      resetCamera: 'Centrar Vista 3D',
      wireframeToggle: 'Alternar Ligações Wireframe',
      metrics: [
        { value: '2027', label: 'Conclusão Licenciatura ISEC' },
        { value: '4+', label: 'Sistemas Arquitetados de Raiz' },
        { value: '48h', label: 'Prototipagem ShiftAppens Hackathon' },
        { value: 'C2', label: 'Proficiência Bilingue (PT / EN)' },
      ],
    },
    about: {
      sectionIndex: '01. Sobre Mim',
      heading: 'Desenvolvimento Full-Stack focado em soluções reais',
      locationLabel: 'Localização Atual',
      educationLabel: 'Instituição Académica',
      educationValue: 'ISEC — Instituto Superior de Engenharia de Coimbra',
      focusLabel: 'Áreas de Especialização',
      focusValue: 'Full-Stack, Backend & IA Aplicada',
    },
    techStack: {
      sectionIndex: '02. Competências Técnicas',
      heading: 'TECH STACK',
      subtitle:
        'Organização em Pirâmide Invertida extraída do currículo. Clique em qualquer tecnologia para filtrar imediatamente os projetos relacionados.',
      level1Title: 'Nível 1 · Topo Largo — Core Stack & Linguagens Principais',
      level2Title: 'Nível 2 · Centro — Bases de Dados, Backend, Cloud, DevOps & Arquitetura',
      level3Title: 'Nível 3 · Vértice Invertido — UI/UX, Mobile, Desktop, 3D & Sistemas Embebidos',
      activeFilterPrefix: 'Filtro de tecnologia ativo:',
      clearFilter: 'Limpar filtro',
      viewFilteredProjects: 'Ver projetos com esta tecnologia',
    },
    career: {
      sectionIndex: '03. Percurso Académico, Liderança & Experiência',
      heading: 'My career & experience',
      subtitle:
        'Linha evolutiva sincronizada com o scroll — da programação de microcontroladores em C e apoio técnico no voleibol até à Engenharia Informática no ISEC e projetos de software.',
    },
    projects: {
      sectionIndex: '04. Obras & Engenharia de Software',
      heading: 'Projetos em Destaque',
      subtitle:
        'Sincronizado com os projetos nucleares do currículo e repositórios. Rode o carrossel circular ou explore o arquivo completo.',
      syncingNotice: 'A sincronizar repositórios públicos de @JoaoBarao18 via GitHub API...',
      syncedLive: 'Sincronizado com GitHub API (@JoaoBarao18)',
      syncedFallback: 'A utilizar arquivo verificado do CV + cache local (@JoaoBarao18)',
      prevProject: 'Projeto Anterior',
      nextProject: 'Próximo Projeto',
      viewRepo: 'Ver Repositório GitHub',
      liveDemo: 'Live Demo',
      featuredTag: 'Destaque CV',
      githubPagesTag: 'GitHub Pages Ativo',
      seeFullWork: 'Ver Todo o Trabalho',
      backToLanding: 'Voltar ao Portfólio Principal',
      fullWorkTitle: 'Arquivo Completo de Projetos & Repositórios',
      fullWorkSubtitle:
        'Todos os projetos académicos, sistemas aplicados e repositórios públicos de João Barão.',
      searchPlaceholder: 'Pesquisar por nome, tecnologia (ex: Java, React, C, Supabase)...',
      allFilter: 'Todos os Projetos',
      noProjectsFound: 'Nenhum projeto encontrado para os critérios selecionados.',
      resetFilters: 'Repor Filtros',
    },
    certifications: {
      sectionIndex: '05. Qualificações & Comunicação',
      heading: 'Certificações & Línguas',
      subtitle: 'Certificados verificados (clique na imagem para ampliar em Lightbox) e proficiência linguística.',
      certsSubheading: 'Certificações & Reconhecimentos',
      langsSubheading: 'Línguas & Proficiência (CEFR)',
      completedIn: 'Data de conclusão:',
      openLightbox: 'Ampliar certificado',
      closeLightbox: 'Fechar visualização (Esc)',
    },
    contact: {
      sectionIndex: '06. Contacto Direto',
      heading: 'Vamos construir software sólido em equipa',
      subtitle:
        'Disponível para estágios curriculares/de verão, projetos Full-Stack & Backend ou oportunidades de Engenharia de Software em Coimbra, remoto ou híbrido.',
      emailLabel: 'Email Direto',
      locationLabel: 'Endereço / Localização',
      phoneLabel: 'Telefone',
      sendEmailCta: 'Enviar Email Agora',
      downloadCvPt: 'Descarregar CV (Português)',
      downloadCvEn: 'Descarregar CV (English)',
    },
    thankYou: {
      kicker: 'Download Iniciado com Sucesso',
      heading: 'Obrigado pelo seu interesse no meu percurso!',
      message:
        'O download do meu currículo em PDF foi iniciado automaticamente. Caso pretenda agendar uma conversa técnica, discutir arquitetura de sistemas ou conhecer melhor a minha experiência no ISEC, terei todo o gosto em responder.',
      downloadAgainPt: 'Descarregar Novamente (CV PT)',
      downloadAgainEn: 'Descarregar Novamente (CV EN)',
      connectLinkedin: 'Conectar no LinkedIn',
      sendDirectEmail: 'Enviar Email Direto',
      backHome: 'Voltar à Página Principal',
    },
    notFound: {
      code: 'Erro 404',
      heading: 'Coordenada fora da malha tridimensional',
      message: 'A rota que tentou aceder não existe ou foi movida. Regresse ao ponto inicial do portfólio.',
      backHome: 'Voltar ao Início',
    },
    cookies: {
      title: 'Privacidade & Preferências de Cookies (RGPD)',
      description:
        'Este portfólio utiliza cookies essenciais para guardar as suas preferências de tema (Light/Dark) e idioma (PT/EN), e Google Analytics (G-8NCX5W9LVV) apenas mediante o seu consentimento explícito.',
      acceptAll: 'Aceitar Todos',
      essentialOnly: 'Apenas Essenciais',
      manage: 'Gerir Preferências',
      savePreferences: 'Guardar Preferências',
      analyticsLabel: 'Cookies Analíticos (Google Analytics G-8NCX5W9LVV)',
      essentialLabel: 'Cookies Estritamente Necessários (Tema, Idioma e Sessão Local)',
    },
    footer: {
      rights: 'Todos os direitos reservados.',
      location: 'Coimbra, Portugal',
      privacyLink: 'Política de Privacidade',
      termsLink: 'Termos de Uso',
      cookiesLink: 'Preferências de Cookies',
      adminLink: 'Admin',
    },
    legal: {
      backButton: 'Voltar ao Portfólio',
      privacyTitle: 'Política de Privacidade e Proteção de Dados (RGPD)',
      privacyUpdated: 'Última atualização: Novembro de 2026',
      privacySections: [
        {
          h: '1. Responsável pelo Tratamento de Dados',
          p: 'O responsável pelo tratamento dos dados recolhidos neste website é João Barão, residente em Coimbra, Portugal, contactável através do endereço eletrónico jrspsbarao@gmail.com.',
        },
        {
          h: '2. Dados Recolhidos e Finalidade',
          p: 'Este portfólio não recolhe dados pessoais identificáveis sem o conhecimento do utilizador. Armazenamos localmente (no localStorage do seu navegador) apenas preferências técnicas de visualização (modo claro/escuro e idioma PT/EN). Caso aceite os cookies analíticos, o serviço Google Analytics 4 (ID: G-8NCX5W9LVV) recolhe dados estatísticos anonimizados sobre páginas visitadas e eventos de interação (como cliques em projetos ou download de currículo).',
        },
        {
          h: '3. Fundamento Jurídico e Consentimento (RGPD)',
          p: 'Em estrita conformidade com o Regulamento (UE) 2016/679 (RGPD), o carregamento do script Google Analytics só é executado após ação explícita do utilizador no botão "Aceitar Todos" ou ativação manual nas preferências de cookies.',
        },
        {
          h: '4. Direitos do Titular dos Dados',
          p: 'O utilizador pode, a qualquer momento, revogar o consentimento de cookies através do link "Preferências de Cookies" no rodapé, limpar o armazenamento local do navegador ou solicitar esclarecimentos através de jrspsbarao@gmail.com.',
        },
      ],
      termsTitle: 'Termos e Condições de Utilização',
      termsUpdated: 'Última atualização: Novembro de 2026',
      termsSections: [
        {
          h: '1. Âmbito e Objeto',
          p: 'O presente website constitui o portfólio profissional e académico de João Barão, apresentando projetos de engenharia de software, experiência académica no ISEC e qualificações técnicas.',
        },
        {
          h: '2. Propriedade Intelectual',
          p: 'Todo o código-fonte original, arquitetura 3D em Three.js, textos biográficos, fotografias de retrato e currículos em PDF são propriedade intelectual de João Barão, salvo indicação em contrário nos repositórios open-source alojados no GitHub (@JoaoBarao18).',
        },
        {
          h: '3. Ligações Externas e GitHub API',
          p: 'Este portfólio integra dados públicos provenientes da API oficial do GitHub e disponibiliza ligações para o LinkedIn e repositórios externos. João Barão não se responsabiliza por alterações nas políticas de plataformas de terceiros.',
        },
      ],
    },
    admin: {
      title: 'Painel de Administração do Portfólio',
      subtitle: 'Gerir Certificações, Línguas, Projetos em Destaque e Paleta 60-30-10',
      loginHeading: 'Autenticação de Administrador',
      loginHint: 'Acesso restrito ao proprietário do portfólio. Introduza a palavra-passe de administrador.',
      passwordLabel: 'Palavra-passe de Administrador',
      githubTokenLabel: 'GitHub Personal Access Token (Opcional)',
      loginButton: 'Entrar no Painel Admin',
      logoutButton: 'Terminar Sessão',
      invalidPassword: 'Palavra-passe incorreta. Acesso negado.',
      savedSuccess: 'Alterações guardadas com sucesso no armazenamento local! Todos os componentes foram atualizados.',
      exportJson: 'Exportar portfolio-data.json',
      resetDefaults: 'Repor Valores Originais',
      certSectionTitle: 'Gestor de Certificações (CRUD)',
      certNamePtLabel: 'Nome da Certificação (PT)',
      certNameEnLabel: 'Nome da Certificação (EN)',
      certDateLabel: 'Data onde tirou (Mês/Ano)',
      certPhotoLabel: 'Foto do Certificado (URL ou Upload de Imagem)',
      addCertButton: 'Guardar Certificação',
      langSectionTitle: 'Gestor de Línguas (CRUD)',
      langNamePtLabel: 'Qual a Língua (PT)',
      langNameEnLabel: 'Qual a Língua (EN)',
      langLevelPtLabel: 'Nível (PT — ex: Nativo, C2, B2)',
      langLevelEnLabel: 'Nível (EN — ex: Native, C2, B2)',
      addLangButton: 'Adicionar Língua',
      paletteSectionTitle: 'Paleta de Cores 60% - 30% - 10% (Sem Néon)',
      savePaletteButton: 'Aplicar & Guardar Paleta',
      projectsSectionTitle: 'Gestor de Projetos no Carrossel Circular vs. Full Work',
    },
  },
  en: {
    seo: {
      homeTitle: 'João Barão — Software Engineer & Full-Stack Developer | 3D Portfolio',
      homeDesc:
        '3D interactive portfolio of João Barão — Final-Year Computer Science & Engineering Student at ISEC, Full-Stack & Backend Developer (Java, Spring Boot, React.js, TypeScript & C/C++) based in Coimbra, Portugal.',
      workTitle: 'Full Project Archive — João Barão | Software Engineering',
      workDesc:
        'Explore all software engineering projects and GitHub repositories by João Barão: Saber+, Deep Sea Mining, ENTREGA-SO, myMenu, and systems built with Java, Spring Boot, React.js, TypeScript, and C.',
      thankYouTitle: 'Thank You for Downloading My Resume — João Barão',
      thankYouDesc:
        'Thank you for downloading João Barão’s CV. Connect on LinkedIn or reach out via email for Full-Stack and Backend Software Engineering opportunities.',
      privacyTitle: 'Privacy Policy (GDPR) — João Barão',
      privacyDesc: 'GDPR-compliant Privacy Policy and personal data protection terms for João Barão’s portfolio.',
      termsTitle: 'Terms of Use — João Barão',
      termsDesc: 'Terms of use, intellectual property rights, and copyright information for João Barão’s portfolio.',
      adminTitle: 'Admin Dashboard — João Barão Portfolio',
      adminDesc: 'Manage featured projects, certifications, languages, and the 60-30-10 color palette.',
      notFoundTitle: '404 · Page Not Found — João Barão',
      notFoundDesc: 'The requested page could not be found on João Barão’s portfolio. Return to the home page.',
    },
    loading: {
      initializing: 'Initializing 3D editorial environment...',
      buildingMesh: 'Constructing 3D point-cloud mesh from portrait & calibrating studio lighting...',
      syncingGithub: 'Synchronizing GitHub repositories (@JoaoBarao18) and CV projects...',
      ready: 'Portfolio ready. Entering...',
      skipButton: 'Enter Immediately',
    },
    nav: {
      home: 'Home',
      about: 'About Me',
      techStack: 'Tech Stack',
      career: 'Career',
      projects: 'Projects',
      certifications: 'Certifications',
      contact: 'Contact',
      fullWork: 'Archive',
      ctaDownloadCv: 'Download CV',
      ctaContact: 'Contact Me',
      themeLight: 'Switch to Light Mode (Champagne)',
      themeDark: 'Switch to Dark Mode (Emerald Ink)',
      langSwitch: 'Switch language to Portuguese',
    },
    hero: {
      kicker: 'Coimbra, Portugal · ISEC Computer Science & Engineering',
      greeting: "Hello, I'm",
      roleBadge: 'Full-Stack & Backend Software Engineering',
      primaryCta: 'Download CV (EN)',
      secondaryCta: 'Download CV (PT)',
      exploreWorkCta: 'Explore Projects',
      contactCta: 'Get in Touch',
      canvasHint: 'Move your cursor across the 3D mesh to interact with depth particles',
      pauseMotion: 'Pause 3D Mesh',
      resumeMotion: 'Resume 3D Mesh',
      resetCamera: 'Reset 3D View',
      wireframeToggle: 'Toggle Wireframe Links',
      metrics: [
        { value: '2027', label: 'Expected B.Sc. Graduation @ ISEC' },
        { value: '4+', label: 'End-to-End Architected Systems' },
        { value: '48h', label: 'ShiftAppens Hackathon Prototyping' },
        { value: 'C2', label: 'Bilingual Proficiency (PT / EN)' },
      ],
    },
    about: {
      sectionIndex: '01. About Me',
      heading: 'Full-Stack development focused on real-world solutions',
      locationLabel: 'Current Location',
      educationLabel: 'Academic Institution',
      educationValue: 'ISEC — Coimbra Institute of Engineering',
      focusLabel: 'Core Concentrations',
      focusValue: 'Full-Stack, Backend & Applied AI',
    },
    techStack: {
      sectionIndex: '02. Technical Skills',
      heading: 'TECH STACK',
      subtitle:
        'Organized as an Inverted Pyramid extracted directly from my CV. Click any technology to filter matching projects immediately.',
      level1Title: 'Level 1 · Wide Top — Core Stack & Primary Languages',
      level2Title: 'Level 2 · Center — Databases, Backend, Cloud, DevOps & Architecture',
      level3Title: 'Level 3 · Inverted Apex — UI/UX, Mobile, Desktop, 3D & Embedded Systems',
      activeFilterPrefix: 'Active technology filter:',
      clearFilter: 'Clear filter',
      viewFilteredProjects: 'View projects using this technology',
    },
    career: {
      sectionIndex: '03. Academic Journey, Leadership & Experience',
      heading: 'My career & experience',
      subtitle:
        'Scroll-synchronized evolutionary timeline — from Embedded C microcontrollers and youth volleyball coaching to Computer Science & Engineering at ISEC and software systems.',
    },
    projects: {
      sectionIndex: '04. Selected Works & Software Engineering',
      heading: 'Featured Projects',
      subtitle:
        'Synchronized with core CV engineering projects and public repositories. Rotate the circular carousel or inspect the full archive.',
      syncingNotice: 'Synchronizing public repositories from @JoaoBarao18 via GitHub API...',
      syncedLive: 'Synchronized with GitHub API (@JoaoBarao18)',
      syncedFallback: 'Using verified CV project archive + local cache (@JoaoBarao18)',
      prevProject: 'Previous Project',
      nextProject: 'Next Project',
      viewRepo: 'View GitHub Repo',
      liveDemo: 'Live Demo',
      featuredTag: 'CV Highlight',
      githubPagesTag: 'GitHub Pages Active',
      seeFullWork: 'See Full Work',
      backToLanding: 'Back to Main Portfolio',
      fullWorkTitle: 'Complete Project & Repository Archive',
      fullWorkSubtitle:
        'All academic engineering systems, software projects, and public repositories from João Barão.',
      searchPlaceholder: 'Search by project title, language, or stack (e.g., Java, React, C, Supabase)...',
      allFilter: 'All Projects',
      noProjectsFound: 'No projects match your current filter criteria.',
      resetFilters: 'Reset Filters',
    },
    certifications: {
      sectionIndex: '05. Qualifications & Communication',
      heading: 'Certifications & Languages',
      subtitle: 'Verified certificates (click any certificate image to inspect in full-screen Lightbox) and spoken languages.',
      certsSubheading: 'Certifications & Awards',
      langsSubheading: 'Languages & Proficiency (CEFR)',
      completedIn: 'Completed:',
      openLightbox: 'Enlarge certificate',
      closeLightbox: 'Close preview (Esc)',
    },
    contact: {
      sectionIndex: '06. Direct Contact',
      heading: "Let's build resilient software together",
      subtitle:
        'Available for software engineering internships, Full-Stack & Backend roles, and collaborative engineering projects in Coimbra, remote, or hybrid.',
      emailLabel: 'Direct Email',
      locationLabel: 'Physical Location',
      phoneLabel: 'Phone',
      sendEmailCta: 'Send Email Now',
      downloadCvPt: 'Download CV (Portuguese)',
      downloadCvEn: 'Download CV (English)',
    },
    thankYou: {
      kicker: 'Resume Download Started',
      heading: 'Thank you for your interest in my work!',
      message:
        'Your PDF resume download has started automatically. If you would like to schedule a technical interview, discuss software architecture, or learn more about my experience at ISEC, feel free to connect on LinkedIn or email me directly.',
      downloadAgainPt: 'Download Again (CV PT)',
      downloadAgainEn: 'Download Again (CV EN)',
      connectLinkedin: 'Connect on LinkedIn',
      sendDirectEmail: 'Send Direct Email',
      backHome: 'Back to Main Portfolio',
    },
    notFound: {
      code: 'Error 404',
      heading: 'Coordinate outside the 3D point cloud',
      message: 'The route you requested does not exist or has moved. Return to the main portfolio.',
      backHome: 'Return Home',
    },
    cookies: {
      title: 'Privacy & Cookie Preferences (GDPR)',
      description:
        'This portfolio uses essential storage to remember your theme (Light/Dark) and language (PT/EN) preferences, and loads Google Analytics (G-8NCX5W9LVV) strictly after your explicit consent.',
      acceptAll: 'Accept All',
      essentialOnly: 'Essential Only',
      manage: 'Manage Preferences',
      savePreferences: 'Save Preferences',
      analyticsLabel: 'Analytics Cookies (Google Analytics G-8NCX5W9LVV)',
      essentialLabel: 'Strictly Necessary Storage (Theme, Language & Local State)',
    },
    footer: {
      rights: 'All rights reserved.',
      location: 'Coimbra, Portugal',
      privacyLink: 'Privacy Policy',
      termsLink: 'Terms of Use',
      cookiesLink: 'Cookie Preferences',
      adminLink: 'Admin',
    },
    legal: {
      backButton: 'Back to Portfolio',
      privacyTitle: 'Privacy Policy & GDPR Data Protection',
      privacyUpdated: 'Last updated: November 2026',
      privacySections: [
        {
          h: '1. Data Controller',
          p: 'The data controller responsible for this portfolio website is João Barão, based in Coimbra, Portugal, reachable via email at jrspsbarao@gmail.com.',
        },
        {
          h: '2. Collected Data & Purpose',
          p: 'This portfolio does not collect personally identifiable data without your consent. We store technical display preferences (light/dark theme and PT/EN language) locally in your browser’s localStorage. Only if you explicitly opt in to analytics cookies will Google Analytics 4 (Measurement ID: G-8NCX5W9LVV) collect anonymized usage metrics (such as page views and CV downloads).',
        },
        {
          h: '3. Legal Basis & GDPR Consent',
          p: 'In strict compliance with Regulation (EU) 2016/679 (GDPR), Google Analytics scripts remain disabled by default and only initialize after you click "Accept All" or enable analytics in the Cookie Preferences panel.',
        },
        {
          h: '4. Your Rights',
          p: 'You may withdraw your cookie consent at any time via the "Cookie Preferences" link in the footer, clear your browser storage, or contact jrspsbarao@gmail.com for any privacy inquiries.',
        },
      ],
      termsTitle: 'Terms of Use',
      termsUpdated: 'Last updated: November 2026',
      termsSections: [
        {
          h: '1. Scope',
          p: 'This website serves as the interactive academic and professional software engineering portfolio of João Barão, showcasing technical projects, ISEC coursework, and engineering qualifications.',
        },
        {
          h: '2. Intellectual Property',
          p: 'All original source code, 3D WebGL visualizers, biographical texts, portrait photography, and PDF resumes are the intellectual property of João Barão, except where open-source licenses apply in public GitHub repositories (@JoaoBarao18).',
        },
        {
          h: '3. External Links & GitHub API',
          p: 'This portfolio dynamically fetches public repository metadata via the GitHub API and links to LinkedIn and GitHub. João Barão is not responsible for third-party platform availability or external privacy policies.',
        },
      ],
    },
    admin: {
      title: 'Portfolio Administration Panel',
      subtitle: 'Manage Certifications, Spoken Languages, Featured Projects & 60-30-10 Palette',
      loginHeading: 'Administrator Authentication',
      loginHint: 'Restricted access for portfolio owner only. Please enter the administrator password.',
      passwordLabel: 'Administrator Password',
      githubTokenLabel: 'GitHub Personal Access Token (Optional)',
      loginButton: 'Sign In to Admin',
      logoutButton: 'Sign Out',
      invalidPassword: 'Incorrect password. Access denied.',
      savedSuccess: 'Changes saved to localStorage and applied across the portfolio immediately!',
      exportJson: 'Export portfolio-data.json',
      resetDefaults: 'Reset to Defaults',
      certSectionTitle: 'Certifications Manager (CRUD)',
      certNamePtLabel: 'Certification Name (PT)',
      certNameEnLabel: 'Certification Name (EN)',
      certDateLabel: 'Completion Date (MM/YYYY)',
      certPhotoLabel: 'Certificate Photo (Image URL or File Upload)',
      addCertButton: 'Save Certification',
      langSectionTitle: 'Languages Manager (CRUD)',
      langNamePtLabel: 'Language Name (PT)',
      langNameEnLabel: 'Language Name (EN)',
      langLevelPtLabel: 'Proficiency Level (PT — e.g. Nativo, C2)',
      langLevelEnLabel: 'Proficiency Level (EN — e.g. Native, C2)',
      addLangButton: 'Add Language',
      paletteSectionTitle: '60% - 30% - 10% Color Palette (Matte Editorial, No Neon)',
      savePaletteButton: 'Apply & Save Palette',
      projectsSectionTitle: 'Circular Carousel vs. Full Work Project Selection',
    },
  },
};
