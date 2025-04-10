# Port 3001'i kullanan işlemleri bul ve sonlandır
$processIds = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($processIds) {
    foreach ($pid in $processIds) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "Port 3001'i kullanan işlem sonlandırıldı (PID: $pid)"
    }
}

# Node süreçlerini kontrol et ve sonlandır
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Node.js süreçleri sonlandırıldı"
}

# 2 saniye bekle
Start-Sleep -Seconds 2

# Development sunucusunu başlat
Write-Host "Development sunucusu başlatılıyor..."
npm run dev 