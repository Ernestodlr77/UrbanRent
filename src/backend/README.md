# UrbanRent Backend

## Requisitos
- Node.js 20+
- MySQL 8+
- Base de datos creada con `database/schema.sql`

## Configuración
1. Copia `.env.example` a `.env`.
2. Ajusta `DB_USER`, `DB_PASSWORD` y `DB_NAME` según tu MySQL.
3. Ejecuta `database/schema.sql` completo.
4. Instala dependencias con `npm install`.
5. Desarrollo: `npm run dev`.
6. Producción: `npm run build && npm start`.

## API
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET/POST/PUT/DELETE /api/properties`
- `GET/POST/PATCH /api/contracts`
- `GET/POST /api/payments`
- `GET /api/payments/summary`

Las contraseñas requieren mínimo 8 caracteres y se almacenan con bcrypt.
