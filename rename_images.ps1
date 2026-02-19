
$images = @{
    "1.png" = "chemicals-lab-testing.png";
    "2.png" = "factory-floor.png";
    "3.png" = "logistics-trucks.png";
    "4.png" = "construction-site.png";
    "5.png" = "oem-manufacturing.png";
    "6.png" = "mining-operations.png";
    "7.png" = "warehouse-interior.png";
    "8.png" = "chemicals-product-range.png";
    "9.png" = "product-catalogue-cover.png";
    "10.png" = "mahalaxmi-group-hq.png";
    "11.png" = "infrastructure-project.png";
    "12.png" = "infrastructure-background.png";
    "13.png" = "chemical-plant-exterior.png";
    "14.png" = "safety-equipment.png";
    "logitscsimamges.jpeg" = "logistics-fleet.jpeg";
    "logitscsimamges1.jpeg" = "logistics-fleet-2.jpeg";
    "chemcial_company.jpg" = "chemical-company.jpg";
    "mining.jpg" = "silica-mining.jpg";
    "mining2.jpeg" = "basalt-mining.jpeg";
    "warehosuing.webp" = "warehousing-hub.webp";
    "warehouisin2.jpeg" = "warehousing-interior.jpeg";
    "transport contracts.jpg" = "transport-contracts.jpg"
}

$dir = "c:\Users\Talha Shaikh\Downloads\files (1)\public\images"

foreach ($old in $images.Keys) {
    $new = $images[$old]
    $oldPath = Join-Path $dir $old
    $newPath = Join-Path $dir $new
    if (Test-Path $oldPath) {
        Rename-Item -Path $oldPath -NewName $new -Force
        Write-Host "Renamed $old to $new"
    } else {
        Write-Host "File $old not found"
    }
}
