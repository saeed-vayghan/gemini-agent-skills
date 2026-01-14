## Gemini Agent Skill
A comprehensive collection of expert AI Agent Skills for Google Gemini.

## Claude to Gemini Converter CLI

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

## Using Gemini Agent Skills

Once you have generated your skills, you can interact with them directly in the Gemini CLI.

**How to use:**

```bash

# Install Gemini@0.24.0-preview.0
npm install -g @google/gemini-cli@0.24.0-preview.0

# Confirm version
gemini --version               
> 0.24.0-preview.0

# Clone repository
git clone https://github.com/saeed-vayghan/gemini-agent-skills.git

# Copy any skill to your .gemini/skills directory
cp .gemini/skills/<any-skill> /path/to/your/.gemini/skills/


# Run Gemini CLI
gemini

> /skills list

- api-auditor
    Expertise in auditing and testing API endpoints. Use when the user asks to "check", "test", or "audit" a URL or API.

- database-optimizer
    Expert database optimizer specializing in query optimization and performance tuning.

```

**Example Interaction:**
Simply ask for help, and Gemini will automatically activate the relevant expert skill.

```
> how can you help me to optimize my Mongodb collection?

✦ I can help you with that. I'll activate the database-optimizer skill to provide you with expert guidance on optimizing your MongoDB
  collection.
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  Activate Skill "database-optimizer": Expert database optimizer specializing in query optimization, performance tuning, and scalability… │
│                                                                                                                                            │
│ Skill **database-optimizer** activated. Resources loaded:                                                                                  │
│                                                                                                                                            │
│ ├───SKILL.md                                                                                                                               │
│ ├───assets/                                                                                                                                │
│ │   ├───optimization_context_query.json                                                                                                    │
│ │   └───progress_tracking.json                                                                                                             │
│ └───references/                                                                                                                            │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ To assist you with optimizing your MongoDB collection, I can help with query analysis, index strategy, schema design, and configuration
  tuning.

  To get started, please share some details about your situation:

   1. What is the primary issue? (e.g., slow specific queries, high CPU usage, slow writes, general sluggishness)
   2. Collection Statistics: Roughly how many documents are in the collection and what is the total data size?
   3. Query Patterns: Can you share an example of a slow query and its typical filter/sort criteria?
   4. Current Indexes: What indexes do you currently have defined on this collection?
   5. Document Structure: A brief description or JSON example of a typical document.

  Once you provide this context, I can analyze the situation and recommend specific optimizations.
```

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
git clone https://github.com/saeed-vayghan/gemini-agent-skills.git
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


## List of Agent Skills

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

### 05. Data & AI
Data engineering, ML, and AI specialists.

- [**ai-engineer**](.gemini/skills/ai-engineer/SKILL.md) - AI system design and deployment expert
- [**data-analyst**](.gemini/skills/data-analyst/SKILL.md) - Data insights and visualization specialist
- [**data-engineer**](.gemini/skills/data-engineer/SKILL.md) - Data pipeline architect
- [**data-scientist**](.gemini/skills/data-scientist/SKILL.md) - Analytics and insights expert
- [**database-optimizer**](.gemini/skills/database-optimizer/SKILL.md) - Database performance specialist
- [**llm-architect**](.gemini/skills/llm-architect/SKILL.md) - Large language model architect
- [**machine-learning-engineer**](.gemini/skills/machine-learning-engineer/SKILL.md) - Machine learning systems expert
- [**ml-engineer**](.gemini/skills/ml-engineer/SKILL.md) - Machine learning specialist
- [**mlops-engineer**](.gemini/skills/mlops-engineer/SKILL.md) - MLOps and model deployment expert
- [**nlp-engineer**](.gemini/skills/nlp-engineer/SKILL.md) - Natural language processing expert
- [**postgres-pro**](.gemini/skills/postgres-pro/SKILL.md) - PostgreSQL database expert
- [**prompt-engineer**](.gemini/skills/prompt-engineer/SKILL.md) - Prompt optimization specialist

### 06. Developer Experience
Tooling and developer productivity experts.

- [**build-engineer**](.gemini/skills/build-engineer/SKILL.md) - Build system specialist
- [**cli-developer**](.gemini/skills/cli-developer/SKILL.md) - Command-line tool creator
- [**dependency-manager**](.gemini/skills/dependency-manager/SKILL.md) - Package and dependency specialist
- [**documentation-engineer**](.gemini/skills/documentation-engineer/SKILL.md) - Technical documentation expert
- [**dx-optimizer**](.gemini/skills/dx-optimizer/SKILL.md) - Developer experience optimization specialist
- [**git-workflow-manager**](.gemini/skills/git-workflow-manager/SKILL.md) - Git workflow and branching expert
- [**legacy-modernizer**](.gemini/skills/legacy-modernizer/SKILL.md) - Legacy code modernization specialist
- [**mcp-developer**](.gemini/skills/mcp-developer/SKILL.md) - Model Context Protocol specialist
- [**powershell-ui-architect**](.gemini/skills/powershell-ui-architect/SKILL.md) - PowerShell UI/UX specialist for WinForms, WPF, Metro frameworks, and TUIs
- [**powershell-module-architect**](.gemini/skills/powershell-module-architect/SKILL.md) - PowerShell module and profile architecture specialist
- [**refactoring-specialist**](.gemini/skills/refactoring-specialist/SKILL.md) - Code refactoring expert
- [**slack-expert**](.gemini/skills/slack-expert/SKILL.md) - Slack platform and @slack/bolt specialist
- [**tooling-engineer**](.gemini/skills/tooling-engineer/SKILL.md) - Developer tooling specialist

