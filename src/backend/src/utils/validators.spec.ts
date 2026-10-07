import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegistration, validateProperty, validateContract, validatePayment } from './validators.js';

test('registro rechaza contraseñas menores a 8 caracteres',()=>assert.equal(validateRegistration({fullName:'Ana',email:'ana@test.com',password:'1234567'}).valid,false));
test('propiedad valida coordenadas geográficas',()=>assert.equal(validateProperty({landlordId:1,title:'Casa',address:'A',city:'Guatemala',countryCode:'GTM',countryName:'Guatemala',monthlyRent:500,currencyCode:'GTQ',latitude:14.6,longitude:-90.5}).valid,true));
test('contrato rechaza fechas invertidas',()=>assert.equal(validateContract({propertyId:1,tenantId:2,startDate:'2026-12-01',endDate:'2026-01-01',monthlyAmount:500}).valid,false));
test('pago rechaza monto cero',()=>assert.equal(validatePayment({contractId:1,amount:0,dueDate:'2026-01-01'}).valid,false));
