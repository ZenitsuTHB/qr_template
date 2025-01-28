// checkBaseDomain.js

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Path to App.js
const appJsPath = path.join(__dirname, 'src', 'App.js');

function runBaseDomainCheck() {
  try {
    const appJsContent = fs.readFileSync(appJsPath, 'utf-8');
    const lines = appJsContent.split('\n');

    let localhostLineFound = false;
    let localhostLineCommented = false;
    let productionLineFound = false;
    let productionLineNotCommented = false;

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Check for localhost baseDomain
      if (trimmedLine.includes('window.baseDomain = "http://localhost:5000/";')) {
        localhostLineFound = true;
        if (trimmedLine.startsWith('//')) {
          localhostLineCommented = true;
        }
      }

      // Check for production baseDomain
      if (trimmedLine.includes('window.baseDomain = "https://squid-app-aychi.ondigitalocean.app/";')) {
        productionLineFound = true;
        if (!trimmedLine.startsWith('//')) {
          productionLineNotCommented = true;
        }
      }
    });

    // Verify that the localhost baseDomain is commented out or deleted
    if (localhostLineFound && !localhostLineCommented) {
      console.error(
        chalk.red.bold(
          'Error: The line "window.baseDomain = "http://localhost:5000/";" must be commented out or removed in App.js.'
        )
      );
      process.exit(1);
    }

    // Verify that the production baseDomain is present and not commented
    if (!productionLineFound || !productionLineNotCommented) {
      console.error(
        chalk.red.bold(
          'Error: The line "window.baseDomain = "https://squid-app-aychi.ondigitalocean.app/";" must be present and not commented out in App.js.'
        )
      );
      process.exit(1);
    }

    // If all checks pass
    console.log(chalk.green.bold('Base domain checks passed successfully.'));
  } catch (err) {
    console.error(chalk.red.bold(`Error during base domain checks: ${err.message}`));
    process.exit(1);
  }
}

runBaseDomainCheck();
