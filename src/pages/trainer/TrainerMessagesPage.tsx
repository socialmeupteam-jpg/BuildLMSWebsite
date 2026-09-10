import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../contexts/AppContext';
import {
  IconMail, IconSearch, IconPlus, IconSend,
  IconUser, IconFileText, IconCheckCircle
} from '../../components/Icons';

interface TrainerThread {
  id: string;
  senderName: string;
  senderRole: 'Student' | 'Parent' | 'Admin';
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  messages: {
    id: string;
    sender: string;
    isTrainer: boolean;
    text: string;
    time: string;
  }[];
}

const INITIAL_TRAINER_THREADS: TrainerThread[] = [
  {
    id: 'th-t1',
    senderName: 'Rahul Sharma',
    senderRole: 'Student',
    subject: 'Google Ads Bidding Strategy Doubt',
    preview: 'Sir, for the Target CPA campaign, should we start with manual CPC first?',
    date: 'Dec 11, 2024',
    unread: true,
    messages: [
      {
        id: 'm-1',
        sender: 'Rahul Sharma',
        isTrainer: false,
        text: 'Hello sir, in yesterday’s live class regarding Target CPA bidding on Google Ads, should we initialize with Enhanced CPC until we accumulate 30 conversion actions, or start directly on tCPA?',
        time: 'Dec 11, 11:20 AM',
      },
      {
        id: 'm-2',
        sender: 'Ankit Verma (You)',
        isTrainer: true,
        text: 'Hi Rahul, excellent question! Always give the algorithm at least 25-30 conversion data points via Maximise Conversions or Enhanced CPC before enabling strict tCPA. Otherwise the learning phase may stall.',
        time: 'Dec 11, 01:15 PM',
      },
    ],
  },
  {
    id: 'th-t2',
    senderName: 'Sunita Sharma',
    senderRole: 'Parent',
    subject: "Rahul's Google Ads Campaign Progress",
    preview: 'Hi Sunita, Rahul has completed the search campaigns with impressive ROI...',
    date: 'Dec 10, 2024',
    unread: false,
    messages: [
      {
        id: 'm-3',
        sender: 'Sunita Sharma',
        isTrainer: false,
        text: 'Hello Ankit, I wanted to inquire how Rahul is performing with the live budget allocation exercises in Module 6.',
        time: 'Dec 10, 10:15 AM',
      },
      {
        id: 'm-4',
        sender: 'Ankit Verma (You)',
        isTrainer: true,
        text: 'Hi Sunita, Rahul has completed the search campaigns with impressive ROI scores. He demonstrates very mature analytical thinking. Keep encouraging him!',
        time: 'Dec 10, 04:30 PM',
      },
    ],
  },
  {
    id: 'th-t3',
    senderName: 'Rajesh Kumar',
    senderRole: 'Admin',
    subject: 'DMM-Feb-2024 Mid-Term Capstone Grading Deadline',
    preview: 'Please ensure all submitted projects for DMM are graded by Friday...',
    date: 'Dec 08, 2024',
    unread: false,
    messages: [
      {
        id: 'm-5',
        sender: 'Rajesh Kumar (Operations)',
        isTrainer: false,
        text: 'Hi Ankit, please ensure all 32 submitted capstone briefs are evaluated and feedback published by this Friday so we can generate the mid-term progress cards for parents.',
        time: 'Dec 08, 09:30 AM',
      },
    ],
  },
];

