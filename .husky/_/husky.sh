#!/usr/bin/env sh

if [ -z "$husky_skip_init" ]; then
  debug() {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $1"
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ ! -f package.json ]; then
    debug "package.json not found, skipping hook"
    exit 0
  fi

  command_exists() {
    command -v "$1" >/dev/null 2>&1
  }

  if command_exists pnpm; then
    debug "running pnpm in $hook_name hook"
  else
    echo "pnpm is required to run git hooks. Please install pnpm."
    exit 1
  fi
fi


