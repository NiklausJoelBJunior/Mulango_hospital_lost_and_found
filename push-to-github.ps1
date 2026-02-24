<#
Simple helper script to commit and push workspace changes to GitHub (Windows PowerShell).
Usage examples:
  ./push-to-github.ps1
  ./push-to-github.ps1 -Branch feature/mlaf-homepage-mobile-redirect -Message "feat: mlaf homepage"
#>
param(
    [string]$Branch = "main",
    [string]$Message = "chore: use mlaf tokens on homepage; mobile Home -> /items",
    [switch]$CreateBranch
)

function Abort([string]$msg){ Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }

# Ensure git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Abort "git CLI not found. Install Git for Windows (https://git-scm.com/download/win) and re-run this script."
}

# Show status
git --version
Write-Host "--- git status ---"
git status --short

# Optionally create and switch to a new branch
if ($CreateBranch) {
    Write-Host "Creating and switching to branch '$Branch'..."
    git checkout -b $Branch
} else {
    Write-Host "Checking out branch '$Branch'..."
    git checkout $Branch
}

# Stage and commit
Write-Host "Staging changes..."
git add -A

$staged = git status --porcelain
if (-not $staged) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
} else {
    Write-Host "Committing changes with message: $Message"
    git commit -m $Message
}

# Ensure origin remote points to the target repo
$target = "https://github.com/NiklausJoelBJunior/Mulango_hospital_lost_and_found.git"
Write-Host "Setting origin remote to $target"
git remote remove origin 2>$null | Out-Null || $null
git remote add origin $target 2>$null | Out-Null || $null

# Push
Write-Host "Pushing to origin/$Branch..."
git push origin HEAD:$Branch

Write-Host "Done." -ForegroundColor Green
