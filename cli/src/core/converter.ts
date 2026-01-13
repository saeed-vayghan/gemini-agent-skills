import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { Analyzer, parseFrontmatter } from './analyzer'; // Keep for utility
import { AIService } from '../services/ai';
import { GeminiSkill, ExtractedFile, AnalysisResult } from '../types';
import { Logger } from '../utils/logger';
import { DirectoryScanner } from './scanner';

export class Converter {
    private inputPath: string;
    private outputDir: string;
    private force: boolean;
    private mode: 'plugin' | 'agents';
    private analyzer: Analyzer; // Legacy utility use
    private aiService: AIService;

    constructor(inputPath: string, outputDir: string, force: boolean = false, mode: 'plugin' | 'agents' = 'plugin') {
        this.inputPath = path.resolve(inputPath);
        this.outputDir = path.resolve(outputDir);
        this.force = force;
        this.mode = mode;
        this.analyzer = new Analyzer(inputPath);
        this.aiService = new AIService();
    }

    async convert() {
        if (this.mode === 'agents') {
            await this.convertAsAgents();
        } else {
            await this.convertAsPlugin();
        }
    }

    private async convertAsPlugin() {
        Logger.header("CLAUDE TO GEMINI CONVERTER (V3)");

        // Phase 1: Analysis
        Logger.step("Phase 1: AI Directory Analysis");
        const fileTree = await DirectoryScanner.generateTree(this.inputPath);

        const analysis: AnalysisResult = await this.aiService.analyzeDirectoryTree(fileTree, this.inputPath);
        Logger.detail(`Identified ${analysis.agents.length} Agents`);
        Logger.detail(`Identified ${analysis.skills.length} Skills (Workflows)`);

        // Phase 2: Construction
        Logger.step("Phase 2: Building Single Skill");

        // Determine Name
        const manifest = await this.analyzer.readPluginManifest();
        const rawName = manifest?.name || path.basename(this.inputPath);
        const skillName = this.cleanName(rawName);

        // Init Master Skill
        const masterSkill: GeminiSkill = {
            metadata: {
                name: skillName,
                description: manifest?.description || `Converted capability bundle for ${skillName}`,
                'allowed-tools': "" // Accumulated later
            },
            instructions: "",
            scripts: {},
            references: {},
            assets: {}
        };

        // Registries
        const personaRegistry: { name: string, desc: string }[] = [];
        const workflowRegistry: { name: string, desc: string, path: string }[] = [];
        let personaContent = "";

        // Merge Agents
        for (const agentPath of analysis.agents) {
            Logger.info(`Processing Agent: ${path.basename(agentPath)}`);
            try {
                if (!await fs.pathExists(agentPath)) continue;
                const content = await fs.readFile(agentPath, 'utf-8');
                const { metadata, body } = parseFrontmatter(content);
                const name = metadata.name || path.basename(agentPath, '.md');

                // Refine
                const prompt = `Convert this Claude Agent to a Gemini Persona section. Name: ${name}
                
                IMPORTANT: Output ONLY the body content. Do NOT include a top-level header with the agent name. Start directly with the context or role description.`;
                const aiResult = await this.aiService.refineContentWithExtraction(prompt, body);

                // Post-process: Strip leading headers if specific name or "Persona" is present to avoid duplication
                let refinedContent = aiResult.content.trim();
                const headerRegex = new RegExp(`^#+\\s*(${name}|Persona)`, 'i');
                refinedContent = refinedContent.replace(headerRegex, '').trim();

                // Add to Registry & Content
                personaRegistry.push({ name, desc: metadata.description || "Agent Persona" });
                personaContent += `\n# Persona: ${name}\n${refinedContent}\n---\n`;

                // Collect Extracted Code
                this.collectExtractedFiles(aiResult.extractedFiles || [], masterSkill);

            } catch (e: any) {
                Logger.error(`Failed to merge agent ${path.basename(agentPath)}: ${e.message}`);
            }
        }
        // Process Workflows (Skills)
        for (const skill of analysis.skills) {
            Logger.info(`Processing Workflow: ${path.basename(skill.path)}`);
            try {
                if (!await fs.pathExists(skill.path)) continue;
                const content = await fs.readFile(skill.path, 'utf-8');
                const { metadata, body } = parseFrontmatter(content);
                let nameStr = metadata.name || path.basename(skill.path, '.md');
                if (nameStr.toUpperCase() === 'SKILL') {
                    nameStr = path.basename(path.dirname(skill.path));
                }
                const name = this.cleanName(nameStr);

                // Unified logic: All workflows go to references/workflows/{name}.md
                const refPath = `workflows/${name}.md`;
                masterSkill.references[refPath] = body;

                // Absolute path for registry
                const absPath = path.join(this.outputDir, skillName, 'references', 'workflows', `${name}.md`);
                workflowRegistry.push({
                    name,
                    desc: metadata.description || "Workflow Capability",
                    path: absPath
                });

                if (skill.nested) {
                    // Scenario 2: Nested
                    // Programmatically find all assets to ensure nothing is missed by AI
                    const skillDir = path.dirname(skill.path);
                    const allFiles = await this.getRecursiveFiles(skillDir);
                    // Filter out the main skill file and hidden files
                    skill.assets = allFiles.filter(f => f !== skill.path && !path.basename(f).startsWith('.'));

                    Logger.detail(`Programmatically found ${skill.assets.length} assets for ${name}`);

                    // Move Assets -> assets/{name}/
                    if (skill.assets) {
                        for (const assetPath of skill.assets) {
                            if (await fs.pathExists(assetPath)) {
                                const assetName = path.basename(assetPath);
                                const assetContent = await fs.readFile(assetPath);
                            }
                        }
                    }
                } else {
                    // Scenario 1: Flat - Logic merged above
                }

            } catch (e: any) {
                Logger.error(`Failed to process workflow ${path.basename(skill.path)}: ${e.message}`);
            }
        }

        // Generate Final SKILL.md Content
        masterSkill.instructions = this.generateSkillMd(masterSkill.metadata, personaRegistry, workflowRegistry, personaContent);

        // Phase 3: Output
        Logger.step("Phase 3: Writing Output");
        await this.writeGeminiSkill(masterSkill, analysis);

        // Phase 4: Post-Processing - Fix Internal Links
        Logger.step("Phase 4: Fixing Internal Links");
        const skillDir = path.join(this.outputDir, masterSkill.metadata.name);
        await this.processInternalLinks(skillDir);

        Logger.success("Conversion Complete!");
    }

