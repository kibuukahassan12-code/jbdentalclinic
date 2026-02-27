export function validatePatientBody(req, res, next) {
  const body = req.body || {};
  const full_name = body.full_name?.trim();
  const phone = (body.phone && String(body.phone).trim()) || '';
  const errs = [];
  if (!full_name) errs.push('full_name is required');
  if (!phone) errs.push('phone is required');
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  req.validated = {
    full_name,
    phone,
    email: body.email ? String(body.email).trim() : null,
    date_of_birth: body.date_of_birth ? String(body.date_of_birth).trim() : null,
    gender: body.gender ? String(body.gender).trim() : null,
    medical_history: body.medical_history ? String(body.medical_history).trim() : null,
    allergies: body.allergies ? String(body.allergies).trim() : null,
  };
  next();
}
