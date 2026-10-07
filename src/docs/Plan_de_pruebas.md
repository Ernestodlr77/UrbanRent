# Plan de pruebas funcionales — UrbanRent

| ID | Caso | Precondición | Acción | Resultado esperado |
|---|---|---|---|---|
| CP01 | Login válido | Usuario registrado | Introducir correo y contraseña correctos | JWT y redirección al Dashboard |
| CP02 | Login inválido | Usuario existente | Contraseña incorrecta | HTTP 401 y mensaje de credenciales inválidas |
| CP03 | Registro con contraseña corta | Formulario abierto | Enviar contraseña de 7 caracteres | HTTP 400; registro rechazado |
| CP04 | Registro válido | Correo no registrado | Enviar datos válidos | Usuario creado con contraseña hasheada |
| CP05 | Consultar perfil | JWT válido | GET /auth/me | Datos del usuario autenticado |
| CP06 | Actualizar perfil | JWT válido | PUT /auth/me | Nombre/teléfono actualizados |
| CP07 | CRUD de propiedades | Rol ADMIN/LANDLORD | Crear, listar, actualizar y eliminar | Cambios persistidos en MySQL |
| CP08 | CRUD de contratos | Propiedad disponible | Crear, actualizar y eliminar contrato | Estado de propiedad sincronizado |
| CP09 | CRUD de pagos | Contrato existente | Crear, actualizar y eliminar pago | Pago persistido y estado actualizado |
| CP10 | Seguridad de rol | Usuario TENANT | Intentar POST/PUT/DELETE administrativo | HTTP 403 |
| CP11 | Paginación | Propiedades cargadas | GET /properties?page=2&limit=12 | Respuesta con data y metadatos de paginación |
| CP12 | Filtros | Propiedades cargadas | Filtrar por estado/tipo/búsqueda | Solo resultados coincidentes |
| CP13 | Dashboard | JWT válido | GET /dashboard/stats | Indicadores calculados desde MySQL |
| CP14 | Ruta inexistente | API disponible | Solicitar ID inexistente | HTTP 404 |
| CP15 | Transacción de contrato | Propiedad AVAILABLE | Crear contrato | Contrato ACTIVE y propiedad RENTED en una transacción |

## Pruebas automatizadas
- Backend: `src/utils/validators.spec.ts` cubre contraseña, coordenadas, fechas y montos.
- Frontend: `login.component.spec.ts` y `dashboard.component.spec.ts` validan existencia de componentes; el proyecto incluye configuración Karma/Jasmine para ampliar los casos.
