# Diagrama lógico de UrbanRent

```text
ROLES
  │
  └── catálogo de roles

USERS ─────────────── PROPERTIES ───────────── CONTRACTS ───────────── PAYMENTS
  │                         │                       │                      │
  │                         ├── COUNTRIES          └── TENANT             │
  │                         ├── CURRENCIES                                │
  │                         └── PROPERTY_TYPES                             │
  │                                                                        │
  └────────────────────────────────────────────────────────────────────────┘
```

Relaciones principales:
- users 1:N properties mediante `landlordId`.
- users 1:N contracts mediante `tenantId`.
- properties 1:N contracts mediante `propertyId`.
- contracts 1:N payments mediante `contractId`.
- countries 1:N properties mediante `countryCode`.
- currencies 1:N properties mediante `currencyCode`.
- property_types 1:N properties mediante `propertyType`.
