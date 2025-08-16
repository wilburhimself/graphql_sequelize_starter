#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');
const fs = require('fs');
const { green, cyan, red } = require('kleur/colors');
const prompts = require('prompts');
const degit = require('degit');

async function main() {
  try {
    const response = await prompts([
      {
        type: 'text',
        name: 'projectName',
        message: 'Project name',
        initial: 'my-graphql-api',
      },
      {
        type: 'text',
        name: 'template',
        message: 'Template repo (owner/name or full URL)',
        initial: 'wilburhimself/graphql_api_starter',
      },
    ]);

    const { projectName, template } = response;
    if (!projectName) {
      console.log(red('Aborted: project name is required.'));
      process.exit(1);
    }

    const targetDir = path.resolve(process.cwd(), projectName);
    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
      console.log(red(`Target directory '${projectName}' is not empty.`));
      process.exit(1);
    }

    const emitter = degit(template, { cache: false, force: true, verbose: true });
    console.log(cyan(`Cloning template from ${template} ...`));
    await emitter.clone(projectName);

    // Update package.json name
    const pkgPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.name = projectName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    console.log(green('Project created!'));
    console.log('\nNext steps:');
    console.log(`  cd ${projectName}`);
    console.log('  npm install');
    console.log('  cp .env.example .env');
    console.log('  npm run dev');
  } catch (err) {
    console.error(red(err?.stack || String(err)));
    process.exit(1);
  }
}

main();
