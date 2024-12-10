#!/bin/bash
# Pobierz zmienne z głównego .env projektu
source ../.env

# Uruchom docker-compose z tymi zmiennymi
docker-compose up -d 