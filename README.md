# Claude to Gemini Converter CLI

A CLI tool to convert Anthropic Claude "Code" configurations (Plugins, Agents, Skills) into Google Gemini Agent Skills.


This tool uses **gemini-2.0-flash-exp** (via the API) to intelligently parse, refine, and restructure your existing agent definitions into the format required by the Gemini Agent Playground.

## Why this Tool?

Claude Code has offered powerful agents and plugins for a while, but until now, there was no easy way to access these capabilities within the Gemini ecosystem. This repository solves that problem by converting existing configurations so you can use them with Gemini immediately.

This is made possible by the new **Gemini Agent Skill** feature, which empowers Gemini to handle complex tasks just like other advanced AI coding tools. You can read the [official documentation here](https://geminicli.com/docs/cli/skills/).

## Credits

This project builds upon the amazing work done by the [VoltAgent](https://github.com/VoltAgent/awesome-claude-code-subagents) team. They created the original collection of Claude Code subagents, and we want to give them full credit for these definitions. My goal is to take these proven agent patterns and optimize them for even greater efficiency on Gemini.


## What's Next?

I am dedicated to optimizing these agents to be fully native and highly efficient within the Gemini ecosystem.

Currently, I am developing an advanced configuration system that utilizes [Project Mitra](https://github.com/saeed-vayghan/mitra).
This will unlock deeper customization and more structured control over your Gemini Agent Skills.

## Features

- **Dual Conversion Modes**:
    - **Plugin Mode (Default)**: Merges a complex directory of multiple agents and nested skills into a **Single Unified Gemini Skill**.
    - **Agents Mode**: Batch converts a directory of individual agent markdown files into separate, independent Gemini Skills.
- **AI-Powered Analysis**: Automatically understands directory structures and categorizes files as Personas (Agents) or Workflows (Skills).
- **Smart Asset Extraction**: Extracts code blocks from agent prompts into file assets.
- **Link Fidelity**: Automatically detects and fixes broken internal links in your markdown files.
- **Registry System**: Generates structured `SKILL.md` files with Persona and Workflow registries.

## Agile & Custom Usage

**You do NOT need to install every agent!**

The beauty of this system is its modularity. You should treat this repository as a **menu of capabilities**:

1.  **Browse the Categories**: Look through the list below and find the specific expert you need (e.g., just the `sql-pro` and `backend-developer`).
2.  **Pick & Choose**: Clone or convert only the specific agents relevant to your current project.
3.  **Bring Your Own**: If you have your own custom Claude prompts or agents, use the CLI tool to instantly convert them into Gemini-ready skills.

**Build your own perfect team of AI experts, tailored exactly to your workflow.**

## Installation

```bash
# Clone repository
git clone <repo-url>
cd cli

# Install dependencies
npm install

# Build
npm run build
```

## Configuration

Create a `.env` file in the `cli` directory with your Google Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

## Usage

### 1. Plugin Mode (Default)
Best for converting full Claude Plugins that contain multiple agents and tools working together.

```bash
# Convert a directory
node dist/index.js convert --input ../path/to/claude-plugin --output ../my-gemini-skills

# Force overwrite if output exists
node dist/index.js convert --input ../claude-plugin --force
```

**Output Structure:**
A single folder in output dir:
```
my-gemini-skills/
  └── MyPluginName/
      ├── SKILL.md (Unified instructions)
      ├── references/
      │   └── workflows/ (Flattened skills)
      └── assets/
      └── scripts/
```

### 2. Agents Mode
Best for converting a folder of loose, independent agent files (e.g., `expert-coder.md`, `writer.md`).

```bash
# Use the --agents flag
node dist/index.js convert --input ../my-agents-folder --agents
```

**Output Structure:**
Multiple folders in output dir:
```
my-gemini-skills/
  ├── expert-coder/
  │   └── SKILL.md
  │   ├── ...
  └── writer/
      └── SKILL.md
      ├── ...
```


## 📚 Categories

### 01. Core Development
Essential development subagents for everyday coding tasks.

- [**api-designer**](.gemini/skills/api-designer/SKILL.md) - REST and GraphQL API architect
- [**backend-developer**](.gemini/skills/backend-developer/SKILL.md) - Server-side expert for scalable APIs
- [**electron-pro**](.gemini/skills/electron-pro/SKILL.md) - Desktop application expert
- [**frontend-developer**](.gemini/skills/frontend-developer/SKILL.md) - UI/UX specialist for React, Vue, and Angular
- [**fullstack-developer**](.gemini/skills/fullstack-developer/SKILL.md) - End-to-end feature development
- [**graphql-architect**](.gemini/skills/graphql-architect/SKILL.md) - GraphQL schema and federation expert
- [**microservices-architect**](.gemini/skills/microservices-architect/SKILL.md) - Distributed systems designer
- [**mobile-developer**](.gemini/skills/mobile-developer/SKILL.md) - Cross-platform mobile specialist
- [**ui-designer**](.gemini/skills/ui-designer/SKILL.md) - Visual design and interaction specialist
- [**websocket-engineer**](.gemini/skills/websocket-engineer/SKILL.md) - Real-time communication specialist
- [**wordpress-master**](categories/08-business-product/wordpress-master.md) - WordPress development and optimization expert

### [02. Language Specialists](categories/02-language-specialists/)
Language-specific experts with deep framework knowledge.
- [**typescript-pro**](.gemini/skills/typescript-pro/SKILL.md) - TypeScript specialist
- [**sql-pro**](.gemini/skills/sql-pro/SKILL.md) - Database query expert
- [**swift-expert**](.gemini/skills/swift-expert/SKILL.md) - iOS and macOS specialist
- [**vue-expert**](.gemini/skills/vue-expert/SKILL.md) - Vue 3 Composition API expert
- [**angular-architect**](.gemini/skills/angular-architect/SKILL.md) - Angular 15+ enterprise patterns expert
- [**cpp-pro**](.gemini/skills/cpp-pro/SKILL.md) - C++ performance expert
- [**csharp-developer**](.gemini/skills/csharp-developer/SKILL.md) - .NET ecosystem specialist
- [**django-developer**](.gemini/skills/django-developer/SKILL.md) - Django 4+ web development expert
- [**dotnet-core-expert**](.gemini/skills/dotnet-core/SKILL-expert.md) - .NET 8 cross-platform specialist
- [**dotnet-framework-4.8-expert**](.gemini/skills/dotnet-framework/SKILL-4.8-expert.md) - .NET Framework legacy enterprise specialist
- [**elixir-expert**](.gemini/skills/elixir-expert/SKILL.md) - Elixir and OTP fault-tolerant systems expert
- [**flutter-expert**](.gemini/skills/flutter-expert/SKILL.md) - Flutter 3+ cross-platform mobile expert
- [**golang-pro**](.gemini/skills/golang-pro/SKILL.md) - Go concurrency specialist
- [**java-architect**](.gemini/skills/java-architect/SKILL.md) - Enterprise Java expert
- [**javascript-pro**](.gemini/skills/javascript-pro/SKILL.md) - JavaScript development expert
- [**powershell-5.1-expert**](.gemini/skills/powershell-5/SKILL.1-expert.md) - Windows PowerShell 5.1 and full .NET Framework automation specialist
- [**powershell-7-expert**](.gemini/skills/powershell-7/SKILL-expert.md) - Cross-platform PowerShell 7+ automation and modern .NET specialist
- [**kotlin-specialist**](.gemini/skills/kotlin-specialist/SKILL.md) - Modern JVM language expert
- [**laravel-specialist**](.gemini/skills/laravel-specialist/SKILL.md) - Laravel 10+ PHP framework expert
- [**nextjs-developer**](.gemini/skills/nextjs-developer/SKILL.md) - Next.js 14+ full-stack specialist
- [**php-pro**](.gemini/skills/php-pro/SKILL.md) - PHP web development expert
- [**python-pro**](.gemini/skills/python-pro/SKILL.md) - Python ecosystem master
- [**rails-expert**](.gemini/skills/rails-expert/SKILL.md) - Rails 8.1 rapid development expert
- [**react-specialist**](.gemini/skills/react-specialist/SKILL.md) - React 18+ modern patterns expert
- [**rust-engineer**](.gemini/skills/rust-engineer/SKILL.md) - Systems programming expert
- [**spring-boot-engineer**](.gemini/skills/spring-boot-engineer/SKILL.md) - Spring Boot 3+ microservices expert


### 03. Infrastructure
DevOps, cloud, and deployment specialists.

- [**azure-infra-engineer**](.gemini/skills/azure-infra-engineer/SKILL.md) - Azure infrastructure and Az PowerShell automation expert
- [**cloud-architect**](.gemini/skills/cloud-architect/SKILL.md) - AWS/GCP/Azure specialist
- [**database-administrator**](.gemini/skills/database-administrator/SKILL.md) - Database management expert
- [**deployment-engineer**](.gemini/skills/deployment-engineer/SKILL.md) - Deployment automation specialist
- [**devops-engineer**](.gemini/skills/devops-engineer/SKILL.md) - CI/CD and automation expert
- [**devops-incident-responder**](.gemini/skills/devops-incident-responder/SKILL.md) - DevOps incident management
- [**incident-responder**](.gemini/skills/incident-responder/SKILL.md) - System incident response expert
- [**kubernetes-specialist**](.gemini/skills/kubernetes-specialist/SKILL.md) - Container orchestration master
- [**network-engineer**](.gemini/skills/network-engineer/SKILL.md) - Network infrastructure specialist
- [**platform-engineer**](.gemini/skills/platform-engineer/SKILL.md) - Platform architecture expert
- [**security-engineer**](.gemini/skills/security-engineer/SKILL.md) - Infrastructure security specialist
- [**sre-engineer**](.gemini/skills/sre-engineer/SKILL.md) - Site reliability engineering expert
- [**terraform-engineer**](.gemini/skills/terraform-engineer/SKILL.md) - Infrastructure as Code expert
- [**windows-infra-admin**](.gemini/skills/windows-infra-admin/SKILL.md) - Active Directory, DNS, DHCP, and GPO automation specialist

### 04. Quality & Security
Testing, security, and code quality experts.

- [**accessibility-tester**](.gemini/skills/accessibility-tester/SKILL.md) - A11y compliance expert
- [**architect-reviewer**](.gemini/skills/architect-reviewer/SKILL.md) - Architecture review specialist
- [**chaos-engineer**](.gemini/skills/chaos-engineer/SKILL.md) - System resilience testing expert
- [**code-reviewer**](.gemini/skills/code-reviewer/SKILL.md) - Code quality guardian
- [**compliance-auditor**](.gemini/skills/compliance-auditor/SKILL.md) - Regulatory compliance expert
- [**debugger**](.gemini/skills/debugger/SKILL.md) - Advanced debugging specialist
- [**error-detective**](.gemini/skills/error-detective/SKILL.md) - Error analysis and resolution expert
- [**penetration-tester**](.gemini/skills/penetration-tester/SKILL.md) - Ethical hacking specialist
- [**performance-engineer**](.gemini/skills/performance-engineer/SKILL.md) - Performance optimization expert
- [**qa-expert**](.gemini/skills/qa-expert/SKILL.md) - Test automation specialist
- [**security-auditor**](.gemini/skills/security-auditor/SKILL.md) - Security vulnerability expert
- [**test-automator**](.gemini/skills/test-automator/SKILL.md) - Test automation framework expert
