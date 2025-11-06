#!/bin/bash

# Portfolio Deployment Script for GitHub Pages
# This script automates the process of deploying your portfolio to GitHub Pages

set -e  # Exit on error

echo "🚀 Portfolio Deployment Script"
echo "================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote origin exists
if git remote | grep -q "^origin$"; then
    echo "✅ Remote 'origin' already configured"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Remote URL: $REMOTE_URL"
else
    echo "⚠️  No remote 'origin' configured"
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REPO_URL

    if [ -z "$REPO_URL" ]; then
        echo "❌ Error: Repository URL cannot be empty"
        exit 1
    fi

    git remote add origin "$REPO_URL"
    echo "✅ Remote 'origin' added: $REPO_URL"
fi

# Stage all files
echo "📝 Staging files..."
git add .

# Commit changes
echo "💾 Creating commit..."
read -p "Enter commit message (default: 'Update portfolio'): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Update portfolio"}
git commit -m "$COMMIT_MSG" || echo "⚠️  No changes to commit"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="main"
    git branch -M main
    echo "✅ Created and switched to 'main' branch"
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub ($CURRENT_BRANCH branch)..."
git push -u origin "$CURRENT_BRANCH"

echo ""
echo "✨ Deployment successful!"
echo "================================"
echo "📋 Next Steps:"
echo "1. Go to your GitHub repository settings"
echo "2. Navigate to 'Pages' section"
echo "3. Set source to '$CURRENT_BRANCH' branch"
echo "4. Set folder to '/ (root)'"
echo "5. Click 'Save'"
echo ""
echo "Your site will be available at:"
echo "https://navidheydari.github.io/navidheydari/"
echo ""
echo "🎉 Done!"
