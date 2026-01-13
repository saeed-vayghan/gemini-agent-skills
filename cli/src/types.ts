export interface ClaudeSkillMetadata {
    name: string;
    description: string;
    'allowed-tools'?: string | string[];
    [key: string]: any;
}

export interface ClaudeSkill {
    metadata: ClaudeSkillMetadata;
    instructions: string;
    path: string;
}

export interface ClaudeAgentMetadata {
    name: string;
    description: string;
    tools?: string | string[];
    model?: string;
    [key: string]: any;
}

export interface ClaudeAgent {
    metadata: ClaudeAgentMetadata;
    prompts: string; // The markdown body
    path: string;
}

export interface ClaudePluginManifest {
    name: string;
    version?: string;
    description?: string;
    agents?: string | string[];
    skills?: string | string[];
    [key: string]: any;
}

export interface GeminiSkillMetadata {
    name: string;
    description: string;
    'allowed-tools'?: string; // Space-delimited list
    [key: string]: any;
}

export interface GeminiSkill {
    metadata: GeminiSkillMetadata;
    instructions: string;
    scripts: Record<string, string>; // filename -> content
    references: Record<string, string>; // filename -> content
    assets: Record<string, string>; // filename -> content
}

export interface ExtractedFile {
    name: string;
    type: 'asset' | 'reference';
    content: string;
    originalContent?: string;
}

export interface AIRefineResult {
    content: string; // The refined markdown
    extractedFiles: ExtractedFile[];
}

export type InputType = 'plugin' | 'agent' | 'skill' | 'unknown';

export interface AnalysisResult {
    agents: string[]; // Absolute paths
    skills: {
        type: 'skill';
        nested: boolean;
        path: string; // Absolute path to skill.md
        assets?: string[]; // Absolute paths
    }[];
}

export interface ConverterContext {
    inputType: InputType;
    inputPath: string;
    outputDir: string;
}
