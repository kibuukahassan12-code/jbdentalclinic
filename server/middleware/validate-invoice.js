export function validateInvoiceBody(req, res, next) {
  const body = req.body || {};
  const patient_id = body.patient_id != null ? Number(body.patient_id) : null;
  const total_amount = body.total_amount != null ? Number(body.total_amount) : null;
  const errs = [];
  if (patient_id == null || !Number.isInteger(patient_id) || patient_id < 1) {
    errs.push('patient_id is required and must be a positive integer');
  }
  if (total_amount == null || isNaN(total_amount) || total_amount < 0) {
    errs.push('total_amount is required and must be a non-negative number');
  }
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  req.validated = {
    patient_id,
    total_amount,
    discount: body.discount != null ? Number(body.discount) : 0,
    tax: body.tax != null ? Number(body.tax) : 0,
    status: body.status && ['Pending', 'Partially Paid', 'Paid', 'Cancelled'].includes(body.status) ? body.status : 'Pending',
  };
  next();
}
