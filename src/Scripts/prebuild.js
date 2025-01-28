const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
require('./checkBaseDomain.js');

// Directory to check
const srcDirectory = path.join(__dirname, 'src');
// Maximum allowed lines per file
const MAX_LINES = 500;

/**
 * Recursively retrieves all files in the given directory.
 * @param {string} dir - The directory path.
 * @param {Array} arrayOfFiles - Accumulator for file paths.
 * @returns {Array} - List of file paths.
 */
function getAllFiles(dir, arrayOfFiles) {
  const files = fs.readdirSync(dir);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

/**
 * Checks if a file should be skipped based on its extension.
 * @param {string} filePath - The path to the file.
 * @returns {boolean} - True if the file should be skipped, else false.
 */
function shouldSkipFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.webp' || ext === '.jpg';
}

/**
 * Parses import statements from JavaScript code.
 * @param {string} content - The JavaScript file content.
 * @returns {Set} - A set of unique imported modules.
 */
function parseImports(content) {
  const importRegex = /import\s+(?:[^'"]*\s+from\s+)?['"]([^'"]+)['"]/g;
  const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const imports = new Set();
  let match;

  // Match static imports
  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  // Match dynamic imports
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  // Match require statements
  while ((match = requireRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  return imports;
}

/**
 * Calculates the average number given total and count.
 * @param {number} total - The total sum.
 * @param {number} count - The number of items.
 * @returns {number} - The average value.
 */
function calculateAverage(total, count) {
  if (count === 0) return 0;
  return (total / count).toFixed(2);
}

/**
 * Runs the pre-build checks, including line count validations and average calculations.
 */
function runPrebuildChecks() {
  try {
    const allFiles = getAllFiles(srcDirectory);
    const oversizedFiles = [];

    // Initialize counters for averages
    let totalLinesAll = 0;
    let countAll = 0;

    let totalLinesJS = 0;
    let countJS = 0;

    let totalLinesIndexJS = 0;
    let countIndexJS = 0;

    // Coupling metrics
    let totalCoupling = 0;
    let couplingCounts = []; // For calculating average
    let componentCount = 0;

    // Dependency graph: file => set of imported files (fan-out)
    const dependencyGraph = new Map();
    // Reverse dependency graph: file => set of files that import this file (fan-in)
    const reverseDependencyGraph = new Map();

    allFiles.forEach((file) => {
      const ext = path.extname(file).toLowerCase();

      // Only consider .js and .css files for averages
      if (ext === '.js' || ext === '.css') {
        const content = fs.readFileSync(file, 'utf-8');
        const lineCount = content.split('\n').length;

        // Update overall counters
        totalLinesAll += lineCount;
        countAll += 1;

        // If it's a .js file, update JS counters
        if (ext === '.js') {
          totalLinesJS += lineCount;
          countJS += 1;

          // Initialize dependency graph entry
          const relativeFilePath = path.relative(srcDirectory, file);
          dependencyGraph.set(relativeFilePath, new Set());

          // Parse imports and update dependency graph
          if (!shouldSkipFile(file)) {
            const imports = parseImports(content);
            const importsRelativePaths = new Set();

            imports.forEach((importPath) => {
              if (importPath.startsWith('.')) {
                const importedFilePath = path.normalize(
                  path.join(path.dirname(relativeFilePath), importPath)
                );

                // Resolve index.js paths
                let fullImportedPath = path.join(srcDirectory, importedFilePath);
                if (!fs.existsSync(fullImportedPath) && fs.existsSync(fullImportedPath + '.js')) {
                  fullImportedPath += '.js';
                } else if (
                  fs.existsSync(fullImportedPath) &&
                  fs.statSync(fullImportedPath).isDirectory()
                ) {
                  fullImportedPath = path.join(fullImportedPath, 'index.js');
                } else if (!fs.existsSync(fullImportedPath)) {
                  return;
                } else {
                  fullImportedPath += '.js';
                }

                const relativeImportedPath = path.relative(srcDirectory, fullImportedPath);
                importsRelativePaths.add(relativeImportedPath);

                if (!reverseDependencyGraph.has(relativeImportedPath)) {
                  reverseDependencyGraph.set(relativeImportedPath, new Set());
                }
                reverseDependencyGraph.get(relativeImportedPath).add(relativeFilePath);
              } else {
                importsRelativePaths.add(importPath);
              }
            });

            const coupling = importsRelativePaths.size;
            totalCoupling += coupling;
            couplingCounts.push({ file: relativeFilePath, coupling });
            componentCount += 1;

            dependencyGraph.set(relativeFilePath, importsRelativePaths);
          }

          if (path.basename(file).toLowerCase() === 'index.js') {
            totalLinesIndexJS += lineCount;
            countIndexJS += 1;
          }
        }

        if (!shouldSkipFile(file) && lineCount > MAX_LINES) {
          const relativePath = path.relative(__dirname, file);
          oversizedFiles.push(relativePath);
        }
      }
    });

    const fanMetrics = {};
    let totalFanInIndexJS = 0;
    let totalFanOutIndexJS = 0;
    let countIndexComponents = 0;

    const indexCoupling = [];

    dependencyGraph.forEach((imports, file) => {
      const fanOut = imports.size;
      const fanIn = reverseDependencyGraph.has(file) ? reverseDependencyGraph.get(file).size : 0;

      fanMetrics[file] = { fanIn, fanOut };

      if (path.basename(file).toLowerCase() === 'index.js') {
        const totalCoupling = fanIn + fanOut;

        totalFanInIndexJS += fanIn;
        totalFanOutIndexJS += fanOut;
        countIndexComponents += 1;

        indexCoupling.push({ file, coupling: totalCoupling, fanIn, fanOut });
      }
    });

    indexCoupling.sort((a, b) => b.coupling - a.coupling);
    const mostCoupledIndexJSFiles = indexCoupling.slice(0, 3);

    const averageAll = calculateAverage(totalLinesAll, countAll);
    const averageJS = calculateAverage(totalLinesJS, countJS);
    const averageIndexJS = calculateAverage(totalLinesIndexJS, countIndexJS);
    const averageCoupling = calculateAverage(totalCoupling, componentCount);
    const averageFanInIndexJS = calculateAverage(totalFanInIndexJS, countIndexComponents);
    const averageFanOutIndexJS = calculateAverage(totalFanOutIndexJS, countIndexComponents);

    console.log(chalk.blue.bold('\n===== Code Metrics Report ====='));
    console.log(
      `Average number of lines in .js and .css files: ${chalk.yellow(averageAll)}`
    );
    console.log(`Average number of lines in .js files: ${chalk.yellow(averageJS)}`);
    console.log(
      `Average number of lines in index.js files: ${chalk.yellow(averageIndexJS)}`
    );
    console.log(
      `Average number of couplings per component: ${chalk.yellow(averageCoupling)}`
    );
    console.log(
      `Average fan-in for index.js files: ${chalk.yellow(averageFanInIndexJS)}`
    );
    console.log(
      `Average fan-out for index.js files: ${chalk.yellow(averageFanOutIndexJS)}`
    );

    console.log(chalk.green.bold('\nTop 3 Most Coupled index.js Files:'));
    mostCoupledIndexJSFiles.forEach(({ file, coupling, fanIn, fanOut }, index) => {
      console.log(
        `${index + 1}. ${chalk.red.bold(file)} - Total Coupling: ${chalk.red.bold(coupling)} (fan-in: ${fanIn}, fan-out: ${fanOut})`
      );
      console.log(`   Full path: ${chalk.blue(path.join(srcDirectory, file))}`);
    });

    console.log(chalk.blue.bold('================================\n'));

    if (oversizedFiles.length > 0) {
      console.error(
        chalk.red.bold(
          `Build halted: The following file(s) exceed ${MAX_LINES} lines:\n` +
            oversizedFiles.map((f) => `- ${f}`).join('\n')
        )
      );
      process.exit(1);
    } else {
      console.log(
        chalk.green.bold(
          `Pre-build check passed: All .js and .css files in '${path.relative(
            __dirname,
            srcDirectory
          )}' have ${MAX_LINES} lines or fewer.`
        )
      );
    }
  } catch (err) {
    console.error(chalk.red.bold(`Error during pre-build checks: ${err.message}`));
    process.exit(1);
  }
}

runPrebuildChecks();
