import fs from 'fs-extra';
import path from 'path';

export class DirectoryScanner {
    /**
     * Generates a recursive tree structure string of the directory.
     */
    static async generateTree(dirPath: string, indent: string = ''): Promise<string> {
        let tree = '';
        const files = await fs.readdir(dirPath);

        // Sort files to have consistent output (directories first, then files)
        const sortedFiles = files.sort((a, b) => {
            return a.localeCompare(b);
        });

        for (let i = 0; i < sortedFiles.length; i++) {
            const file = sortedFiles[i];
            const fullPath = path.join(dirPath, file);
            const stats = await fs.stat(fullPath);
            const isLast = i === sortedFiles.length - 1;

            // Skip hidden files/dirs (.git, .env, etc.)
            if (file.startsWith('.')) continue;

            const marker = isLast ? '└── ' : '├── ';
            tree += `${indent}${marker}${file}\n`;

            if (stats.isDirectory()) {
                const childIndent = indent + (isLast ? '    ' : '│   ');
                tree += await this.generateTree(fullPath, childIndent);
            }
        }
        return tree;
    }
}
