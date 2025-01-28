import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configFilePath = path.join(__dirname, 'prompts', 'lastFolder.json');
const resultFilePath = path.join(__dirname, 'result.txt');

function getLastFolder() {
    if (fs.existsSync(configFilePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
            return data.lastFolder || null;
        } catch (error) {
            console.error('Error: lastFolder.json is malformed.');
            process.exit(1);
        }
    }
    console.error('Error: lastFolder.json does not exist.');
    process.exit(1);
}

function parseResult(content) {
    const regex = /START-FILE-\(path:(.*?)\)([\s\S]*?)END-FILE/g;
    const changedFiles = [];
    const unchangedFiles = [];

    let match;
    while ((match = regex.exec(content)) !== null) {
        const relativePath = match[1].trim();
        const code = match[2].trim();
        changedFiles.push({ relativePath, code });
    }

    return { changedFiles, unchangedFiles };
}

function extractFileData(section) {
    const filePathMatch = section.match(/^---\s+(.+?)\s+---/m);
    if (!filePathMatch) {
        console.warn('Warning: Could not find file path in section:', section);
        return null;
    }
    const relativeFilePath = filePathMatch[1].trim();

    const codeBlockMatch = section.match(/```(\w+)?\n([\s\S]*?)```/m);
    if (!codeBlockMatch) {
        console.warn(`Warning: Code block not found for file ${relativeFilePath}. Skipping.`);
        return null;
    }
    const language = codeBlockMatch[1] || '';
    const code = codeBlockMatch[2].trim();

    return {
        relativePath: relativeFilePath,
        language: language.toLowerCase(),
        code: code,
    };
}

function writeFile(baseDir, relativePath, content) {
    const fullPath = path.join(baseDir, relativePath);
    const dirName = path.dirname(fullPath);
    fs.mkdirSync(dirName, { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${fullPath}`);
}

function logUnchangedFiles(baseDir, unchangedFiles) {
    unchangedFiles.forEach(file => {
        const fullPath = path.join(baseDir, file.relativePath);
        console.log(`--unchanged: ${fullPath}`);
    });
}

function processResult() {
    const lastFolder = getLastFolder();
    if (!lastFolder || !fs.existsSync(lastFolder)) {
        console.error('Error: The last selected folder does not exist.');
        process.exit(1);
    }

    if (!fs.existsSync(resultFilePath)) {
        console.error(`Error: ${resultFilePath} does not exist.`);
        process.exit(1);
    }

    const resultContent = fs.readFileSync(resultFilePath, 'utf8');
    const { changedFiles, unchangedFiles } = parseResult(resultContent);

    if (changedFiles.length === 0 && unchangedFiles.length === 0) {
        console.log('No files found in result.txt.');
        return;
    }

    changedFiles.forEach(file => {
        writeFile(lastFolder, file.relativePath, file.code);
    });

    if (unchangedFiles.length > 0) {
        logUnchangedFiles(lastFolder, unchangedFiles);
    }

    console.log('\nAll changed files have been processed successfully.');
}

processResult();
