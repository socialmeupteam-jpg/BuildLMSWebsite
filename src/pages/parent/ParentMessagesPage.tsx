import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../contexts/AppContext';
import {
  IconMail, IconSearch, IconPlus, IconFileText,
  IconSend, IconCheckCircle, IconUser
} from '../../components/Icons';

interface ParentThread {
  id: string;
  recipientName: string;
  recipientRole: 'Lead Trainer' | 'Academic Counselor' | 'Finance Office';
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  messages: {
    id: string;
    sender: string;
    isParent: boolean;
    text: string;
    time: string;
  }[];
}

const INITIAL_THREADS: ParentThread[] = [
  {
    id: 'th-1',
    recipientName: 'Ankit Verma',
    recipientRole: 'Lead Trainer',
    subject: "Rahul's Google Ads Campaign Progress",
    preview: 'Hi Sunita, Rahul has completed the search campaigns with impressive ROI scores...',
    date: 'Dec 11, 2024',
    unread: true,
    messages: [
      {
        id: 'm-1',
        sender: 'Sunita Sharma',
        isParent: true,
        text: "Hello Ankit, I wanted to inquire how Rahul is performing with the live budget allocation exercises in Module 6.",
        time: 'Dec 10, 10:15 AM',
      },
      {
        id: 'm-2',
        sender: 'Ankit Verma',
        isParent: false,
        text: "Hi Sunita, Rahul has completed the search campaigns with impressive ROI scores. He demonstrates very mature analytical thinking and has helped peers troubleshoot their tracking pixels. Keep encouraging him!",
        time: 'Dec 11, 04:30 PM',
      },
    ],
  },
  {
    id: 'th-2',
    recipientName: 'Rajesh Kumar',
    recipientRole: 'Academic Counselor',
    subject: 'Internship placement assistance timeline',
    preview: 'We will be conducting the campus placement drive starting February 15...',
    date: 'Nov 28, 2024',
    unread: false,
    messages: [
      {
        id: 'm-3',
        sender: 'Sunita Sharma',
        isParent: true,
        text: "Could you share the timeline when agency interview drives will begin for the DMM cohort?",
        time: 'Nov 27, 11:00 AM',
      },
      {
        id: 'm-4',
        sender: 'Rajesh Kumar',
        isParent: false,
        text: "We will be conducting the campus placement drive starting February 15. All eligible students with >75% attendance and passing marks will be scheduled for interviews.",
        time: 'Nov 28, 02:20 PM',
      },
    ],
  },
  {
    id: 'th-3',
    recipientName: 'Finance Desk',
    recipientRole: 'Finance Office',
    subject: 'December Tuition Fee Confirmation',
    preview: 'Thank you for your inquiry. Receipt has been posted to your portal...',
    date: 'Nov 02, 2024',
    unread: false,
    messages: [
      {
        id: 'm-5',
        sender: 'Finance Desk',
        isParent: false,
        text: "The payment for installment 2 was successfully cleared. You can view and download the official GST invoice directly under Fees & Payments.",
        time: 'Nov 02, 09:45 AM',
      },
    ],
  },
];

