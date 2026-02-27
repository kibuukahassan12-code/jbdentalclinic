const DATE_REG = /^\d{4}-\d{2}-\d{2}$/;

export function validatePatientReportBody(req, res, next) {
  const body = req.body || {};
  const patient_id = body.patient_id != null ? Number(body.patient_id) : null;
  const report_date = body.report_date ? String(body.report_date).trim() : null;
  const errs = [];
  if (patient_id == null || !Number.isInteger(patient_id) || patient_id < 1) {
    errs.push('patient_id is required and must be a positive integer');
  }
  if (!report_date || !DATE_REG.test(report_date)) {
    errs.push('report_date is required and must be YYYY-MM-DD');
  }
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  req.validated = {
    patient_id,
    doctor_id: body.doctor_id != null ? Number(body.doctor_id) : null,
    report_date,
    chief_complaint: body.chief_complaint ? String(body.chief_complaint).trim() : null,
    clinical_findings: body.clinical_findings ? String(body.clinical_findings).trim() : null,
    diagnosis: body.diagnosis ? String(body.diagnosis).trim() : null,
    treatment_plan: body.treatment_plan ? String(body.treatment_plan).trim() : null,
    notes: body.notes ? String(body.notes).trim() : null,
  };
  next();
}
