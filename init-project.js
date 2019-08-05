#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const assert = require('assert')

const packageJson = fs.readFileSync('package.json').toString()
const serverlessYaml = fs.readFileSync('serverless.yml').toString()

const { name: templateName, version } = JSON.parse(packageJson)
const projectName = path.basename(__dirname)

assert(projectName !== templateName, `It looks like you have already initialized your project [${projectName}]`)

const newPackageJson = packageJson.replace(new RegExp(templateName, 'g'), projectName).replace(`"${version}"`, '"0.0.0"')
const newServerlessYaml = serverlessYaml.replace(new RegExp(templateName, 'g'), projectName)

fs.writeFileSync('package.json', newPackageJson)
fs.writeFileSync('serverless.yml', newServerlessYaml)

fs.writeFileSync('README.md', `#${projectName}`)
fs.unlinkSync(__filename)
