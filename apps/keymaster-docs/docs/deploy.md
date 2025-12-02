# Deploying to Vercel

This chapter explains how to deploy the `keymaster` documentation site to Vercel with one click.

## 1. Prerequisites

- A GitHub repository (e.g., `https://github.com/Keekuun/keymaster`, containing `apps/keymaster-docs`)
- A Vercel account (login with GitHub)

## 2. Connect GitHub Repository

1. Log in to Vercel console, click **Add New... → Project**.
2. Select **Import Git Repository**, choose your `keymaster` repository from the list.

## 3. Basic Configuration

After importing the repository, configure the Project settings:

- **Framework Preset**: Select `Other` (because we're using pnpm + VitePress, with built-in vercel.json)
- **Root Directory**: Select `apps/keymaster-docs`

> If Vercel has automatically detected `apps/keymaster-docs/vercel.json`, you can use that configuration directly without additional changes.

## 4. Using Project Vercel Configuration

`apps/keymaster-docs/vercel.json` is pre-configured with build command and output directory:

- **buildCommand**: `pnpm --filter keymaster-docs run docs:build`
- **outputDirectory**: `docs/.vitepress/dist`

When deploying, Vercel will:

1. Execute `pnpm install` at the project root to install dependencies.
2. Enter `apps/keymaster-docs` directory and trigger build command according to `vercel.json`.
3. Serve `docs/.vitepress/dist` content as a static site.

## 5. Environment Variables (Optional)

The current documentation site doesn't require additional environment variables. If you add environment configuration later, you can add it in **Environment Variables** in Vercel project settings.

## 6. Verify Deployment

After deployment, Vercel will provide an access URL (e.g., `https://keymaster-docs.vercel.app`):

- Open the URL in a browser.
- Confirm homepage styles, React/Vue quick start pages, and interactive demos (shortcuts `Ctrl+S` / `Ctrl+Z`) all work correctly.
