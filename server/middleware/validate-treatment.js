export function validateTreatmentBody(req, res, next) {
  const body = req.body || {};
  const patient_id = body.patient_id != null ? Number(body.patient_id) : null;
  const service_name = body.service_name?.trim();
  const errs = [];
  if (patient_id == null || !Number.isInteger(patient_id) || patient_id < 1) {
    errs.push('patient_id is required and must be a positive integer');
  }
  if (!service_name) errs.push('service_name is required');
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  req.validated = {
    patient_id,
    dentist_id: body.dentist_id != null ? Number(body.dentist_id) : null,
    treatment_plan_id: body.treatment_plan_id != null ? Number(body.treatment_plan_id) : null,
    service_name,
    description: body.description ? String(body.description).trim() : null,
    cost: body.cost != null ? Number(body.cost) : null,
    treatment_date: body.treatment_date ? String(body.treatment_date).trim() : null,
    status: body.status && ['Pending', 'In Progress', 'Completed', 'Cancelled'].includes(body.status) ? body.status : 'Pending',
  };
  next();
}