export default function ParentMessagesPage() {
  const { addToast } = useApp();
  const [threads, setThreads] = useState<ParentThread[]>(INITIAL_THREADS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_THREADS[0].id);
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');

  // New Conversation Modal state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('Ankit Verma (Lead Trainer)');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const selectedThread = threads.find(t => t.id === selectedId) || threads[0];

  const filteredThreads = threads.filter(
    t =>
      t.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'Sunita Sharma (You)',
      isParent: true,
      text: replyText.trim(),
      time: 'Just now',
    };

    setThreads(prev =>
      prev.map(t =>
        t.id === selectedThread.id
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              preview: replyText.trim(),
              date: 'Just now',
              unread: false,
            }
          : t
      )
    );

    setReplyText('');
    addToast({
      title: 'Message Sent',
      message: `Delivered to ${selectedThread.recipientName}`,
      type: 'success',
    });
  };

  const handleCreateConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;

    const roleMap: Record<string, ParentThread['recipientRole']> = {
      'Ankit Verma (Lead Trainer)': 'Lead Trainer',
      'Rajesh Kumar (Academic Director)': 'Academic Counselor',
      'Accounts Department': 'Finance Office',
    };

    const newThread: ParentThread = {
      id: `th-${Date.now()}`,
      recipientName: composeTo.split(' (')[0],
      recipientRole: roleMap[composeTo] || 'Lead Trainer',
      subject: composeSubject,
      preview: composeBody,
      date: 'Just now',
      unread: false,
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'Sunita Sharma',
          isParent: true,
          text: composeBody,
          time: 'Just now',
        },
      ],
    };

    setThreads(prev => [newThread, ...prev]);
    setSelectedId(newThread.id);
    setIsComposeOpen(false);
    setComposeSubject('');
    setComposeBody('');

    addToast({
      title: 'Conversation Initiated',
      message: `Message sent to ${newThread.recipientName}.`,
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Trainer & Staff Communication"
          subtitle="Direct messaging channel with trainers, mentors, and academy staff"
        />
        <Button
          variant="primary"
          icon={<IconPlus size={16} />}
          onClick={() => setIsComposeOpen(true)}
        >
          New Message
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs grid lg:grid-cols-12 min-h-[580px]">
        {/* Left List (Col 4) */}
        <div className="lg:col-span-4 border-r border-[#E5E7EB] flex flex-col">
          {/* Search box */}
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="relative">
              <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
              <input
                type="text"
                placeholder="Search staff, trainers or subjects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F2F4F6]">
            {filteredThreads.map(t => {
              const isSelected = t.id === selectedId;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedId(t.id);
                    setThreads(prev =>
                      prev.map(item => (item.id === t.id ? { ...item, unread: false } : item))
                    );
                  }}
                  className={`w-full p-4 text-left transition-colors flex gap-3 cursor-pointer ${
                    isSelected ? 'bg-[#e0f6ff]' : 'hover:bg-[#F7F9FA]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {t.recipientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-[#1F2933] truncate">
                        {t.recipientName}
                      </p>
                      <span className="text-[10px] text-[#9BA3AF] flex-shrink-0">{t.date}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#007991] mb-1">{t.recipientRole}</p>
                    <p className="text-xs font-medium text-[#374151] truncate">{t.subject}</p>
                    <p className="text-[11px] text-[#667085] truncate mt-0.5">{t.preview}</p>
                  </div>
                  {t.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#FF9635] flex-shrink-0 mt-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane (Col 8) */}
        <div className="lg:col-span-8 flex flex-col bg-[#F7F9FA]">
          {selectedThread ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1F2933]">{selectedThread.subject}</h3>
                  <p className="text-xs text-[#667085]">
                    With <strong className="text-[#007991]">{selectedThread.recipientName}</strong> ({selectedThread.recipientRole})
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E6F4F6] text-[#007991]">
                  Official Academy Communication
                </span>
              </div>

              {/* Message History */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {selectedThread.messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isParent ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                        m.isParent
                          ? 'bg-[#007991] text-white rounded-br-none shadow-xs'
                          : 'bg-white border border-[#E5E7EB] text-[#1F2933] rounded-bl-none shadow-xs'
                      }`}
                    >
                      <p className="font-bold text-[10px] opacity-80 mb-1">{m.sender}</p>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                    <span className="text-[10px] text-[#9BA3AF] mt-1 px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Message Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-[#E5E7EB] flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your message to trainer..."
                  className="flex-1 bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                />
                <Button variant="cta" size="sm" type="submit" icon={<IconSend size={14} />}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#9BA3AF]">
              Select a conversation thread on the left to read and reply.
            </div>
          )}
        </div>
      </div>

      {/* Compose Message Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose Message to Academy"
        size="md"
      >
        <form onSubmit={handleCreateConversation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Recipient *</label>
            <select
              value={composeTo}
              onChange={e => setComposeTo(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            >
              <option value="Ankit Verma (Lead Trainer)">Ankit Verma (Lead Trainer — Digital Marketing)</option>
              <option value="Rajesh Kumar (Academic Director)">Rajesh Kumar (Academic Director)</option>
              <option value="Accounts Department">Accounts & Fee Desk</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Subject *</label>
            <input
              type="text"
              placeholder="e.g. Question regarding career guidance session"
              value={composeSubject}
              onChange={e => setComposeSubject(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Message Body *</label>
            <textarea
              rows={4}
              placeholder="Write your note or question here..."
              value={composeBody}
              onChange={e => setComposeBody(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit" disabled={!composeSubject.trim() || !composeBody.trim()}>
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
