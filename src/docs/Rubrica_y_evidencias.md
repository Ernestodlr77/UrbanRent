# UrbanRent — Evidencias contra la rúbrica

## Arquitectura
- Frontend: Angular + TypeScript.
- Backend: Node.js + Express + TypeScript.
- BD: MySQL.
- Comunicación: API REST + JSON + JWT.

## Base de datos
- Más de 6 tablas: users, roles, properties, property_types, countries, currencies, contracts, payments.
- Claves primarias, foráneas e índices.

## CRUD
- Properties: GET/POST/PUT/DELETE.
- Contracts: GET/POST/PUT/PATCH/DELETE.
- Payments: GET/POST/PUT/DELETE.

## Seguridad
- bcrypt para contraseñas.
- JWT para autenticación.
- AuthGuard/RoleGuard en Angular.
- Middleware JWT/roles en backend.
- `.env` excluido del ZIP; usar `.env.example`.

## Funcionalidades adicionales
- Perfil consultable y actualizable.
- Búsqueda, filtros y paginación server-side de propiedades.
- Dashboard estadístico desde MySQL.
- Logs HTTP básicos.
- Mapa mundial de 193 países y propiedades georreferenciadas.
- Postman collection en `docs/UrbanRent.postman_collection.json`.

## Pruebas
- Backend: `src/utils/validators.spec.ts`.
- Frontend: `login.component.spec.ts` y `dashboard.component.spec.ts` como base de pruebas Angular.
- Casos funcionales recomendados: login, registro, validación de contraseña, perfil, CRUD propiedades, CRUD contratos, CRUD pagos, roles, paginación y 404.

## Pendiente de despliegue
La rúbrica exige URL pública, HTTPS y BD remota. Esta versión deja el proyecto preparado para despliegue, pero no inventa una URL que todavía no exista.
