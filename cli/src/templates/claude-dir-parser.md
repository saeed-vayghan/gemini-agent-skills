**Situation**

You are working with a directory structure that contains various files and folders related to AI agents and skills. This structure needs to be analyzed and categorized according to specific rules to extract agent files and skill files with their associated assets. The categorization must distinguish between nested and non-nested skill structures while excluding certain command-related files and folders.

**Task**

The assistant should perform two sequential operations:

1. Generate a complete recursive tree structure of the input directory showing all folders and files
2. Analyze this tree structure to categorize files according to the rules below and return a JSON object with two main arrays: one for agents and one for skills

**Objective**

Create an automated categorization system that processes directory structures to identify and organize agent files and skill files with their metadata, enabling efficient navigation and understanding of the codebase structure.

**Knowledge**

The categorization must follow these specific rules:

Rule 1 - Exclusions:
- Skip any file named "command" or "commands" (case-insensitive)
- Skip any folder named "commands" (case-insensitive) and all files within it

Rule 2 - Agent Categorization:
- When a folder is named "agent" or "agents" (case-insensitive), categorize all files within as agent files
- When a file name suggests it is an agent file (contains "agent" in the filename), categorize it as an agent file
- Create a JSON array with absolute file paths for all identified agent files

Rule 3 - Skill Categorization:
- When a folder is named "skills" (case-insensitive), apply the following scenarios:

Scenario 1 (Non-nested skills):
- If the skills folder contains one or more files named "skill.md" (case-insensitive) directly inside it without subdirectories
- Structure each as: `{ type: 'skill', nested: false, path: 'absolute/path/to/skill.md' }`

Scenario 2 (Nested skills):
- If a subfolder inside "skills" contains a `SKILL.md` (or similar) file:
  1. That `SKILL.md` is the `path`.
  2. **ALL OTHER FILES** in that folder and ANY of its subfolders (recursively) are `assets`.
  3. This includes contents of `assets/`, `references/`, `scripts/`, `docs/`, etc.
  4. **EXAMPLE**: If `skills/myskill/references/ref.md` exists, it MUST be in the `assets` list.
- Structure: `{ type: 'skill', nested: true, path: 'absolute/path/to/skill.md', assets: ['path/to/assets/file.md', 'path/to/references/ref.md'] }`

**Output Format**

The assistant should return a JSON object with the following structure:

```json
{
  "agents": [
    "absolute/path/to/agent-1.md",
    "absolute/path/to/agent-2.md"
  ],
  "skills": [
    {
      "type": "skill",
      "nested": false,
      "path": "absolute/path/to/skill.md"
    },
    {
      "type": "skill",
      "nested": true,
      "path": "absolute/path/to/skill.md",
      "assets": [
        "absolute/path/to/example.md",
        "absolute/path/to/reference.txt",
        "absolute/path/to/script.sh",
        "etc",
      ]
    }
  ]
}
```

The assistant should first display the complete directory tree structure, then provide the categorized JSON object following all rules precisely.