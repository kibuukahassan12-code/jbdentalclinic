import React from 'react';
import { Button } from '@/components/ui/button';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  const confirmClassName =
    confirmVariant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-[#7FD856] text-black hover:bg-[#6FC745]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-gray-400">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-gray-300 hover:bg-white/5"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button type="button" className={confirmClassName} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
