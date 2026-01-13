#!/usr/bin/env node

import { Command } from 'commander';
import { Converter } from './core/converter';
import { Logger } from './utils/logger';

const program = new Command();

program
    .name('claude-to-gemini')
    .description('Convert Claude Code configurations to Gemini Agent Skills')
    .version('1.0.1');

program
    .command('convert')
    .description('Convert Claude Code configurations to Gemini Agent Skills')
    .option('-i, --input <path>', 'Input directory (Claude Plugin, Agent, or Skill)')
    .option('-o, --output <path>', 'Output directory for Gemini Skills', '../.gemini/skills')
    .option('-f, --force', 'Force overwrite existing skills', false)
    .option('-p, --plugin', 'Convert as a full Claude Plugin bundle (default)', true)
    .option('-a, --agents', 'Convert each file as a standalone Agent Skill', false)
    .action(async (options) => {
        try {
            if (!options.input) {
                Logger.error("Arguments missing: --input is required.");
                process.exit(1);
            }

            // Determine Mode
            const mode = options.agents ? 'agents' : 'plugin';
            if (options.agents && options.plugin && process.argv.includes('--plugin')) {
                // If both explicit, prefer agents? Or Error? 
                // Commander sets defaults, so if user types --agents, plugin is still true by default?
                // Wait, .option(..., default) sets the value.
                // Let's resolve simple priority: --agents wins if present.
            }

            const converter = new Converter(options.input, options.output, options.force, mode);
            await converter.convert();

        } catch (error: any) {
            Logger.error(`Fatal Error: ${error.message}`);
            process.exit(1);
        }
    });

program.parse();
