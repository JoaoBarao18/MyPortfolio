# João Barão — 3D Interactive Portfolio

Portfólio moderno, interativo e imersivo com renderização 3D (Three.js), animações fluidas (GSAP), internacionalização (PT/EN), alternância de tema escuro/claro e painel de administração integrado.

🌐 **Website oficial:** [https://joaodev18.com](https://joaodev18.com)

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 19 + TypeScript + Vite
- **Estilização:** Tailwind CSS (Arquitetura 60-30-10)
- **Gráficos 3D:** Three.js (Rosto interativo reativo ao cursor do rato e giroscópio)
- **Animações:** GSAP + ScrollTrigger
- **Deploy & Hosting:** Cloudflare Workers Static Assets + Domínio Próprio Cloudflare (`joaodev18.com`)

---

## 🛠️ Como Executar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acede a `http://localhost:3000` no navegador.

3. **Compilar para produção:**
   ```bash
   npm run build
   ```

---

## 🔄 Como Atualizar e Fazer Deploy do Site

Sempre que fizeres alterações no código ou nos ficheiros locais, publica a nova versão na Cloudflare com apenas:

```bash
npm run build
npx wrangler deploy
```

Em poucos segundos, a nova versão estará online em [https://joaodev18.com](https://joaodev18.com).

---

## ⚙️ Guia do Painel de Administração (Admin Mode)

O portfólio inclui um painel de administração completo para gerir projetos, vídeos demonstrativos, certificações, línguas e paleta de cores sem precisar de mexer no código.

### 1. Como Aceder ao Admin Mode
- Acede a: **`https://joaodev18.com/#admin`** (ou `http://localhost:3000/#admin` se estiveres localmente).
- Insere a tua palavra-passe de administrador para desbloquear o painel.

### 2. O que podes gerir no Admin:
- **Projetos:** Adicionar novos repositórios/projetos, editar títulos e descrições (PT e EN), tecnologias, links do GitHub e live demo, imagens de capa e URLs de **vídeo demonstrativo** (com autoplay em hover ou reprodução em modal).
- **Certificações:** Adicionar ou remover certificados com imagem, emissor e data.
- **Línguas Faladas:** Gerir idiomas e respetivos níveis de proficiência.
- **Paleta de Cores:** Ajustar cores da regra 60-30-10 para temas claro e escuro.

### 3. Como fazer as alterações do Admin aparecerem no site público:

1. **Faz as alterações desejadas** no Admin Mode e clica em **Guardar**.
2. No topo do painel de administração, clica no botão **"Exportar portfolio-data.json"** (ou **"Export JSON"**).
3. O teu navegador vai descarregar o ficheiro `portfolio-data.json`.
4. Move esse ficheiro para a pasta **`public/`** do projeto no teu computador:
   ```text
   public/portfolio-data.json
   ```
5. Faz o build e o deploy pelo terminal:
   ```bash
   npm run build
   npx wrangler deploy
   ```
6. *(Opcional)* Envia a atualização para o GitHub para manter o repositório sincronizado:
   ```bash
   git add public/portfolio-data.json
   git commit -m "Update portfolio projects and data"
   git push
   ```

> **Nota:** O website está configurado para ler automaticamente o ficheiro `portfolio-data.json` na raiz pública. Assim que o deploy é concluído, todos os visitantes que acederem ao site verão imediatamente as tuas alterações!

---

## 📁 Estrutura do Projeto

```text
├── public/                 # Ficheiros estáticos públicos
│   ├── assets/             # Imagens, previews e vídeos
│   └── portfolio-data.json # Dados exportados do Admin (projetos, certificados)
├── src/
│   ├── App.tsx             # Componente raiz, gestão de rotas e estado global
│   ├── components.tsx      # Secções da UI, carrossel 3D, Admin e modais
│   ├── face3d.ts           # Motor Three.js do rosto 3D interativo
│   ├── github.ts           # Tipagens e projetos fallback do CV
│   ├── i18n.ts             # Dicionários de tradução (PT/EN) e paletas de cores
│   └── portfolioLogic.ts   # Lógica pura de filtros, SEO, rotas e autenticação
├── index.html              # Ponto de entrada HTML com metadados e OpenGraph
├── vite.config.ts          # Configuração do Vite com Tailwind CSS
└── wrangler.jsonc          # Configuração de deploy da Cloudflare Workers
```
