# Base de datos

El archivo `schema.sql` crea la base de datos MySQL de UrbanRent y las tablas
que utiliza el backend.

## Inicialización

1. Configura las variables de conexión en `backend/.env`.
2. Ejecuta el esquema desde MySQL:

```bash
mysql -u root -p < database/schema.sql
```

El esquema no crea usuarios iniciales porque las contraseñas deben generarse
mediante el endpoint `/api/auth/register`.
