# SkillForge AWS Deployment Script

Write-Host "Starting SkillForge Deployment..." -ForegroundColor Cyan

# Variables
$AWS_ACCOUNT_ID = "623593083827"
$AWS_REGION = "ap-south-1"
$ECR_BACKEND = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/skillforge-backend"
$ECR_FRONTEND = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/skillforge-frontend"

# Step 1: Build Images
Write-Host "`nBuilding Backend..." -ForegroundColor Yellow
Set-Location backend
docker build -t skillforge-backend:latest .
if ($LASTEXITCODE -ne 0) { Write-Host "Backend build failed!" -ForegroundColor Red; exit 1 }

Write-Host "`nBuilding Frontend..." -ForegroundColor Yellow
Set-Location ../frontend
docker build -t skillforge-frontend:latest .
if ($LASTEXITCODE -ne 0) { Write-Host "Frontend build failed!" -ForegroundColor Red; exit 1 }

Set-Location ..

# Step 2: Login to ECR
Write-Host "`nLogging into ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Step 3: Tag Images
Write-Host "`nTagging Images..." -ForegroundColor Yellow
docker tag skillforge-backend:latest "$ECR_BACKEND:latest"
docker tag skillforge-frontend:latest "$ECR_FRONTEND:latest"

# Step 4: Push Images
Write-Host "`nPushing Backend to ECR..." -ForegroundColor Yellow
docker push "$ECR_BACKEND:latest"

Write-Host "`nPushing Frontend to ECR..." -ForegroundColor Yellow
docker push "$ECR_FRONTEND:latest"

# Step 5: Update ECS Services
Write-Host "`nUpdating Backend Service..." -ForegroundColor Yellow
aws ecs update-service --cluster skillforge-cluster --service skillforge-backend-service --force-new-deployment --region $AWS_REGION --query "service.[serviceName,status]" --output table

Write-Host "`nUpdating Frontend Service..." -ForegroundColor Yellow
aws ecs update-service --cluster skillforge-cluster --service skillforge-frontend-service --force-new-deployment --region $AWS_REGION --query "service.[serviceName,status]" --output table

# Step 6: Get ALB URL
Write-Host "`nDeployment initiated!" -ForegroundColor Green
Write-Host "`nWaiting for deployment to complete (3-5 minutes)..." -ForegroundColor Yellow

Start-Sleep -Seconds 180

$ALB_DNS = aws elbv2 describe-load-balancers --region $AWS_REGION --query "LoadBalancers[?LoadBalancerName=='skillforge-alb'].DNSName" --output text

Write-Host "`nYour App URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://$ALB_DNS" -ForegroundColor White
Write-Host "   Backend:  http://$ALB_DNS:3001/health" -ForegroundColor White

Write-Host "`nDeployment Complete!" -ForegroundColor Green
