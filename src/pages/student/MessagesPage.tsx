import { useState } from 'react';
import DashboardLayout, { PageHeader } from '../../components/layout/DashboardLayout';
import { MESSAGES } from '../../data/mockData';
import Button from '../../components/ui/Button';
import { IconMail, IconPlus } from '../../components/Icons';
import type { Message } from '../../types';
import { useApp } from '../../contexts/AppContext';

export default function MessagesPage() {
  const { addToast } = useApp();
  const [selected, setSelected] = useState<Message | null>(MESSAGES[0]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Messages"
        action={<Button variant="cta" size="sm" icon={<IconPlus size={14} />} onClick={() => addToast({ type: 'info', title: 'Compose', message: 'Message composer opening…' })}>Compose</Button>}
      />

      <div className="flex gap-0 bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden h-[600px]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {/* Message list */}
        <div className="w-72 border-r border-[#E5E7EB] flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-[#F2F4F6]">
            <p className="text-sm font-bold text-[#1F2933]">Inbox</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#F2F4F6]">
            {MESSAGES.map(msg => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg)}
                className={`w-full text-left p-4 hover:bg-[#F9FAFB] transition-colors ${selected?.id === msg.id ? 'bg-[#f0fbff]' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#007991] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {msg.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${!msg.read ? 'font-bold text-[#1F2933]' : 'font-medium text-[#374151]'}`}>{msg.from}</p>
                      <p className="text-[10px] text-[#9BA3AF] flex-shrink-0 ml-1">{new Date(msg.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${!msg.read ? 'text-[#1F2933]' : 'text-[#667085]'}`}>{msg.subject}</p>
                    <p className="text-[10px] text-[#9BA3AF] truncate mt-0.5">{msg.preview.slice(0, 50)}…</p>
                  </div>
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-[#FF9635] flex-shrink-0 mt-1" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message view */}
        {selected ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F2F4F6]">
              <h3 className="text-base font-bold text-[#1F2933]">{selected.subject}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 rounded-full bg-[#007991] flex items-center justify-center text-white text-[10px] font-bold">
                  {selected.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <p className="text-xs text-[#667085]">From: <strong>{selected.from}</strong> · {new Date(selected.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-sm text-[#374151] leading-relaxed">{selected.preview}</p>
              <p className="text-sm text-[#374151] leading-relaxed mt-4">
                Please feel free to reply if you have any questions or need further clarification on any of the points mentioned above.
              </p>
              <p className="text-sm text-[#374151] mt-4">
                Best regards,<br />
                <strong>{selected.from}</strong><br />
                SocialMeUp Academy
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#F2F4F6]">
              <div className="flex items-center gap-3">
                <textarea
                  placeholder="Write your reply…"
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2933] placeholder-[#9BA3AF] resize-none focus:outline-none focus:border-[#007991] bg-[#F9FAFB]"
                />
                <Button variant="primary" size="sm" onClick={() => addToast({ type: 'success', title: 'Reply sent', message: 'Your message was sent successfully.' })}>Send</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <IconMail size={40} className="text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-sm text-[#9BA3AF]">Select a message to read</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
