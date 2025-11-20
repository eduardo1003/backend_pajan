# Script para iniciar el backend
cd server
$env:DATABASE_URL="postgresql://neondb_owner:npg_l8MrDoUvN2wH@ep-ancient-sun-ah950gup-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
$env:JWT_SECRET="super_secret_jwt_key_min_32_chars_for_production_change_this"
$env:JWT_EXPIRES_IN="7d"
$env:PORT="3001"
$env:NODE_ENV="development"
$env:CORS_ORIGIN="http://localhost:8080"
npm run dev

