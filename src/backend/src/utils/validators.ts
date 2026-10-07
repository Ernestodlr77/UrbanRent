export type ValidationResult = { valid: true } | { valid: false; message: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedPropertyTypes = ['APARTMENT', 'HOUSE', 'WAREHOUSE', 'COMMERCIAL'];
const allowedPropertyStatuses = ['AVAILABLE', 'RENTED', 'MAINTENANCE'];
const allowedContractStatuses = ['ACTIVE', 'COMPLETED', 'CANCELLED'];
const allowedPaymentStatuses = ['PENDING', 'PAID', 'LATE'];

export function validateRegistration(body: any): ValidationResult {
  if (!body || typeof body.fullName !== 'string' || !body.fullName.trim()) return { valid:false, message:'El nombre completo es obligatorio.' };
  if (typeof body.email !== 'string' || !emailRegex.test(body.email.trim())) return { valid:false, message:'El correo electrónico no es válido.' };
  if (typeof body.password !== 'string' || body.password.length < 8) return { valid:false, message:'La contraseña debe tener al menos 8 caracteres.' };
  if (body.phone !== undefined && body.phone !== null && typeof body.phone !== 'string') return { valid:false, message:'El teléfono debe ser texto.' };
  if (body.role !== undefined && !['LANDLORD','TENANT'].includes(body.role)) return { valid:false, message:'El rol de registro no es válido.' };
  return { valid:true };
}

export function validateProperty(body: any, partial = false): ValidationResult {
  if (!partial) {
    for (const key of ['landlordId','title','address','city','countryCode','countryName','monthlyRent','currencyCode','latitude','longitude']) {
      if (body?.[key] === undefined || body?.[key] === null || body?.[key] === '') return { valid:false, message:`El campo ${key} es obligatorio.` };
    }
  }
  if (body?.monthlyRent !== undefined && (!Number.isFinite(Number(body.monthlyRent)) || Number(body.monthlyRent) < 0)) return { valid:false, message:'La renta debe ser un número positivo.' };
  if (body?.latitude !== undefined && (!Number.isFinite(Number(body.latitude)) || Number(body.latitude) < -90 || Number(body.latitude) > 90)) return { valid:false, message:'La latitud debe estar entre -90 y 90.' };
  if (body?.longitude !== undefined && (!Number.isFinite(Number(body.longitude)) || Number(body.longitude) < -180 || Number(body.longitude) > 180)) return { valid:false, message:'La longitud debe estar entre -180 y 180.' };
  if (body?.propertyType !== undefined && !allowedPropertyTypes.includes(body.propertyType)) return { valid:false, message:'Tipo de propiedad inválido.' };
  if (body?.status !== undefined && !allowedPropertyStatuses.includes(body.status)) return { valid:false, message:'Estado de propiedad inválido.' };
  return { valid:true };
}

export function validateContract(body: any, partial = false): ValidationResult {
  if (!partial) {
    for (const key of ['propertyId','tenantId','startDate','endDate','monthlyAmount']) {
      if (body?.[key] === undefined || body?.[key] === null || body?.[key] === '') return { valid:false, message:`El campo ${key} es obligatorio.` };
    }
  }
  if (body?.monthlyAmount !== undefined && Number(body.monthlyAmount) < 0) return { valid:false, message:'El monto mensual no puede ser negativo.' };
  if (body?.depositAmount !== undefined && Number(body.depositAmount) < 0) return { valid:false, message:'El depósito no puede ser negativo.' };
  if (body?.startDate && body?.endDate && new Date(body.startDate) >= new Date(body.endDate)) return { valid:false, message:'La fecha de inicio debe ser anterior a la fecha de finalización.' };
  if (body?.status !== undefined && !allowedContractStatuses.includes(body.status)) return { valid:false, message:'Estado de contrato inválido.' };
  return { valid:true };
}

export function validatePayment(body: any, partial = false): ValidationResult {
  if (!partial) {
    for (const key of ['contractId','amount','dueDate']) {
      if (body?.[key] === undefined || body?.[key] === null || body?.[key] === '') return { valid:false, message:`El campo ${key} es obligatorio.` };
    }
  }
  if (body?.amount !== undefined && (!Number.isFinite(Number(body.amount)) || Number(body.amount) <= 0)) return { valid:false, message:'El monto del pago debe ser mayor que cero.' };
  if (body?.status !== undefined && !allowedPaymentStatuses.includes(body.status)) return { valid:false, message:'Estado de pago inválido.' };
  return { valid:true };
}
