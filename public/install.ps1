# Instala una skill de cz-chan/skills en el proyecto actual (Windows PowerShell 5.1+ / pwsh).
#   & ([scriptblock]::Create((irm https://skills.c12z.io/install.ps1))) <skill> [carpeta]
# <skill>: ruta dentro de skills/ ("code-mentor", "frontend/react-hooks").
# [carpeta]: destino, por defecto .claude/skills. Si la skill ya existe, la reemplaza.
# Solo ASCII: irm puede decodificar el archivo con otro charset.
param(
	[Parameter(Mandatory)][string]$Skill,
	[string]$Dir = ".claude/skills"
)
$ErrorActionPreference = "Stop"

$Repo = "cz-chan/skills"
$Branch = "main"

if ($Skill -match '\.\.' -or $Skill -match '^[/\\]') { throw "skill no valida: $Skill" }

$name = Split-Path $Skill -Leaf
# El tarball tiene raiz "skills-<rama>/skills/"; se quitan esas 2 mas los segmentos de categoria.
$strip = $Skill.Split('/').Count + 1

$tmp = Join-Path ([IO.Path]::GetTempPath()) ([guid]::NewGuid())
New-Item -ItemType Directory $tmp | Out-Null
try {
	# Descarga a archivo: en PowerShell 5.1 el pipe entre programas corrompe datos binarios.
	$tgz = Join-Path $tmp "repo.tgz"
	Invoke-WebRequest "https://codeload.github.com/$Repo/tar.gz/$Branch" -OutFile $tgz -UseBasicParsing
	tar -xzf $tgz -C $tmp --strip-components=$strip "skills-$Branch/skills/$Skill" 2>$null
	$src = Join-Path $tmp $name
	if ($LASTEXITCODE -or -not (Test-Path (Join-Path $src "SKILL.md"))) { throw "skill no encontrada: $Skill" }

	New-Item -ItemType Directory -Force $Dir | Out-Null
	$dest = Join-Path $Dir $name
	if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
	# Copy en vez de Move: el temporal puede estar en otra unidad.
	Copy-Item -Recurse $src $dest
	Write-Host "OK $name -> $dest"
}
finally {
	Remove-Item -Recurse -Force $tmp
}
