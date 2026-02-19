$baseDir = "c:\Users\Talha Shaikh\Downloads\files (1)\public\downloads"
$renames = @{
    "Mahalaxmi .pdf" = "mahalaxmi-group-profile.pdf"
    "Mahalaxmi Chemicals.pdf" = "mahalaxmi-chemicals-profile.pdf"
    "GSP Company Profile 2024.pdf" = "gsp-company-profile-2024.pdf"
    "Project Reference India.pdf" = "project-reference-india.pdf"
    "Project List for Mumbai.pdf" = "project-list-mumbai.pdf"
    "Project List for Delhi.pdf" = "project-list-delhi.pdf"
    "CHENNAI PROJECT LIST.pdf" = "project-list-chennai.pdf"
    "Appendix A (Rasa Infrachem).pdf" = "appendix-rasa-infrachem.pdf"
}

foreach ($key in $renames.Keys) {
    $src = Join-Path $baseDir $key
    $dest = Join-Path $baseDir $renames[$key]
    if (Test-Path $src) {
        Rename-Item $src -NewName $renames[$key] -Force
        Write-Host "Renamed $key to $($renames[$key])"
    } else {
        Write-Host "Skipping $key (not found)" -ForegroundColor Yellow
    }
}
