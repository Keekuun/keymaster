# Version Management

This document explains keymaster's version management strategy and how to select and use documentation for different versions.

## 📦 Current Versions

<VersionList />

> 💡 **Tip**: The documentation site always displays the latest version. If you're using an older version, refer to the version compatibility information below.

## 🔍 View All Versions

### Method 1: npm Package Page

Visit the following links to view all published versions:

- **Core**: https://www.npmjs.com/package/@keekuun/keymaster-core?activeTab=versions
- **React**: https://www.npmjs.com/package/@keekuun/keymaster-react?activeTab=versions
- **Vue**: https://www.npmjs.com/package/@keekuun/keymaster-vue?activeTab=versions

On the npm page, you can:

- View all historical versions
- View release notes for each version
- View dependency relationships for each version
- Download packages for specific versions

### Method 2: GitHub Releases

Visit [GitHub Releases](https://github.com/Keekuun/keymaster/releases) to view:

- Detailed version release notes
- Changelog (CHANGELOG)
- Download source code

### Method 3: npm Command Line

```bash
# View all available versions
npm view @keekuun/keymaster-react versions

# View latest version
npm view @keekuun/keymaster-react version

# View detailed information for a specific version
npm view @keekuun/keymaster-react@0.1.0
```

## 📋 Version Compatibility

### Semantic Versioning

keymaster follows [Semantic Versioning](https://semver.org/) specification:

- **Major Version**: Incompatible API changes
- **Minor Version**: Backward-compatible feature additions
- **Patch Version**: Backward-compatible bug fixes

### Version Compatibility Matrix

| Core Version | React Version | Vue Version | Compatibility          |
| ------------ | ------------- | ----------- | ---------------------- |
| 0.1.x        | 0.1.x         | 0.1.x       | ✅ Fully compatible    |
| 0.2.x        | 0.1.x         | 0.1.x       | ⚠️ May be incompatible |
| 0.1.x        | 0.2.x         | 0.1.x       | ⚠️ May be incompatible |

> ⚠️ **Note**: Both React and Vue packages depend on the core package. It's recommended to keep all three packages at the same version, or at least ensure the core version is compatible.

### Check Your Version

```bash
# Run in project root directory
npm list @keekuun/keymaster-react
npm list @keekuun/keymaster-vue
npm list @keekuun/keymaster-core
```

## 🔄 Upgrade Guide

### Patch Version Upgrade (0.1.0 → 0.1.1)

Usually only contains bug fixes, **recommended to upgrade immediately**:

```bash
npm update @keekuun/keymaster-react
npm update @keekuun/keymaster-vue
npm update @keekuun/keymaster-core
```

### Minor Version Upgrade (0.1.x → 0.2.x)

May contain new features but maintains backward compatibility:

1. **Check Changelog**: Visit [GitHub Releases](https://github.com/Keekuun/keymaster/releases) to see new features
2. **Update Dependencies**:
   ```bash
   npm install @keekuun/keymaster-react@latest
   npm install @keekuun/keymaster-vue@latest
   npm install @keekuun/keymaster-core@latest
   ```
3. **Test Application**: Ensure all shortcut functionality works correctly

### Major Version Upgrade (0.x.x → 1.0.0)

May contain breaking changes, requires careful evaluation:

1. **Read Migration Guide**: Check [CHANGELOG.md](https://github.com/Keekuun/keymaster/blob/main/CHANGELOG.md)
2. **Check Breaking Changes**: See if there are API changes
3. **Update Code**: Modify code according to migration guide
4. **Comprehensive Testing**: Ensure all functionality works

## 📚 Documentation Version Notes

### Documentation Site Version

The documentation site (https://keymaster-docs.vercel.app) always displays the **latest version** documentation.

### If You're Using an Older Version

If you've installed an older version (e.g., `0.1.0`) but the documentation shows a newer version (e.g., `0.1.2`), please note:

1. **APIs may differ slightly**: New versions may add new features that older versions may not support
2. **Check README for that version**: You can view the README for each version on the npm package page
3. **Check GitHub history**: Switch to the corresponding version tag in GitHub to view the documentation at that time

### View Historical Version Documentation

1. **GitHub Tags**:
   - Visit https://github.com/Keekuun/keymaster/tags
   - Select the corresponding version tag (e.g., `v0.1.0`)
   - View the README file for that version

2. **npm Package Page**:
   - In the version list on the npm package page, select a specific version
   - View the README content for that version

## 🐛 Version-Related Issues

### Issue 1: Installed Version Doesn't Match Documentation

**Symptoms**: Following the documentation to use APIs, but encountering type errors or runtime errors.

**Solution**:

1. Check your installed version: `npm list @keekuun/keymaster-react`
2. View the README for that version (on npm package page)
3. Or upgrade to latest version: `npm install @keekuun/keymaster-react@latest`

### Issue 2: Dependency Version Conflicts

**Symptoms**: React package and core package versions don't match.

**Solution**:

```bash
# Ensure versions are consistent
npm install @keekuun/keymaster-core@0.1.2
npm install @keekuun/keymaster-react@0.1.2
npm install @keekuun/keymaster-vue@0.1.2
```

### Issue 3: Need to Lock Specific Version

If you need to lock to a specific version (e.g., to avoid automatic upgrades):

```json
{
  "dependencies": {
    "@keekuun/keymaster-react": "0.1.0",
    "@keekuun/keymaster-vue": "0.1.0",
    "@keekuun/keymaster-core": "0.1.0"
  }
}
```

## 📝 Version Release Process

For information on how to release new versions, see the [Publish Documentation](./publish.md).

## 🔗 Related Links

- [npm Package Page](https://www.npmjs.com/org/keekuun)
- [GitHub Releases](https://github.com/Keekuun/keymaster/releases)
- [CHANGELOG.md](https://github.com/Keekuun/keymaster/blob/main/CHANGELOG.md)
- [Semantic Versioning Specification](https://semver.org/)
