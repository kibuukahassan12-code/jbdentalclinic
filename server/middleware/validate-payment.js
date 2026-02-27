const METHODS = ['Cash', 'Mobile Money', 'Bank'];

export function validatePaymentBody(req, res, next) {
  const body = req.body || {};
  const invoice_id = body.invoice_id != null ? Number(body.invoice_id) : null;
  const amount = body.amount != null ? Number(body.amount) : null;
  const errs = [];
  if (invoice_id == null || !Number.isInteger(invoice_id) || invoice_id < 1) {
    errs.push('invoice_id is required and must be a positive integer');
  }
  if (amount == null || isNaN(amount) || amount <= 0) {
    errs.push('amount is required and must be a positive number');
  }
  if (body.payment_method && !METHODS.includes(body.payment_method)) {
    errs.push(`payment_method must be one of: ${METHODS.join(', ')}`);
  }
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  req.validated = {
    invoice_id,
    amount,
    payment_method: body.payment_method && METHODS.includes(body.payment_method) ? body.payment_method : 'Cash',
    paid_at: body.paid_at ? String(body.paid_at).trim() : null,
  };
  next();
}
