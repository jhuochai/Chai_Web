param(
  [Parameter(Mandatory=$true)][string]$WorkbenchFolder,
  [Parameter(Mandatory=$true)][string]$RefrainZip
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$releaseRoot = Join-Path $PSScriptRoot '../public/downloads'
New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
$workbenchSource = (Resolve-Path -LiteralPath $WorkbenchFolder).Path
$lyricsSource = (Resolve-Path -LiteralPath $RefrainZip).Path
if (!(Test-Path -LiteralPath (Join-Path $workbenchSource 'LivestreamWorkbench.exe'))) { throw 'Expected a packaged Workbench directory.' }
# App data is stored outside these application distributions. Reject accidental copies.
$privateNames = @('workbench.json', 'workbench.previous.json', 'connections.enc', 'appearance.json', '.env', 'credentials.json')
$privateFiles = Get-ChildItem -LiteralPath $workbenchSource -Recurse -File | Where-Object { $_.Name -in $privateNames -or $_.Name -like 'before-restore-*' }
if ($privateFiles) { throw 'Personal-data files found in Workbench package; refusing to package.' }
$archive = [IO.Compression.ZipFile]::OpenRead($lyricsSource)
try {
  if (!($archive.Entries | Where-Object { $_.Name -eq 'Refrain.exe' })) { throw 'Expected a Refrain release ZIP.' }
  if ($archive.Entries | Where-Object { $_.Name -in $privateNames -or $_.FullName -match '(^|/)(userData|logs|cache)/' }) { throw 'Possible user data found in Refrain ZIP.' }
} finally { $archive.Dispose() }
$workbenchTarget = Join-Path $releaseRoot 'livestream-workbench-0.4.1-win-x64.zip'
if (!(Test-Path -LiteralPath $workbenchTarget)) {
  [IO.Compression.ZipFile]::CreateFromDirectory($workbenchSource, $workbenchTarget, [IO.Compression.CompressionLevel]::Optimal, $true)
  $archive = [IO.Compression.ZipFile]::Open($workbenchTarget, [IO.Compression.ZipArchiveMode]::Update)
  try {
    $entry = $archive.CreateEntry('START-HERE.txt')
    $writer = [IO.StreamWriter]::new($entry.Open(), [Text.UTF8Encoding]::new($false))
    try { $writer.WriteLine("直播工作台 0.4.1 / Windows x64`n解壓縮整個資料夾，開啟 LivestreamWorkbench.exe。請保留所有程式檔案。`n手動紀錄不需帳號；Twitch/YouTube 串接需自行設定。`n個人紀錄保存在 Windows 應用程式資料夾；請在設定中定期匯出備份。`n完整功能說明請見作品集網站的製作過程與下載頁。") } finally { $writer.Dispose() }
  } finally { $archive.Dispose() }
}
$lyricsTarget = Join-Path $releaseRoot 'Refrain-0.1.1-win-x64.zip'
if (!(Test-Path -LiteralPath $lyricsTarget)) { Copy-Item -LiteralPath $lyricsSource -Destination $lyricsTarget }
Get-Item -LiteralPath $workbenchTarget,$lyricsTarget | Select-Object Name,Length
