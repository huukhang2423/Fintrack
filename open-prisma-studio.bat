@echo off
cd server
echo Opening Prisma Studio with Production Database...
dotenv -e .env.production -- npx prisma studio
pause
