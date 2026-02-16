$body = @{
    email = "burhan.malu.learning@gmail.com"
    password = "123456"
    full_name = "Burhan Malu"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Account created successfully!" -ForegroundColor Green
    Write-Host "📧 Email: burhan.malu.learning@gmail.com"
    Write-Host "🔑 Password: 123456"
    Write-Host ""
    Write-Host "You can now login with these credentials!" -ForegroundColor Cyan
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorDetails.detail -like "*already registered*") {
        Write-Host "⚠️  Account already exists!" -ForegroundColor Yellow
        Write-Host "📧 Email: burhan.malu.learning@gmail.com"
        Write-Host "🔑 Password: 123456"
        Write-Host ""
        Write-Host "You can login with these credentials!" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Error: $($errorDetails.detail)" -ForegroundColor Red
    }
}
