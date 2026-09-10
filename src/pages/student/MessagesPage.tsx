import { useState } from 'react';
import DashboardLayout, { PageHeader } from '../../components/layout/DashboardLayout';
import { MESSAGES } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import {
  IconMail,
  IconPlus,
  IconPaperclip,
  IconChevronLeft,
  IconSearch,
  IconCheckCircle,
} from '../../components/Icons';
import type { Message } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface ChatItem {
  id: string;
  sender: 'them' | 'me';
  senderName: string;
  text: string;
  timestamp: string;
  attachmentName?: string;
}

export default function MessagesPage() {
  const { addToast } = useApp();
  const [messagesList, setMessagesList] = useState<Message[]>(MESSAGES);
  const [selectedId, setSelectedId] = useState<string>(MESSAGES[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile navigation state
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Active Thread Messages
  const [threadReplies, setThreadReplies] = useState<Record<string, ChatItem[]>>({
    'msg-001': [
      {
        id: 'c1',
        sender: 'them',
        senderName: 'Ankit Verma (Trainer)',
        text: 'Welcome to Advanced Digital Marketing! In our upcoming live session on Saturday, we will cover Google Ads campaign architecture and conversion tracking. Please make sure to review the Module 1 study notes.',
        timestamp: 'Dec 12, 10:30 AM',
      },
    ],
    'msg-002': [
      {
        id: 'c2',
        sender: 'them',
        senderName: 'Admin Office',
        text: 'Your enrollment for Full Stack Web Development batch WD-2024-B has been confirmed. Your orientation session is scheduled for Monday at 11:00 AM.',
        timestamp: 'Dec 10, 02:15 PM',
      },
    ],
  });

  const [replyText, setReplyText] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState('Ankit Verma (Trainer)');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const selected = messagesList.find(m => m.id === selectedId) || messagesList[0];

  const filteredMessages = messagesList.filter(m =>
    m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeThread = selectedId && threadReplies[selectedId]
    ? threadReplies[selectedId]
    : selected
    ? [
        {
          id: 'initial',
          sender: 'them' as const,
          senderName: selected.from,
          text: selected.preview,
          timestamp: new Date(selected.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        },
      ]
    : [];

  const handleSelectMessage = (msg: Message) => {
    setSelectedId(msg.id);
    setShowMobileChat(true);
    // Mark as read
    if (!msg.read) {
      setMessagesList(prev =>
        prev.map(m => (m.id === msg.id ? { ...m, read: true } : m))
      );
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !attachedFile) return;

    const newReply: ChatItem = {
      id: `rep-${Date.now()}`,
      sender: 'me',
      senderName: 'You (Aarav Sharma)',
      text: replyText.trim(),
      timestamp: 'Just now',
      attachmentName: attachedFile || undefined,
    };

    setThreadReplies(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || activeThread), newReply],
    }));

    setReplyText('');
    setAttachedFile(null);

    addToast({
      title: 'Message Sent',
      message: `Your reply was delivered to ${selected.from}.`,
      type: 'success',
    });
  };

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;

    const newId = `msg-${Date.now()}`;
    const newMsg: Message = {
      id: newId,
      from: composeRecipient,
      fromRole: 'trainer' as const,
      subject: composeSubject,
      preview: composeBody,
      date: new Date().toISOString(),
      read: true,
    };

    setMessagesList(prev => [newMsg, ...prev]);
    setThreadReplies(prev => ({
      ...prev,
      [newId]: [
        {
          id: `initial-${newId}`,
          sender: 'me',
          senderName: 'You (Aarav Sharma)',
          text: composeBody,
          timestamp: 'Just now',
        },
      ],
    }));

    setSelectedId(newId);
    setShowMobileChat(true);
    setIsComposeOpen(false);
    setComposeSubject('');
    setComposeBody('');

    addToast({
      title: 'Message Dispatched',
      message: `Your message to ${composeRecipient} was initiated.`,
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Messages"
        subtitle="Communicate directly with your trainers and administration"
        action={
          <Button
            variant="cta"
            size="sm"
            icon={<IconPlus size={14} />}
            onClick={() => setIsComposeOpen(true)}
          >
            Compose
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden h-[620px]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {/* Message List Sidebar */}
        <div className={`w-full md:w-80 border-r border-[#E5E7EB] flex flex-col shrink-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 border-b border-[#F2F4F6] space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#1F2933]">Inbox</p>
              <span className="text-xs text-[#667085] font-semibold">
                {messagesList.filter(m => !m.read).length} unread
              </span>
            </div>
            <div className="relative">
              <IconSearch size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#F2F4F6]">
            {filteredMessages.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No conversations found.
              </div>
            ) : (
              filteredMessages.map(msg => (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => handleSelectMessage(msg)}
                  className={`w-full text-left p-4 hover:bg-[#F9FAFB] transition-colors cursor-pointer ${
                    selected?.id === msg.id ? 'bg-[#f0fbff]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#007991] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {msg.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${!msg.read ? 'font-bold text-[#1F2933]' : 'font-medium text-[#374151]'}`}>
                          {msg.from}
                        </p>
                        <p className="text-[10px] text-[#9BA3AF] shrink-0 ml-1">
                          {new Date(msg.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${!msg.read ? 'text-[#1F2933] font-semibold' : 'text-[#667085]'}`}>
                        {msg.subject}
                      </p>
                      <p className="text-[10px] text-[#9BA3AF] truncate mt-0.5">
                        {msg.preview}
                      </p>
                    </div>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-[#FF9635] shrink-0 mt-1" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Thread View */}
        {selected ? (
          <div className={`flex-1 flex flex-col overflow-hidden ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="px-6 py-3.5 border-b border-[#F2F4F6] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label="Back to inbox"
                >
                  <IconChevronLeft size={18} />
                </button>
                <div className="w-9 h-9 rounded-full bg-[#007991] flex items-center justify-center text-white text-xs font-bold">
                  {selected.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F2933] leading-tight">{selected.subject}</h3>
                  <p className="text-xs text-[#667085]">{selected.from}</p>
                </div>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/40">
              {activeThread.map(item => (
                <div
                  key={item.id}
                  className={`flex flex-col ${item.sender === 'me' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-700">{item.senderName}</span>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      item.sender === 'me'
                        ? 'bg-[#007991] text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p>{item.text}</p>
                    {item.attachmentName && (
                      <div className={`mt-2 flex items-center gap-2 p-2 rounded-lg text-[11px] font-semibold ${item.sender === 'me' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <IconPaperclip size={12} />
                        <span>{item.attachmentName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="px-6 py-3 border-t border-[#F2F4F6] bg-white">
              {attachedFile && (
                <div className="mb-2 flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs text-slate-700 w-fit">
                  <IconPaperclip size={13} />
                  <span>{attachedFile}</span>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="text-slate-400 hover:text-slate-700 ml-1 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="msg-attachment-input"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachedFile(e.target.files[0].name);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('msg-attachment-input')?.click()}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Attach file"
                  aria-label="Attach file"
                >
                  <IconPaperclip size={18} />
                </button>
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007991]"
                />
                <Button variant="cta" size="sm" type="submit">
                  Send
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center">
            <div className="text-center">
              <IconMail size={40} className="text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-sm text-[#9BA3AF]">Select a conversation to begin reading</p>
            </div>
          </div>
        )}
      </div>

      {/* Compose Message Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose Message"
        description="Send a direct inquiry or question to course faculty or staff"
        size="md"
      >
        <form onSubmit={handleSendCompose} className="space-y-4">
          <div>
            <label htmlFor="compose-recipient" className="block text-xs font-semibold text-slate-700 mb-1">
              Recipient
            </label>
            <select
              id="compose-recipient"
              value={composeRecipient}
              onChange={e => setComposeRecipient(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            >
              <option>Ankit Verma (Trainer - Digital Marketing)</option>
              <option>Priya Sharma (Trainer - Python)</option>
              <option>Administration & Support Desk</option>
              <option>Finance & Billing Dept</option>
            </select>
          </div>

          <div>
            <label htmlFor="compose-subject" className="block text-xs font-semibold text-slate-700 mb-1">
              Subject
            </label>
            <input
              id="compose-subject"
              type="text"
              required
              value={composeSubject}
              onChange={e => setComposeSubject(e.target.value)}
              placeholder="e.g. Question regarding Module 2 live assignment"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label htmlFor="compose-body" className="block text-xs font-semibold text-slate-700 mb-1">
              Message Content
            </label>
            <textarea
              id="compose-body"
              required
              rows={4}
              value={composeBody}
              onChange={e => setComposeBody(e.target.value)}
              placeholder="Provide complete details about your query..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsComposeOpen(false)}
            >
              Discard
            </Button>
            <Button type="submit" variant="cta">
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
