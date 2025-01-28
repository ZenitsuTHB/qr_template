#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  // Stage all changes
  execSync('git add .', { stdio: 'inherit' });

  // Get the list of staged files
  const statusOutput = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
  const files = statusOutput.trim().split('\n').filter(file => file);

  if (files.length === 0) {
    console.log('No changes to commit.');
    process.exit(0);
  }

  // Construct commit message
  const timestamp = new Date().toLocaleString();
  const commitMessage = `Changed files: ${files.join(', ')}\nCommitted on: ${timestamp}`;

  // Commit with the constructed message
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

  console.log('Changes committed successfully.');
} catch (error) {
  console.error('An error occurred:', error.message);
  process.exit(1);
}
