$package= Load-NodePackage
$moduleName=$package.name

$dependencies=Get-ObjectProperties $package.dependencies

Write-Host $dependencies

# $stopFilePath="node_modules\$moduleName\$moduleName.stop.js"
# $stopFilePath= Convert-Path $stopFilePath
# [bool]$exists=(Test-Path $stopFilePath)
# if ($exists -eq $false){
#     $stopFilePath="$moduleName.stop.js"
#     $stopFilePath= Convert-Path $startFilePath
# }
# node $stopFilePath
$LASTEXITCODE=$true