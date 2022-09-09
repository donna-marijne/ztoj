#!/usr/bin/env node

const { program } = require("commander");
const { zipToJson } = require("./index");

program.argument("<zip>", "path to a zip file");
program.parse();

const zipFilePath = program.args[0];

zipToJson(zipFilePath);
