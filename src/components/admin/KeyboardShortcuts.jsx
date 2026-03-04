import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Command, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Ctrl + K', description: 'Open global search', scope: 'Global' },
  { key: 'Ctrl + 1', description: 'Go to Dashboard', scope: 'Navigation' },
  { key: 'Ctrl + 2', description: 'Go to Appointments', scope: 'Navigation' },
  { key: 'Ctrl + 3', description: 'Go to Patients', scope: 'Navigation' },
  { key: 'Ctrl + 4', description: 'Go to Staff', scope: 'Navigation' },
  { key: 'Ctrl + 5', description: 'Go to Treatments', scope: 'Navigation' },
  { key: 'Ctrl + 6', description: 'Go to Invoices', scope: 'Navigation' },
  { key: 'Ctrl + 7', description: 'Go to Reports', scope: 'Navigation' },
  { key: 'Ctrl + 8', description: 'Go to Settings', scope: 'Navigation' },
  { key: 'Esc', description: 'Close modal / Cancel', scope: 'Global' },
  { key: '?', description: 'Show keyboard shortcuts', scope: 'Global' },
  { key: '↑ / ↓', description: 'Navigate lists', scope: 'Lists' },
  { key: 'Enter', description: 'Select / Confirm', scope: 'Global' },
  { key: 'Ctrl + N', description: 'New item (context dependent)', scope: 'Context' },
];

const TABS_MAPPING = {
  '1': 'dashboard',
  '2': 'appointments',
  '3': 'patients',
  '4': 'staff',
  '5': 'treatments',
  '6': 'invoices',
  '7': 'reports',
  '8': 'settings',
};

export function useKeyboardShortcuts(onTabChange, tabs = []) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        // Still allow ? and Esc in inputs
        if (e.key !== '?' && e.key !== 'Escape') return;
      }

      // Show shortcuts help: ?
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Close help with Esc
      if (e.key === 'Escape') {
        setShowHelp(false);
        return;
      }

      // Ctrl/Cmd + Number for tabs
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const tabId = TABS_MAPPING[e.key];
        if (tabId && onTabChange) {
          onTabChange(tabId);
        }
        return;
      }

      // Ctrl/Cmd + N for new item
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        // Emit custom event that components can listen to
        window.dispatchEvent(new CustomEvent('keyboard:new'));
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange]);

  return { showHelp, setShowHelp };
}

export function KeyboardShortcutsHelp({ isOpen, onClose }) {
  const groupedShortcuts = SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.scope]) acc[shortcut.scope] = [];
    acc[shortcut.scope].push(shortcut);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Keyboard size={20} className="text-[#7FD856]" />
                <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(groupedShortcuts).map(([scope, shortcuts]) => (
                  <div key={scope}>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {scope}
                    </h4>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                        >
                          <span className="text-sm text-gray-300">{shortcut.description}</span>
                          <kbd className="flex items-center gap-0.5 px-2 py-1 bg-white/10 rounded text-xs font-mono text-white">
                            {renderKey(shortcut.key)}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <p className="text-sm text-gray-400 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">?</kbd> anytime to show this help
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function renderKey(key) {
  const parts = key.split(' + ');
  return parts.map((part, i) => {
    let icon = null;
    if (part === '↑') icon = <ArrowUp size={12} />;
    if (part === '↓') icon = <ArrowDown size={12} />;
    if (part === 'Enter' || part === 'Return') icon = <CornerDownLeft size={12} />;
    
    return (
      <span key={i} className="inline-flex items-center gap-0.5">
        {i > 0 && <span className="text-gray-500 mx-0.5">+</span>}
        {icon || (part === 'Ctrl' || part === 'Cmd' ? <Command size={12} /> : part)}
      </span>
    );
  });
}

export function KeyboardShortcutsButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
      title="Keyboard shortcuts (?)">
      <Keyboard size={16} />
      <span className="hidden sm:inline">Shortcuts</span>
      <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 bg-white/10 rounded text-xs">?</kbd>
    </button>
  );
}

export default { useKeyboardShortcuts, KeyboardShortcutsHelp, KeyboardShortcutsButton };
