import { useApp } from '../../contexts/AppContext';
import { IconCheck, IconX, IconAlertTriangle, IconInfo } from '../Icons';

export default function ToastContainer() {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} type={toast.type} title={toast.title} message={toast.message} />
      ))}
    </div>
  );
}

function Toast({ type, title, message }: { type: string; title: string; message?: string }) {
  const config = {
    success: { bg: '#D1FAE5', border: '#10B981', text: '#065F46', Icon: IconCheck },
    error:   { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B', Icon: IconX },
    warning: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E', Icon: IconAlertTriangle },
    info:    { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF', Icon: IconInfo },
  }[type] ?? { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151', Icon: IconInfo };

  const { Icon } = config;

  return (
    <div
      className="toast-in pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3 shadow-lg"
      style={{ backgroundColor: config.bg, borderLeft: `4px solid ${config.border}` }}
    >
      <div className="flex-shrink-0 mt-0.5" style={{ color: config.border }}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: config.text }}>{title}</p>
        {message && <p className="text-xs mt-0.5" style={{ color: config.text, opacity: 0.8 }}>{message}</p>}
      </div>
    </div>
  );
}
