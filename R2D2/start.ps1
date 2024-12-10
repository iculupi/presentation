# Pobierz zmienne z głównego .env projektu
Get-Content ../.env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
    }
}

# Uruchom docker-compose
docker-compose up -d 