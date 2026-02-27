export function validateTreatmentPlanBody(req, res, next) {
  const body = req.body || {};
  const patient_id = body.patient_id != null ? Number(body.patient_id) : null;
  const errs = [];
  if (patient_id == null || !Number.isInteger(patient_id) || patient_id < 1) {
    errs.push('patient_id is required and must be a positive integer');
  }
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  req.validated = {
    patient_id,
    total_estimated_cost: body.total_estimated_cost != null ? Number(body.total_estimated_cost) : null,
    status: body.status && ['Active', 'Completed', 'Cancelled'].includes(body.status) ? body.status : 'Active',
  };
  next();
}
