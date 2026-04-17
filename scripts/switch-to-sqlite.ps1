# Switch back to SQLite from MongoDB

Write-Host "Switching to SQLite..." -ForegroundColor Yellow

# Projects route
if (Test-Path "app/api/admin/projects/route.ts") {
    Move-Item "app/api/admin/projects/route.ts" "app/api/admin/projects/route-mongodb.ts.bak" -Force
}
if (Test-Path "app/api/admin/projects/route-sqlite.ts.bak") {
    Move-Item "app/api/admin/projects/route-sqlite.ts.bak" "app/api/admin/projects/route.ts" -Force
}

# Projects [id] route
if (Test-Path "app/api/admin/projects/[id]/route.ts") {
    Move-Item "app/api/admin/projects/[id]/route.ts" "app/api/admin/projects/[id]/route-mongodb.ts.bak" -Force
}
if (Test-Path "app/api/admin/projects/[id]/route-sqlite.ts.bak") {
    Move-Item "app/api/admin/projects/[id]/route-sqlite.ts.bak" "app/api/admin/projects/[id]/route.ts" -Force
}

# Auth login route
if (Test-Path "app/api/admin/auth/login/route.ts") {
    Move-Item "app/api/admin/auth/login/route.ts" "app/api/admin/auth/login/route-mongodb.ts.bak" -Force
}
if (Test-Path "app/api/admin/auth/login/route-sqlite.ts.bak") {
    Move-Item "app/api/admin/auth/login/route-sqlite.ts.bak" "app/api/admin/auth/login/route.ts" -Force
}

Write-Host "✓ Switched to SQLite successfully!" -ForegroundColor Green
Write-Host "Please restart your dev server: npm run dev" -ForegroundColor Cyan
