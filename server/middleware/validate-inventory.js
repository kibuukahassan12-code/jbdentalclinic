export function validateInventoryItemBody(req, res, next) {
  const body = req.body || {};
  const name = body.name != null ? String(body.name).trim() : '';
  const errs = [];
  if (!name) errs.push('name is required');
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  req.validated = {
    name,
    quantity: body.quantity != null ? Math.max(0, Number(body.quantity) || 0) : 0,
    minimum_stock: body.minimum_stock != null ? Math.max(0, Number(body.minimum_stock) || 0) : 0,
    supplier: body.supplier ? String(body.supplier).trim() : null,
  };
  next();
}