export default function TrainerMessagesPage() {
  const { addToast } = useApp();
  const [threads, setThreads] = useState<TrainerThread[]>(INITIAL_TRAINER_THREADS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_TRAINER_THREADS[0].id);
  const [roleFilter, setRoleFilter] = useState<'all' | 'Student' | 'Parent' | 'Admin'>('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');

  // Compose Modal state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [recipient, setRecipient] = useState('Rahul Sharma (Student)');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const selectedThread = threads.find(t => t.id === selectedId) || threads[0];

  const filteredThreads = threads.filter(t => {
    const matchRole = roleFilter === 'all' || t.senderRole === roleFilter;
    const matchSearch =
      t.senderName.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.preview.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'Ankit Verma (You)',
      isTrainer: true,
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
      message: `Reply sent to ${selectedThread.senderName}`,
      type: 'success',
    });
  };

  const handleCreateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    const role = recipient.includes('Parent')
      ? 'Parent'
      : recipient.includes('Admin')
      ? 'Admin'
      : 'Student';

    const newThread: TrainerThread = {
      id: `th-${Date.now()}`,
      senderName: recipient.split(' (')[0],
      senderRole: role as any,
      subject,
      preview: body,
      date: 'Just now',
      unread: false,
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'Ankit Verma (You)',
          isTrainer: true,
          text: body,
          time: 'Just now',
        },
      ],
    };

    setThreads(prev => [newThread, ...prev]);
    setSelectedId(newThread.id);
    setIsComposeOpen(false);
    setSubject('');
    setBody('');

    addToast({
      title: 'Message Delivered',
      message: `Message dispatched to ${newThread.senderName}.`,
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Trainer Communications Inbox"
          subtitle="Direct dialogue with students, parents, and administrative directors"
        />
        <Button
          variant="primary"
          icon={<IconPlus size={16} />}
          onClick={() => setIsComposeOpen(true)}
        >
          New Conversation
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs grid lg:grid-cols-12 min-h-[580px]">
        {/* Left List Pane (Col 4) */}
        <div className="lg:col-span-4 border-r border-[#E5E7EB] flex flex-col">
          {/* Filters and search */}
          <div className="p-4 border-b border-[#E5E7EB] space-y-2">
            <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl text-xs">
              {(['all', 'Student', 'Parent', 'Admin'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRoleFilter(tab)}
                  className={`flex-1 py-1 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                    roleFilter === tab
                      ? 'bg-white text-[#007991] shadow-xs'
                      : 'text-[#667085] hover:text-[#1F2933]'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          {/* Conversation items */}
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
                    {t.senderName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-[#1F2933] truncate">{t.senderName}</p>
                      <span className="text-[10px] text-[#9BA3AF] flex-shrink-0">{t.date}</span>
                    </div>
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                        t.senderRole === 'Student'
                          ? 'bg-blue-50 text-blue-700'
                          : t.senderRole === 'Parent'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {t.senderRole}
                    </span>
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
              <div className="p-4 bg-white border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1F2933]">{selectedThread.subject}</h3>
                  <p className="text-xs text-[#667085]">
                    With <strong className="text-[#007991]">{selectedThread.senderName}</strong> ({selectedThread.senderRole})
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E6F4F6] text-[#007991]">
                  Active Thread
                </span>
              </div>

              {/* Chat history */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {selectedThread.messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isTrainer ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                        m.isTrainer
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

              {/* Input reply form */}
              <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-[#E5E7EB] flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to student or parent..."
                  className="flex-1 bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-4 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                />
                <Button variant="cta" size="sm" type="submit" icon={<IconSend size={14} />}>
                  Reply
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#9BA3AF]">
              Select a conversation thread to read.
            </div>
          )}
        </div>
      </div>

      {/* Compose Message Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose New Message"
        size="md"
      >
        <form onSubmit={handleCreateMessage} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Send To *</label>
            <select
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            >
              <option value="Rahul Sharma (Student)">Rahul Sharma (Student — DMM-Feb-2024)</option>
              <option value="Priya Patel (Student)">Priya Patel (Student — DMM-Feb-2024)</option>
              <option value="Sunita Sharma (Parent)">Sunita Sharma (Parent of Rahul Sharma)</option>
              <option value="Rajesh Kumar (Admin)">Rajesh Kumar (Academy Director)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Subject *</label>
            <input
              type="text"
              placeholder="e.g., Guidance on Capstone Project Proposal"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Message *</label>
            <textarea
              rows={4}
              placeholder="Type your communication..."
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit" disabled={!subject.trim() || !body.trim()}>
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
