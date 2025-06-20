# 🚀 CI/CD Strategy & GitHub Actions

This document explains the complete Continuous Integration and Continuous Deployment strategy implemented for this project.

## 📋 Overview

Our CI/CD pipeline provides a robust, automated workflow that ensures code quality, security, and reliable deployments.

### 🎯 **Goals**
- ✅ **Quality Assurance**: Automated testing and linting
- 🔒 **Security**: Vulnerability scanning and dependency auditing  
- 📦 **Automated Releases**: Semantic versioning and changelog generation
- 🚀 **Deployment**: Automated deployment to staging and production
- 🔄 **Maintenance**: Automated dependency updates

---

## 🔧 Workflows

### 1. 🧪 **CI - Continuous Integration** (`ci.yml`)

**Triggers**: Push and Pull Requests to `main` and `develop` branches

**What it does**:
- 🧪 Runs all tests with coverage reporting
- 🎨 Checks code formatting and linting
- 🔍 TypeScript type checking
- 🏗️ Verifies application builds successfully
- 🔒 Security vulnerability scanning
- ✅ Quality gate with PR status comments

**Matrix Testing**: Node.js 18.x and 20.x

```yaml
# Manual trigger from GitHub UI
gh workflow run ci.yml
```

### 2. 🏷️ **Release - Automated Releases** (`release.yml`)

**Triggers**: Push to `main` branch, Manual dispatch

**What it does**:
- 📊 Analyzes commits using conventional commit format
- 🏷️ Determines version bump (major/minor/patch)
- 📝 Generates changelogs automatically
- 📦 Creates GitHub releases with release notes
- 🎯 Updates package.json version

**Release Types**:
- `feat:` → Minor version (1.1.0)
- `fix:` → Patch version (1.0.1)  
- `BREAKING CHANGE` → Major version (2.0.0)

```bash
# Manual release
gh workflow run release.yml -f release_type=patch
```

### 3. 🚀 **Deploy - Continuous Deployment** (`deploy.yml`)

**Triggers**: Release published, Manual dispatch

**What it does**:
- 🎯 Determines deployment strategy (staging/production)
- 🏗️ Builds application for target environment
- 🧪 Runs smoke tests and health checks
- 📊 Performance auditing (production only)
- 📢 Deployment notifications

**Environments**:
- **Staging**: Pre-releases and manual deployments
- **Production**: Stable releases only

```bash
# Manual deployment
gh workflow run deploy.yml -f environment=staging -f version=v1.2.3
```

### 4. 🔒 **Dependencies & Security** (`dependencies.yml`)

**Triggers**: Daily schedule (6 AM UTC), Manual dispatch, Package changes

**What it does**:
- 🔍 Daily security audits
- 📊 Dependency analysis and unused package detection
- 🆙 Check for available updates
- 🤖 Auto-create PRs for safe patch updates
- 📝 Generate dependency reports

```bash
# Manual security check
gh workflow run dependencies.yml
```

---

## 📦 Dependabot Configuration

**File**: `.github/dependabot.yml`

**Features**:
- 📅 Weekly dependency updates (Mondays 6 AM UTC)
- 🎯 Grouped updates (production vs development dependencies)
- 🚫 Major version updates require manual review
- 🏷️ Auto-labeling and assignment
- 🔄 GitHub Actions updates included

**Update Groups**:
- **Production**: Runtime dependencies (minor/patch only)
- **Development**: Dev tools, testing libraries, types

---

## 🎯 Release Strategy

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/) with automated detection:

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking changes (`BREAKING CHANGE` in commit)
- **MINOR**: New features (`feat:` prefix)
- **PATCH**: Bug fixes (`fix:` prefix)

### Conventional Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
<type>(<scope>): <description>

feat(ui): add new user dashboard
fix(api): resolve authentication issue
docs: update installation guide
chore: update dependencies
```

**Types**:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Release Process

1. **Develop** → Create feature branches
2. **Pull Request** → CI runs automatically
3. **Merge to main** → Release workflow triggers
4. **Auto-release** → Version bump, tag, and GitHub release
5. **Auto-deploy** → Staging first, then production

---

## 🔒 Security & Quality

### Security Measures

- 🔍 **Daily security audits** with `npm audit`
- 🛡️ **Snyk scanning** for vulnerabilities
- 🚫 **High/Critical vulnerabilities block deployments**
- 📊 **Security reports** with detailed metrics

### Quality Gates

**Required for PR merge**:
- ✅ All tests pass (90%+ coverage)
- ✅ Linting passes
- ✅ TypeScript compiles
- ✅ Build succeeds
- ✅ No critical security issues

### Coverage Requirements

- **Minimum**: 70% test coverage
- **Current**: 90.81% coverage
- **Trend**: Maintained with new code

---

## 🚀 Deployment Environments

### Staging Environment

**Purpose**: Testing and validation
**URL**: `https://staging.applause-teste.com`
**Triggers**: 
- Pre-releases
- Manual deployments
- Feature testing

