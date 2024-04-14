#!/bin/bash

ssh -t root@5.78.109.1 << EOF

cd powerlifting.gg

git fetch origin main

git reset --hard origin/main

docker compose -f docker-compose.prod.yml up -d --build

EOF