    private async processInternalLinks(skillDir: string) {
        const mdFiles = (await this.getRecursiveFiles(skillDir)).filter(f => f.endsWith('.md'));

        for (const file of mdFiles) {
            let content = await fs.readFile(file, 'utf-8');
            let changed = false;

            // Regex for Markdown links: [label](path)
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

            // We need to use recursion or a replacement loop that handles async
            // Since replace doesn't support async, we find all matches first
            const matches = [...content.matchAll(linkRegex)];

            for (const match of matches) {
                const fullMatch = match[0];
                const label = match[1];
                const linkPath = match[2];

                // Skip external links, anchors, or absolute paths (unless we want to handle absolute?)
                if (linkPath.startsWith('http') || linkPath.startsWith('mailto:') || linkPath.startsWith('#')) {
                    continue;
                }

                // Resolve path relative to current file
                const currentDir = path.dirname(file);
                const absoluteTarget = path.resolve(currentDir, linkPath);

                if (!await fs.pathExists(absoluteTarget)) {
                    // BROKEN LINK FOUND
                    Logger.warn(`Broken link in ${path.basename(file)}: ${linkPath}`);

                    // Strategy: Search for filename in skillDir
                    const targetName = path.basename(linkPath);
                    const allFiles = await this.getRecursiveFiles(skillDir);
                    const foundPath = allFiles.find(f => path.basename(f) === targetName);

                    if (foundPath) {
                        const newRelativePath = path.relative(currentDir, foundPath);
                        Logger.success(`  -> Fixed: Pointing to ${newRelativePath}`);
                        content = content.replace(fullMatch, `[${label}](${newRelativePath})`);
                        changed = true;
                    } else {
                        // Not found - Remove link, keep text
                        Logger.warn(`  -> Removed: Target ${targetName} not found in skill.`);
                        content = content.replace(fullMatch, `${label} (link removed)`);
                        changed = true;
                    }
                }
            }

            if (changed) {
                await fs.writeFile(file, content);
            }
        }
    }

    private cleanName(name: string): string {
        return name.replace(/[-_](command|skill|agent|plugin)$/i, '');
    }

    private collectExtractedFiles(files: ExtractedFile[], skill: GeminiSkill) {
        if (!files || !Array.isArray(files)) return;
        for (const file of files) {
            if (file.type === 'reference') {
                skill.references[file.name] = file.content;
            } else {
                skill.assets[file.name] = file.content;
            }
        }
    }

    private generateSkillMd(metadata: any, personas: any[], workflows: any[], personaContent: string): string {
        return `
${metadata.description}

## Persona Registry
| Persona | Description |
| :--- | :--- |
${personas.map(p => `| **${p.name}** | ${p.desc} |`).join('\n')}

## Workflows Registry
| Workflow | Description | Path |
| :--- | :--- | :--- |
${workflows.map(w => `| **${w.name}** | ${w.desc} | ${w.path} |`).join('\n')}

> *Note: All workflows are available in the \`references/\` directory.*

---

${personaContent}
`;
    }

