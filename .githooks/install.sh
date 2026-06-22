#!/bin/sh
# Install tracked git hooks into .git/hooks/
# Run once after cloning: sh .githooks/install.sh

git config core.hooksPath .githooks
echo "Hooks installed. git will now use .githooks/ for all hook checks."
echo "Active hooks:"
ls .githooks/
