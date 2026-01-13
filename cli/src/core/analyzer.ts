import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import yaml from 'js-yaml';
import { InputType, ClaudePluginManifest, ClaudeAgent, ClaudeSkill } from '../types';

export class Analyzer {
    private inputPath: string;

    constructor(inputPath: string) {
        this.inputPath = path.resolve(inputPath);
    }

    async determineType(): Promise<InputType> {
        const stats = await fs.stat(this.inputPath);

        if (stats.isFile()) {
            // Single file check - likely an agent or loose skill
            if (this.inputPath.endsWith('.json')) {
                // Could be a manifest? unlikely to pass manifest file directly, usually dir
                return 'unknown';
            }
            if (this.inputPath.endsWith('.md')) {
                const content = await fs.readFile(this.inputPath, 'utf-8');
                if (content.includes('SKILL.md')) return 'skill'; // Unlikely filename check
                return 'agent'; // Assume markdown file input is an agent
            }
        } else if (stats.isDirectory()) {
            // Check for plugin
            if (await fs.pathExists(path.join(this.inputPath, 'plugin.json')) ||
                await fs.pathExists(path.join(this.inputPath, '.claude-plugin', 'plugin.json')) ||
                await fs.pathExists(path.join(this.inputPath, 'agents')) ||
                await fs.pathExists(path.join(this.inputPath, 'skills'))) {
                return 'plugin';
            }

            // Check for skill
            if (await fs.pathExists(path.join(this.inputPath, 'SKILL.md'))) {
                return 'skill';
            }

            // For now, if we pass a directory, and it's not a plugin or skill, we can scan for agents.
            const mdFiles = await glob('*.md', { cwd: this.inputPath });
            if (mdFiles.length > 0) {
                // Perform a heuristic? 
                return 'agent'; // Maybe a collection of agents?
            }
        }

        return 'unknown';
    }

    async readPluginManifest(): Promise<ClaudePluginManifest | null> {
        let manifestPath = path.join(this.inputPath, 'plugin.json');
        if (!await fs.pathExists(manifestPath)) {
            manifestPath = path.join(this.inputPath, '.claude-plugin', 'plugin.json');
        }

        if (await fs.pathExists(manifestPath)) {
            try {
                const content = await fs.readFile(manifestPath, 'utf-8');
                return JSON.parse(content) as ClaudePluginManifest;
            } catch (e) {
                console.error("Failed to parse plugin.json", e);
                return null;
            }
        }
        return null;
    }
}

export function parseFrontmatter(content: string): { metadata: any, body: string } {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (match) {
        try {
            const metadata = yaml.load(match[1]);
            return { metadata, body: match[2] };
        } catch (e) {
            // Fallback
        }
    }
    return { metadata: {}, body: content };
}
