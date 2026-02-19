
$projects = @{
    "bullet-train" = "highspeedtrain,railway";
    "shenzhen-metro" = "tunnel,construction";
    "singapore-lrt" = "city,monorail";
    "mumbai-metro" = "subway,station";
    "one-avighna" = "skyscraper,apartment";
    "nhai-highway" = "highway,road";
    "lodha-towers" = "skyscraper,luxury";
    "dlf-mall" = "shopping,mall";
    "jsw-steel" = "factory,industry"
}

$baseUrl = "https://loremflickr.com/1600/900/"

foreach ($key in $projects.Keys) {
    $terms = $projects[$key]
    Write-Host "Downloading images for $key ($terms)..."
    
    # Main Image
    try {
        $url = "$baseUrl$terms/all?random=$((Get-Random))"
        Invoke-WebRequest -Uri $url -OutFile "public/images/projects/$key-main.jpg" -TimeoutSec 10
        
        # Detail 1
        $url = "$baseUrl$terms/all?random=$((Get-Random))"
        Invoke-WebRequest -Uri $url -OutFile "public/images/projects/$key-detail-1.jpg" -TimeoutSec 10
        
        # Detail 2
        $url = "$baseUrl$terms/all?random=$((Get-Random))"
        Invoke-WebRequest -Uri $url -OutFile "public/images/projects/$key-detail-2.jpg" -TimeoutSec 10
    } catch {
        Write-Host "Error downloading for $key"
    }
    
    Start-Sleep -Seconds 1
}
