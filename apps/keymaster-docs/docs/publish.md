# Publishing to npm

This document explains how to publish packages from the keymaster monorepo to npm.

## 📦 Package Publishing Order

Due to dependency relationships, packages **must** be published in the following order:

1. **@keekuun/keymaster-core** (must be published first)
2. **@keekuun/keymaster-react** (depends on core)
3. **@keekuun/keymaster-vue** (depends on core)

> ⚠️ **Important**: If React or Vue packages are published first, publishing will fail because the core package cannot be found.

## 🚀 Complete Publishing Process

### Step 1: Preparation

#### 1.1 Confirm npm Account

```bash
# Check if logged in
npm whoami

# If not logged in, log in
npm login
```

#### 1.2 Confirm Publishing Permissions

Ensure your npm account has publishing permissions for the `@keekuun` scope.

#### 1.3 Commit All Code

```bash
git add .
git commit -m "feat: prepare for new version release"
git push
```

### Step 2: Update Version Numbers

Use `standard-version` to automatically update version numbers for all packages:

```bash
# Patch version (0.1.0 -> 0.1.1) - bug fixes
pnpm run release

# Minor version (0.1.0 -> 0.2.0) - new features
pnpm run release:minor

# Major version (0.1.0 -> 1.0.0) - breaking changes
pnpm run release:major
```

**After execution, it will automatically:**

- ✅ Update root `package.json` version
- ✅ Update `packages/keymaster-core/package.json` version
- ✅ Update `packages/keymaster-react/package.json` version
- ✅ Update `packages/keymaster-vue/package.json` version
- ✅ Generate/update `CHANGELOG.md`
- ✅ Create git tag and push to remote

### Step 3: Build All Packages

```bash
# Install dependencies (ensure workspace dependencies are correctly linked)
pnpm install

# Build all packages
pnpm build
```

**Verify Build Results:**

- Check if `packages/keymaster-core/dist` directory exists
- Check if `packages/keymaster-react/dist` directory exists
- Check if `packages/keymaster-vue/dist` directory exists

### Step 4: Publish to npm

#### Method 1: Publish All Packages at Once (Recommended)

```bash
pnpm run publish:all
```

This will automatically publish in the correct order:

1. `@keekuun/keymaster-core`
2. `@keekuun/keymaster-react`
3. `@keekuun/keymaster-vue`

#### Method 2: Publish Manually in Order

If one-click publishing fails, you can publish manually in order:

```bash
# 1. Publish core package first
pnpm run publish:core

# Wait a few seconds for npm to sync

# 2. Then publish react package
pnpm run publish:react

# Wait a few seconds for npm to sync

# 3. Finally publish vue package
pnpm run publish:vue
```

### Step 5: Verify Publishing

After publishing, visit the following links to verify:

- **Core**: https://www.npmjs.com/package/@keekuun/keymaster-core
- **React**: https://www.npmjs.com/package/@keekuun/keymaster-react
- **Vue**: https://www.npmjs.com/package/@keekuun/keymaster-vue

**Checklist:**

- [ ] Version numbers are correct
- [ ] README content displays correctly
- [ ] Dependency relationships are correct (React/Vue packages show dependency on core package)
- [ ] Can install normally: `npm install @keekuun/keymaster-react`

## 📋 Dependency Relationship Notes

### Workspace Protocol Auto-Conversion

During monorepo development, React and Vue packages use `workspace:*` to reference the core package:

```json
{
  "dependencies": {
    "@keekuun/keymaster-core": "workspace:*"
  }
}
```

**pnpm automatically handles this during publishing:**

- Converts `workspace:*` to the actual version number of the published core package
- For example: If core package version is `0.1.0`, it will automatically become `^0.1.0` after publishing

### User Installation Experience

When users install `@keekuun/keymaster-react`:

```bash
npm install @keekuun/keymaster-react
```

npm will automatically:

1. ✅ Install `@keekuun/keymaster-react`
2. ✅ Read its `dependencies`, find that `@keekuun/keymaster-core` is needed
3. ✅ Automatically install `@keekuun/keymaster-core` (specified version, e.g., `^0.1.0`)
4. ✅ **Users don't need to manually install the core package**

## 🔧 Publish a Single Package

If you need to publish only a specific package (e.g., only fixed a bug in the React package):

```bash
# 1. Only update React package version (don't update other packages)
# Note: You may need to manually update the version in package.json

# 2. Build
pnpm build

# 3. Publish (Note: Need to ensure core package is already published)
pnpm run publish:react
```

**⚠️ Note**: Even if only publishing the React package, you must ensure the core package already exists on npm, otherwise publishing will fail.

## ❌ Troubleshooting

### Issue 1: Cannot find core package when publishing React/Vue package

**Error Message:**

```
npm ERR! 404 '@keekuun/keymaster-core@^0.1.0' is not in the npm registry.
```

**Cause**: The core package hasn't been published to npm yet.

**Solution**:

1. Publish core package first: `pnpm run publish:core`
2. Wait 1-2 minutes for npm to sync
3. Then publish React/Vue package

### Issue 2: Version Numbers Inconsistent

**Cause**: A package's version number wasn't updated correctly.

**Solution**:

1. Check if `.versionrc.json` includes all packages
2. Re-run `pnpm run release`
3. Manually check if version numbers in each package's `package.json` are consistent

### Issue 3: Build Failure

**Cause**: Dependencies not installed correctly or build configuration issues.

**Solution**:

```bash
# Clean and reinstall
rm -rf node_modules packages/*/node_modules
pnpm install

# Rebuild
pnpm build
```

### Issue 4: npm Login Failed

**Cause**: npm account not logged in or token expired.

**Solution**:

```bash
# Re-login
npm login

# If using 2FA, ensure token is valid
npm whoami
```

## ✅ Publishing Checklist

Before publishing, confirm:

- [ ] All code has been committed to git
- [ ] Ran `pnpm build` and build succeeded
- [ ] Ran `pnpm run release` to update version numbers
- [ ] Checked `CHANGELOG.md` content is correct
- [ ] Confirmed publishing order (core -> react -> vue)
- [ ] npm account is logged in (`npm whoami`)
- [ ] Has publishing permissions (for `@keekuun` scope)
- [ ] Tested that locally built artifacts work correctly

## 📚 Related Documentation

- [Deploy Documentation Site](./deploy.md) - How to deploy documentation to Vercel
- [GitHub Repository](https://github.com/Keekuun/keymaster) - View source code and commit history
