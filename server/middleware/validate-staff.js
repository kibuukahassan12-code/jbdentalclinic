const ROLES = ['Dentist', 'Nurse', 'Receptionist', 'Admin'];

export function validateStaffBody(req, res, next) {
  const body = req.body || {};
  const full_name = body.full_name?.trim();
  const role = body.role?.trim();
  const errs = [];
  if (!full_name) errs.push('full_name is required');
  if (!role) errs.push('role is required');
  if (role && !ROLES.includes(role)) {
    errs.push(`role must be one of: ${ROLES.join(', ')}`);
  }
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  req.validated = {
    full_name,
    role,
    phone: body.phone ? String(body.phone).trim() : null,
    email: body.email ? String(body.email).trim() : null,
    salary: body.salary != null ? Number(body.salary) : null,
    is_active: body.is_active,
  };
  next();
}