**Features**:
- 🧪 Smoke testing
- 📊 Performance monitoring
- 🔍 Integration testing

### Production Environment

**Purpose**: Live application
**URL**: `https://applause-teste.com`
**Triggers**:
- Stable releases only
- Manual emergency deployments

**Features**:
- 🏥 Health checks
- 📊 Performance auditing
- 📈 Monitoring and alerting

---

## 🛠️ Local Development

### Prerequisites

```bash
# Install dependencies
npm ci

# Set up Git hooks (optional)
npm run prepare
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Linting & Formatting

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Building

```bash
# Development build
npm run dev

# Production build
npm run build

# Start production server
npm start
```

---

## 📊 Monitoring & Metrics

### Workflow Metrics

- 📈 **Build success rate**
- ⏱️ **Average build time**
- 🧪 **Test coverage trends**
- 🔒 **Security vulnerability count**
- 📦 **Deployment frequency**

### Release Metrics

- 🏷️ **Release cadence**
- 📊 **Change volume per release**
- 🐛 **Bug fix vs feature ratio**
- ⏮️ **Rollback frequency**

---

## 🚨 Troubleshooting

### Common Issues

#### CI Failures

```bash
# Check workflow status
gh run list --workflow=ci.yml

# View detailed logs
gh run view <run-id>

# Re-run failed workflows
gh run rerun <run-id>
```

#### Release Issues

```bash
# Check release workflow
gh run list --workflow=release.yml

# Manual release creation
gh release create v1.2.3 --title "Release v1.2.3" --notes "Release notes"
```

#### Deployment Problems

```bash
# Check deployment status
gh run list --workflow=deploy.yml

# Manual deployment trigger
gh workflow run deploy.yml -f environment=staging
```

### Emergency Procedures

#### Hotfix Release

```bash
# Create hotfix branch
git checkout -b hotfix/critical-fix

# Make necessary changes
git commit -m "fix: critical security issue"

# Push and create PR
git push origin hotfix/critical-fix
gh pr create --title "Hotfix: Critical security issue"

# After merge, manual release
gh workflow run release.yml -f release_type=patch
```

#### Production Rollback

```bash
# Deploy previous version
gh workflow run deploy.yml \
  -f environment=production \
  -f version=v1.2.2  # Previous stable version
```

---

## 🔧 Configuration

### Required Secrets

Set these in GitHub Repository Settings → Secrets:

```
CODECOV_TOKEN          # For coverage reporting
SNYK_TOKEN            # For security scanning
VERCEL_TOKEN          # For deployment (if using Vercel)
SLACK_WEBHOOK_URL     # For notifications (optional)
```

### Environment Variables

```bash
# Production build
NODE_ENV=production
NEXT_PUBLIC_APP_VERSION=${GITHUB_REF_NAME}
NEXT_PUBLIC_BUILD_TIME=${GITHUB_RUN_NUMBER}
```

---

## 📚 Best Practices

### Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/new-feature
   # Develop with tests
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   # Create PR
   ```

2. **Code Review**
   - ✅ Review automated checks
   - 🧪 Verify test coverage
   - 📝 Check commit messages
   - 🔍 Security considerations

3. **Merge Strategy**
   - Use "Squash and merge" for features
   - Preserve commit history for important changes
   - Ensure conventional commit format

### Release Management

1. **Regular Releases**
   - Weekly minor releases
   - Immediate critical fixes
   - Monthly major releases (if needed)

2. **Version Planning**
   - Plan breaking changes carefully
   - Communicate major updates
   - Maintain backwards compatibility

3. **Quality Assurance**
   - Test in staging first
   - Monitor deployment metrics
   - Have rollback plan ready

---

## 📞 Support

For issues with CI/CD workflows:

1. **Check GitHub Actions logs** for detailed error information
2. **Review this documentation** for common solutions
3. **Create an issue** with workflow logs and error details
4. **Contact the maintainers** for urgent production issues

---

## 🎉 Contributing

When contributing to this project:

1. ✅ Follow conventional commit format
2. 🧪 Ensure tests pass and coverage maintained
3. 📝 Update documentation if needed
4. 🔍 Review security implications
5. 🎯 Test changes in staging environment

---

*This CI/CD strategy ensures reliable, secure, and automated software delivery. For questions or improvements, please open an issue or discussion.* 