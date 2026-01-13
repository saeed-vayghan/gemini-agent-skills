import { z } from 'zod';
import yaml from 'js-yaml';
import { GeminiSkill } from '../types';

// Zod Schema for Gemini Skill Validation
export const GeminiSkillMetadataSchema = z.object({
    name: z.string().min(1, { message: "Skill name is required" }),
    description: z.string().min(1, { message: "Skill description is required" }),
    'allowed-tools': z.union([z.string(), z.array(z.string())]).optional(),
}).passthrough(); // Allow other fields

export const GeminiSkillSchema = z.object({
    metadata: GeminiSkillMetadataSchema,
    instructions: z.string().min(1, { message: "Skill instructions are required" }),
    scripts: z.record(z.string(), z.string()).optional(),
    references: z.record(z.string(), z.string()).optional(),
    assets: z.record(z.string(), z.string()).optional(),
});

export function renderSkillTemplate(skill: GeminiSkill): string {
    // Validate input
    const validatedSkill = GeminiSkillSchema.parse(skill);

    // Dump frontmatter
    const frontmatter = yaml.dump(validatedSkill.metadata, {
        lineWidth: 80,
        noRefs: true,
    });

    // Construct Markdown
    return `---\n${frontmatter}---\n\n${validatedSkill.instructions.trim()}\n`;
}
