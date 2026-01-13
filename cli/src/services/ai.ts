import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIRefineResult, AnalysisResult } from '../types';
import { Logger } from '../utils/logger';

export class AIService {
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            const genAI = new GoogleGenerativeAI(apiKey);
            this.model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash-exp",
                generationConfig: {
                    responseMimeType: "application/json"
                }
            });
        } else {
            Logger.warn("GEMINI_API_KEY not found. AI features will be disabled.");
        }
    }

    async refineContentWithExtraction(prompt: string, contextString: string): Promise<AIRefineResult> {
        if (!this.model) {
            Logger.warn("AI Service skipped (No API Key)");
            return { content: contextString, extractedFiles: [] };
        }

        try {
            const fullPrompt = `${prompt}
            Context:
            ${contextString}

            OUTPUT FORMAT (JSON):
            {
                "content": "The refined markdown content...",
                "extractedFiles": [
                    {
                        "name": "filename.ext",
                        "type": "asset" | "reference",
                        "content": "file content..."
                    }
                ]
            }
            
            EXTRATION RULES:
            1. If you find any code block longer than 5 lines, extract it.
            2. If you find a data template (JSON/YAML), extract it.
            3. Replace the extracted code in "content" with a markdown link to "references/filename.ext" or "assets/filename.ext".
            4. "type": use "asset" for templates/data, "reference" for code examples.
            5. "name": choose a descriptive filename.
            `;

            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            const cleanedText = text.replace(/^```json\n/, '').replace(/^```\n?$/, '').trim();

            return JSON.parse(cleanedText) as AIRefineResult;
        } catch (error) {
            Logger.error(`AI Refinement Error: ${error}`);
            // Fallback: return original content without files
            return { content: contextString, extractedFiles: [] };
        }
    }

    async analyzeDirectoryTree(tree: string, rootPath: string): Promise<AnalysisResult> {
        if (!this.model) {
            throw new Error("AI Service not initialized (missing API key?)");
        }

        try {
            const systemPrompt = `
You are an expert file system analyzer.
Your task is to analyze a file tree and categorize files into 'agents' and 'skills' based on specific rules.
Ignore 'commands' folders.

RULES:
1. Agents: Files in 'agents/' folders or with 'agent' in name.
2. Skills: Folders named 'skills'.
   - Non-nested: Direct 'skill.md'.
   - Nested: Subdirectory with 'skill.md' + assets.

OUTPUT JSON FORMAT:
{
  "agents": ["absolute/path/to/agent.md"],
  "skills": [
    { "type": "skill", "nested": false, "path": "path/to/skill.md" },
    { "type": "skill", "nested": true, "path": "path/to/skill.md", "assets": ["path/to/asset"] }
  ]
}

IMPORTANT: The file tree provided is relative. You must prepend the ROOT PATH "${rootPath}" to all output paths to make them absolute.
`;

            const fullPrompt = `${systemPrompt}\n\nROOT PATH: ${rootPath}\n\nFILE TREE:\n${tree}`;

            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            const cleanedText = text.replace(/^```json\n/, '').replace(/^```\n?$/, '').trim();
            return JSON.parse(cleanedText) as AnalysisResult;

        } catch (error) {
            Logger.error(`AI Analysis Error: ${error}`);
            throw error;
        }
    }
}
