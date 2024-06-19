#!/bin/bash
# Run build
bash ./compiler/tasks/build.sh

# Watch files
echo -e '\n\e[1;33mWatching for changes 👀\n'
npx concurrently "node compiler/scripts/javascript-watcher.js" "node compiler/scripts/styles-watcher.js"
