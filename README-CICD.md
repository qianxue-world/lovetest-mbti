# CI/CD Setup Guide

## GitHub Actions - Automatic Docker Build & Push

This project is configured to automatically build and push Docker images to DockerHub whenever you push code.

## Prerequisites

### 1. Create DockerHub Account
- Sign up at https://hub.docker.com
- Create a repository named `mbti-personality-test`

### 2. Generate DockerHub Access Token
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Name it (e.g., "GitHub Actions")
4. Copy the token (you won't see it again!)

### 3. Configure GitHub Secrets
1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

   - **DOCKERHUB_USERNAME**
     - Value: Your DockerHub username
   
   - **DOCKERHUB_TOKEN**
     - Value: The access token you generated

## How It Works

### Automatic Builds

The workflow triggers on:

1. **Push to main/master/develop branches**
   - Builds and pushes with branch name as tag
   - Also tags as `latest` if pushing to default branch

2. **Pull Requests**
   - Builds image to verify it works
   - Does NOT push to DockerHub

3. **Git Tags (v*)**
   - Builds and pushes with version tag
   - Example: `v1.0.0` → creates tags `1.0.0`, `1.0`, `1`, `latest`

4. **GitHub Releases**
   - Separate workflow for releases
   - Creates stable version tags

### Image Tags Generated

When you push to main branch:
```
username/mbti-personality-test:latest
username/mbti-personality-test:main
username/mbti-personality-test:main-abc1234 (commit SHA)
```

When you create a tag `v1.2.3`:
```
username/mbti-personality-test:1.2.3
username/mbti-personality-test:1.2
username/mbti-personality-test:1
username/mbti-personality-test:latest
```

## Usage

### 1. Push Code (Automatic Build)

```bash
git add .
git commit -m "Update feature"
git push origin main
```

GitHub Actions will automatically:
- Build the Docker image
- Run tests (if configured)
- Push to DockerHub
- Tag appropriately

### 2. Create a Release

```bash
# Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

Or create a release through GitHub UI:
1. Go to **Releases** → **Create a new release**
2. Choose a tag (e.g., `v1.0.0`)
3. Add release notes
4. Publish release

### 3. Pull Image on Your Server

```bash
# Pull latest version
docker pull username/mbti-personality-test:latest

# Pull specific version
docker pull username/mbti-personality-test:1.0.0

# Update docker-compose.yml to use your image
```

## Update docker-compose.yml

Change the build configuration to use your DockerHub image:

```yaml
version: '3.8'

services:
  mbti-test:
    image: username/mbti-personality-test:latest  # Replace 'username'
    container_name: mbti-personality-test
    ports:
      - "80:80"
    restart: unless-stopped
```

Then deploy:
```bash
docker-compose pull
docker-compose up -d
```

## Deployment Workflow

### Development
```bash
# 1. Make changes locally
git add .
git commit -m "Add new feature"
git push origin develop

# 2. GitHub Actions builds: username/mbti-personality-test:develop

# 3. Test on staging server
docker pull username/mbti-personality-test:develop
docker-compose up -d
```

### Production
```bash
# 1. Merge to main
git checkout main
git merge develop
git push origin main

# 2. GitHub Actions builds: username/mbti-personality-test:latest

# 3. Deploy to production
ssh user@production-server
docker pull username/mbti-personality-test:latest
docker-compose up -d
```

### Release
```bash
# 1. Create version tag
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# 2. GitHub Actions builds: username/mbti-personality-test:1.0.0

# 3. Deploy specific version
docker pull username/mbti-personality-test:1.0.0
```

## Monitoring Builds

### View Build Status
1. Go to your GitHub repository
2. Click **Actions** tab
3. See all workflow runs and their status

### Build Badges
Add to your README.md:
```markdown
![Docker Build](https://github.com/username/repo/actions/workflows/docker-build.yml/badge.svg)
```

## Troubleshooting

### Build Fails
1. Check the Actions tab for error logs
2. Common issues:
   - Invalid DockerHub credentials
   - Dockerfile syntax errors
   - Missing dependencies in package.json

### Can't Push to DockerHub
1. Verify secrets are set correctly:
   - Settings → Secrets → Actions
   - Check DOCKERHUB_USERNAME and DOCKERHUB_TOKEN
2. Ensure DockerHub token has write permissions
3. Check if repository exists on DockerHub

### Image Not Updating
```bash
# Force pull latest image
docker-compose pull
docker-compose down
docker-compose up -d
```

## Advanced Configuration

### Build for Multiple Platforms
Already configured for:
- `linux/amd64` (Intel/AMD)
- `linux/arm64` (ARM, Apple Silicon)

### Add Build Arguments
Edit `.github/workflows/docker-build.yml`:
```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    build-args: |
      NODE_ENV=production
      API_URL=${{ secrets.API_URL }}
```

### Conditional Builds
Only build on specific paths:
```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'src/**'
      - 'package.json'
      - 'Dockerfile'
```

## Security Best Practices

1. ✅ Use access tokens, not passwords
2. ✅ Store credentials in GitHub Secrets
3. ✅ Regularly rotate access tokens
4. ✅ Use specific version tags in production
5. ✅ Scan images for vulnerabilities

### Add Vulnerability Scanning
```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ secrets.DOCKERHUB_USERNAME }}/mbti-personality-test:latest
    format: 'sarif'
    output: 'trivy-results.sarif'
```

## Cost Optimization

- DockerHub free tier: Unlimited public repositories
- GitHub Actions: 2,000 minutes/month free for public repos
- Build cache reduces build time and costs

## Support

If builds fail, check:
1. GitHub Actions logs
2. DockerHub repository settings
3. Secrets configuration
4. Dockerfile syntax

For more help, see:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [DockerHub Documentation](https://docs.docker.com/docker-hub/)