### 07. Specialized Domains
Domain-specific technology experts.

- [**api-documenter**](.gemini/skills/api-documenter/SKILL.md) - API documentation specialist
- [**blockchain-developer**](.gemini/skills/blockchain-developer/SKILL.md) - Web3 and crypto specialist
- [**embedded-systems**](.gemini/skills/embedded-systems/SKILL.md) - Embedded and real-time systems expert
- [**fintech-engineer**](.gemini/skills/fintech-engineer/SKILL.md) - Financial technology specialist
- [**game-developer**](.gemini/skills/game-developer/SKILL.md) - Game development expert
- [**iot-engineer**](.gemini/skills/iot-engineer/SKILL.md) - IoT systems developer
- [**m365-admin**](.gemini/skills/m365-admin/SKILL.md) - Microsoft 365, Exchange Online, Teams, and SharePoint administration specialist
- [**mobile-app-developer**](.gemini/skills/mobile-app-developer/SKILL.md) - Mobile application specialist
- [**payment-integration**](.gemini/skills/payment-integration/SKILL.md) - Payment systems expert
- [**quant-analyst**](.gemini/skills/quant-analyst/SKILL.md) - Quantitative analysis specialist
- [**risk-manager**](.gemini/skills/risk-manager/SKILL.md) - Risk assessment and management expert
- [**seo-specialist**](.gemini/skills/seo-specialist/SKILL.md) - Search engine optimization expert

### 08. Business & Product
Product management and business analysis.

- [**business-analyst**](.gemini/skills/business-analyst/SKILL.md) - Requirements specialist
- [**content-marketer**](.gemini/skills/content-marketer/SKILL.md) - Content marketing specialist
- [**customer-success-manager**](.gemini/skills/customer-success-manager/SKILL.md) - Customer success expert
- [**legal-advisor**](.gemini/skills/legal-advisor/SKILL.md) - Legal and compliance specialist
- [**product-manager**](.gemini/skills/product-manager/SKILL.md) - Product strategy expert
- [**project-manager**](.gemini/skills/project-manager/SKILL.md) - Project management specialist
- [**sales-engineer**](.gemini/skills/sales-engineer/SKILL.md) - Technical sales expert
- [**scrum-master**](.gemini/skills/scrum-master/SKILL.md) - Agile methodology expert
- [**technical-writer**](.gemini/skills/technical-writer/SKILL.md) - Technical documentation specialist
- [**ux-researcher**](.gemini/skills/ux-researcher/SKILL.md) - User research expert

### 09. Meta & Orchestration
Agent coordination and meta-programming.

- [**agent-organizer**](.gemini/skills/agent-organizer/SKILL.md) - Multi-agent coordinator
- [**context-manager**](.gemini/skills/context-manager/SKILL.md) - Context optimization expert
- [**error-coordinator**](.gemini/skills/error-coordinator/SKILL.md) - Error handling and recovery specialist
- [**knowledge-synthesizer**](.gemini/skills/knowledge-synthesizer/SKILL.md) - Knowledge aggregation expert
- [**multi-agent-coordinator**](.gemini/skills/multi-agent-coordinator/SKILL.md) - Advanced multi-agent orchestration
- [**performance-monitor**](.gemini/skills/performance-monitor/SKILL.md) - Agent performance optimization
- [**pied-piper**](https://github.com/sathish316/pied-piper/) - Orchestrate Team of AI Subagents for repetitive SDLC workflows
- [**task-distributor**](.gemini/skills/task-distributor/SKILL.md) - Task allocation specialist
- [**workflow-orchestrator**](.gemini/skills/workflow-orchestrator/SKILL.md) - Complex workflow automation

### 10. Research & Analysis
Research, search, and analysis specialists.

- [**research-analyst**](.gemini/skills/research-analyst/SKILL.md) - Comprehensive research specialist
- [**search-specialist**](.gemini/skills/search-specialist/SKILL.md) - Advanced information retrieval expert
- [**trend-analyst**](.gemini/skills/trend-analyst/SKILL.md) - Emerging trends and forecasting expert
- [**competitive-analyst**](.gemini/skills/competitive-analyst/SKILL.md) - Competitive intelligence specialist
- [**market-researcher**](.gemini/skills/market-researcher/SKILL.md) - Market analysis and consumer insights
- [**data-researcher**](.gemini/skills/data-researcher/SKILL.md) - Data discovery and analysis expert
