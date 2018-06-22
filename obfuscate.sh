#!/bin/sh

node_modules/javascript-obfuscator/bin/javascript-obfuscator src/bart_trial.js --output dist/bart_trial-obfuscated.js
node_modules/javascript-obfuscator/bin/javascript-obfuscator src/jquery.bart_reverse.js --output dist/jquery-obfuscated.bart_reverse.js

