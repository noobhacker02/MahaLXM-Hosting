$baseDir = "c:\Users\Talha Shaikh\Downloads\files (1)\public\images"
$mapping = @{
    "National Bullet Train1.jpeg" = "bullet-train-main.jpeg"
    "National Bullet Train2.webp" = "bullet-train-detail-1.webp"
    "Shenzhen Metro Line 20.jpeg" = "shenzhen-metro-main.jpeg"
    "Shenzhen Metro Line 20-3.jpg" = "shenzhen-metro-detail-1.jpg"
    "Shenzhen Metro Line 202.webp" = "shenzhen-metro-detail-2.webp"
    "Singapore LRT.webp" = "singapore-lrt-main.webp"
    "Singapore LRT2.jpg" = "singapore-lrt-detail-1.jpg"
    "Mumbai Metro Line 3.jpeg" = "mumbai-metro-main.jpeg"
    "Mumbai Metro Line 3-2.webp" = "mumbai-metro-detail-1.webp"
    "One Avighna Park.jpg" = "one-avighna-main.jpg"
    "One Avighna Park2.jpg" = "one-avighna-detail-1.jpg"
    "NHAI Highway NH-08.jpg" = "nhai-highway-main.jpg"
    "NHAI Highway NH-08-2.jpeg" = "nhai-highway-detail-1.jpeg"
    "Lodha World Towers.webp" = "lodha-towers-main.webp"
    "Lodha World Towers2.webp" = "lodha-towers-detail-1.webp"
    "DLF Mall of India.jpg" = "dlf-mall-main.jpg"
    "DLF Mall of India2.avif" = "dlf-mall-detail-1.avif"
    "JSW Steel Plant.jpeg" = "jsw-steel-main.jpeg"
    "JSW Steel Plant2.jpg" = "jsw-steel-detail-1.jpg"
}

foreach ($key in $mapping.Keys) {
    $src = Join-Path $baseDir $key
    $dest = Join-Path $baseDir $mapping[$key]
    if (Test-Path $src) {
        if (Test-Path $dest) {
            Remove-Item $dest -Force
        }
        Rename-Item $src -NewName $mapping[$key] -Force
        Write-Host "Renamed $key to $($mapping[$key])"
    } else {
        Write-Host "Skipping $key (not found)" -ForegroundColor Yellow
    }
}