    private async writeGeminiSkill(skill: GeminiSkill, analysis: AnalysisResult) {
        const skillDir = path.join(this.outputDir, skill.metadata.name);

        if (await fs.pathExists(skillDir) && !this.force) {
            Logger.warn(`Directory ${skill.metadata.name} exists. Use --force.`);
            return;
        }

        await fs.ensureDir(skillDir);
        await fs.ensureDir(path.join(skillDir, 'assets'));
        await fs.ensureDir(path.join(skillDir, 'references'));
        await fs.ensureDir(path.join(skillDir, 'references', 'workflows'));
        await fs.ensureDir(path.join(skillDir, 'scripts'));

        // Write SKILL.md
        // We manually constructed the body in `skill.instructions`, so we just need frontmatter + body
        const frontmatter = yaml.dump(skill.metadata);
        const fileContent = `---\n${frontmatter}---\n${skill.instructions}`;
        await fs.writeFile(path.join(skillDir, 'SKILL.md'), fileContent);

        // Write Extracted/Merged References
        for (const [name, content] of Object.entries(skill.references)) {
            await fs.outputFile(path.join(skillDir, 'references', name), content);
        }
        for (const [name, content] of Object.entries(skill.assets)) {
            await fs.outputFile(path.join(skillDir, 'assets', name), content);
        }

        // Handle Nested Assets (Direct Copy)
        for (const workflow of analysis.skills) {
            if (workflow.nested && workflow.assets) {
                let workflowNameRaw = path.basename(workflow.path, '.md');
                if (workflowNameRaw.toUpperCase() === 'SKILL') {
                    workflowNameRaw = path.basename(path.dirname(workflow.path));
                }
                const workflowName = this.cleanName(workflowNameRaw);
                const targetAssetDir = path.join(skillDir, 'assets', workflowName);
                await fs.ensureDir(targetAssetDir);

                for (const assetPath of workflow.assets) {
                    if (await fs.pathExists(assetPath)) {
                        const filename = path.basename(assetPath);
                        await fs.copy(assetPath, path.join(targetAssetDir, filename));
                    }
                }
            }
        }
    }

    private async getRecursiveFiles(dir: string): Promise<string[]> {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? this.getRecursiveFiles(res) : res;
        }));
        // Flux: TS issues with Array.prototype.concat spread
        // Manual flatten
        const result: string[] = [];
        for (const f of files) {
            if (Array.isArray(f)) {
                result.push(...f);
            } else {
                result.push(f as string);
            }
        }
        return result;
    }

    private async convertAsAgents() {
        Logger.header("CLAUDE TO GEMINI CONVERTER (AGENTS MODE)");
        Logger.step("Phase 1: Scanning for Agents");

        const glob = require('fast-glob');
        const agentFiles = await glob('**/*.md', {
            cwd: this.inputPath,
            absolute: true,
            ignore: ['**/node_modules/**', '**/assets/**', '**/references/**']
        });

        Logger.detail(`Found ${agentFiles.length} potential agents.`);

        for (const agentPath of agentFiles) {
            const rawName = path.basename(agentPath, '.md');
            if (rawName.toLowerCase() === 'readme' || rawName.toLowerCase() === 'skill') continue;

            Logger.info(`Processing Independent Agent: ${path.basename(agentPath)}`);

            try {
                // 1. Parse content
                const content = await fs.readFile(agentPath, 'utf-8');
                const { metadata, body } = parseFrontmatter(content);
                const skillName = this.cleanName(metadata.name || rawName);

                // 2. Init Skill Object
                const skill: GeminiSkill = {
                    metadata: {
                        name: skillName,
                        description: metadata.description || `Converted agent ${skillName}`,
                        'allowed-tools': ""
                    },
                    instructions: "", // Filled later
                    scripts: {},
                    references: {},
                    assets: {}
                };

                // 3. AI Refinement (Single Agent context)
                const prompt = `Convert this Claude Agent to a Gemini Skill Instructions. Name: ${skillName}
                
                IMPORTANT: Output the full system instructions for this agent. 
                Do not wrap in "Personas" sections, just give the direct instructions.
                Extract any code blocks into separate files if they are reusable templates or scripts.`;

                const aiResult = await this.aiService.refineContentWithExtraction(prompt, body);

                // 4. Set Content
                skill.instructions = aiResult.content;
                this.collectExtractedFiles(aiResult.extractedFiles || [], skill);

                // 5. Write Output (Isolated Folder)
                const dummyAnalysis: AnalysisResult = { agents: [], skills: [] };
                await this.writeGeminiSkill(skill, dummyAnalysis);

                // 6. Fix Links (Locally)
                const skillDir = path.join(this.outputDir, skillName);
                await this.processInternalLinks(skillDir);

            } catch (e: any) {
                Logger.error(`Failed to convert agent ${rawName}: ${e.message}`);
            }
        }

        Logger.success("Agents Mode Conversion Complete!");
    }
}
