export function validateDentalChartBody(req, res, next) {
  const body = req.body || {};
  const patient_id = body.patient_id != null ? Number(body.patient_id) : null;
  const tooth_number = body.tooth_number != null ? String(body.tooth_number).trim() : '';
  const errs = [];
  if (patient_id == null || !Number.isInteger(patient_id) || patient_id < 1) {
    errs.push('patient_id is required and must be a positive integer');
  }
  if (!tooth_number) errs.push('tooth_number is required');
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  req.validated = {
    patient_id,
    tooth_number,
    condition: body.condition ? String(body.condition).trim() : null,
    notes: body.notes ? String(body.notes).trim() : null,
  };
  next();
}
