import { useState, useMemo, useEffect } from 'react';
import Icon from '@/components/ui/icon';

type Section = 'chats' | 'groups' | 'calls' | 'contacts' | 'notifications' | 'settings';

interface Message {
  id: number;
  text: string;
  time: string;
  fromMe: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

interface Group {
  id: number;
  name: string;
  emoji: string;
  lastMessage: string;
  time: string;
  members: number;
  unread: number;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  phone: string;
  online: boolean;
  status: string;
}

interface CallRecord {
  id: number;
  name: string;
  avatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  time: string;
}

interface Notification {
  id: number;
  text: string;
  from: string;
  time: string;
  read: boolean;
  type: 'message' | 'group' | 'call';
}

const CHATS: Chat[] = [
  { id: 1, name: 'Алексей Петров', avatar: 'АП', lastMessage: 'Увидимся завтра на встрече!', time: '22:14', unread: 3, online: true, messages: [
    { id: 1, text: 'Привет! Как дела?', time: '21:50', fromMe: false },
    { id: 2, text: 'Всё отлично, спасибо! Работаю над проектом', time: '21:52', fromMe: true },
    { id: 3, text: 'Отлично! Кстати, завтра встреча в 10:00', time: '22:10', fromMe: false },
    { id: 4, text: 'Увидимся завтра на встрече!', time: '22:14', fromMe: false },
  ]},
  { id: 2, name: 'Мария Соколова', avatar: 'МС', lastMessage: 'Отправила файлы на почту', time: '21:03', unread: 1, online: true, messages: [
    { id: 1, text: 'Добрый день! Можете проверить документы?', time: '20:55', fromMe: false },
    { id: 2, text: 'Да, конечно. Пришлите ссылку', time: '21:00', fromMe: true },
    { id: 3, text: 'Отправила файлы на почту', time: '21:03', fromMe: false },
  ]},
  { id: 3, name: 'Дмитрий Волков', avatar: 'ДВ', lastMessage: 'Ок, понял тебя 👍', time: '19:45', unread: 0, online: false, messages: [
    { id: 1, text: 'Привет, помнишь про дедлайн?', time: '19:40', fromMe: true },
    { id: 2, text: 'Ок, понял тебя 👍', time: '19:45', fromMe: false },
  ]},
  { id: 4, name: 'Анна Новикова', avatar: 'АН', lastMessage: 'Спасибо большое!', time: 'Вчера', unread: 0, online: false, messages: [
    { id: 1, text: 'Привет! Ты не поможешь с презентацией?', time: '18:00', fromMe: false },
    { id: 2, text: 'Конечно, что нужно сделать?', time: '18:05', fromMe: true },
    { id: 3, text: 'Спасибо большое!', time: '18:30', fromMe: false },
  ]},
  { id: 5, name: 'Игорь Морозов', avatar: 'ИМ', lastMessage: 'Буду через 20 минут', time: 'Вчера', unread: 0, online: true, messages: [
    { id: 1, text: 'Ты где? Все уже ждут', time: '17:10', fromMe: true },
    { id: 2, text: 'Буду через 20 минут', time: '17:12', fromMe: false },
  ]},
];

const GROUPS: Group[] = [
  { id: 1, name: 'Команда разработки', emoji: '💻', lastMessage: 'Сергей: Деплой прошёл успешно!', time: '22:30', members: 12, unread: 5 },
  { id: 2, name: 'Маркетинг 2025', emoji: '📊', lastMessage: 'Катя: Новая кампания готова', time: '20:15', members: 8, unread: 2 },
  { id: 3, name: 'Семья 🏠', emoji: '🏠', lastMessage: 'Мама: Ужин в 19:00', time: '18:45', members: 5, unread: 0 },
  { id: 4, name: 'Книжный клуб', emoji: '📚', lastMessage: 'Алина: Следующая книга — Дюна', time: 'Вчера', members: 15, unread: 0 },
  { id: 5, name: 'Спортзал ребята', emoji: '🏋️', lastMessage: 'Макс: Тренировка в пятницу', time: 'Вчера', members: 7, unread: 0 },
];

const CONTACTS: Contact[] = [
  { id: 1, name: 'Алексей Петров', avatar: 'АП', phone: '+7 900 123-45-67', online: true, status: 'В сети' },
  { id: 2, name: 'Анна Новикова', avatar: 'АН', phone: '+7 901 234-56-78', online: false, status: 'Был(а) вчера' },
  { id: 3, name: 'Дмитрий Волков', avatar: 'ДВ', phone: '+7 902 345-67-89', online: false, status: 'Был(а) час назад' },
  { id: 4, name: 'Игорь Морозов', avatar: 'ИМ', phone: '+7 903 456-78-90', online: true, status: 'В сети' },
  { id: 5, name: 'Мария Соколова', avatar: 'МС', phone: '+7 904 567-89-01', online: true, status: 'Печатает...' },
  { id: 6, name: 'Ольга Смирнова', avatar: 'ОС', phone: '+7 905 678-90-12', online: false, status: 'Недавно' },
  { id: 7, name: 'Павел Козлов', avatar: 'ПК', phone: '+7 906 789-01-23', online: false, status: 'Был(а) 3 дня назад' },
];

const CALLS: CallRecord[] = [
  { id: 1, name: 'Алексей Петров', avatar: 'АП', type: 'incoming', duration: '12:34', time: 'Сегодня, 21:00' },
  { id: 2, name: 'Мария Соколова', avatar: 'МС', type: 'outgoing', duration: '5:22', time: 'Сегодня, 18:30' },
  { id: 3, name: 'Дмитрий Волков', avatar: 'ДВ', type: 'missed', duration: '—', time: 'Сегодня, 14:15' },
  { id: 4, name: 'Игорь Морозов', avatar: 'ИМ', type: 'outgoing', duration: '25:01', time: 'Вчера, 22:10' },
  { id: 5, name: 'Анна Новикова', avatar: 'АН', type: 'incoming', duration: '3:14', time: 'Вчера, 19:45' },
  { id: 6, name: 'Ольга Смирнова', avatar: 'ОС', type: 'missed', duration: '—', time: '2 дня назад' },
];

const NOTIFICATIONS: Notification[] = [
  { id: 1, text: 'Отправил вам сообщение', from: 'Алексей Петров', time: '22:14', read: false, type: 'message' },
  { id: 2, text: 'Деплой прошёл успешно!', from: 'Команда разработки', time: '22:30', read: false, type: 'group' },
  { id: 3, text: 'Входящий звонок (пропущен)', from: 'Дмитрий Волков', time: '14:15', read: false, type: 'call' },
  { id: 4, text: 'Добавил вас в группу "Книжный клуб"', from: 'Павел Козлов', time: 'Вчера', read: true, type: 'group' },
  { id: 5, text: 'Отправила вам файлы', from: 'Мария Соколова', time: 'Вчера', read: true, type: 'message' },
];

const NAV = [
  { id: 'chats' as Section, label: 'Чаты', icon: 'MessageCircle' },
  { id: 'groups' as Section, label: 'Группы', icon: 'Users' },
  { id: 'calls' as Section, label: 'Вызовы', icon: 'Phone' },
  { id: 'contacts' as Section, label: 'Контакты', icon: 'Contact' },
  { id: 'notifications' as Section, label: 'Уведомления', icon: 'Bell' },
  { id: 'settings' as Section, label: 'Настройки', icon: 'Settings' },
];

function AvatarComp({ initials, size = 'md', online }: { initials: string; size?: 'sm' | 'md' | 'lg'; online?: boolean }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const colors: Record<string, string> = {
    'А': 'from-cyan-500 to-blue-600', 'М': 'from-pink-500 to-rose-600',
    'Д': 'from-violet-500 to-purple-600', 'И': 'from-emerald-500 to-teal-600',
    'О': 'from-amber-500 to-orange-600', 'П': 'from-indigo-500 to-blue-600',
    'С': 'from-red-500 to-pink-600', 'К': 'from-teal-500 to-cyan-600',
    'Н': 'from-fuchsia-500 to-purple-600',
  };
  const letter = initials.charAt(0);
  const gradient = colors[letter] || 'from-slate-500 to-slate-600';
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-semibold text-white`}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--surface-1)] ${online ? 'bg-[var(--neon-green)]' : 'bg-slate-600'}`} />
      )}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--surface-3)] border border-[var(--glass-border)] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--neon-cyan)] focus:shadow-[0_0_0_1px_rgba(0,212,255,0.3)] transition-all"
      />
    </div>
  );
}

function ChatWindow({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chat.messages);
  const [activeCall, setActiveCall] = useState<{ name: string; avatar: string } | null>(null);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), text: input,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Samara' }),
      fromMe: true
    }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {activeCall && (
        <CallScreen name={activeCall.name} avatar={activeCall.avatar} onEnd={() => setActiveCall(null)} />
      )}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--glass-border)] flex-shrink-0" style={{ background: 'var(--surface-2)' }}>
        <button onClick={onBack} className="md:hidden p-1.5 rounded-lg hover:bg-[var(--surface-3)] transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-slate-400" />
        </button>
        <AvatarComp initials={chat.avatar} online={chat.online} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-100 text-sm">{chat.name}</p>
          <p className="text-xs" style={{ color: 'var(--neon-green)' }}>{chat.online ? 'В сети' : 'Не в сети'}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setActiveCall({ name: chat.name, avatar: chat.avatar })}
            className="p-2 rounded-xl hover:bg-[var(--surface-3)] transition-all hover:scale-110" title="Аудиозвонок">
            <Icon name="Phone" size={16} style={{ color: 'var(--neon-cyan)' }} />
          </button>
          <button onClick={() => setActiveCall({ name: chat.name, avatar: chat.avatar })}
            className="p-2 rounded-xl hover:bg-[var(--surface-3)] transition-all hover:scale-110" title="Видеозвонок">
            <Icon name="Video" size={16} className="text-slate-400" />
          </button>
          <button className="p-2 rounded-xl hover:bg-[var(--surface-3)] transition-colors">
            <Icon name="MoreVertical" size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
              msg.fromMe
                ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-br-sm'
                : 'border text-slate-200 rounded-bl-sm'
            }`} style={msg.fromMe ? {} : { background: 'var(--surface-3)', borderColor: 'var(--glass-border)' }}>
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.fromMe ? 'text-cyan-200' : 'text-slate-500'} text-right`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--glass-border)] flex-shrink-0">
        <div className="flex gap-2 items-center">
          <button className="p-2.5 rounded-xl hover:bg-[var(--surface-3)] transition-colors flex-shrink-0">
            <Icon name="Paperclip" size={16} className="text-slate-400" />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Написать сообщение..."
            className="flex-1 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--neon-cyan)] transition-all"
            style={{ background: 'var(--surface-3)' }}
          />
          <button
            onClick={send}
            className="p-2.5 rounded-xl flex-shrink-0 transition-opacity hover:opacity-90"
            style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 16px rgba(0,212,255,0.4)' }}
          >
            <Icon name="Send" size={16} className="text-[var(--surface-1)]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatsSection({ search }: { search: string }) {
  const [active, setActive] = useState<Chat | null>(null);
  const filtered = useMemo(() =>
    CHATS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className="flex h-full">
      <div className={`${active ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-[var(--glass-border)] flex-shrink-0`}>
        <div className="p-4 border-b border-[var(--glass-border)]">
          <h2 className="text-lg font-semibold text-slate-100 mb-1">Чаты</h2>
          <p className="text-xs text-slate-500">{CHATS.length} диалогов</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((chat, i) => (
            <button
              key={chat.id}
              onClick={() => setActive(chat)}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b border-[var(--glass-border)]/50 animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <AvatarComp initials={chat.avatar} online={chat.online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-100 text-sm truncate">{chat.name}</span>
                  <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-slate-500 truncate">{chat.lastMessage}</span>
                  {chat.unread > 0 && (
                    <span className="flex-shrink-0 ml-2 min-w-[18px] h-[18px] text-xs font-bold rounded-full flex items-center justify-center px-1"
                      style={{ background: 'var(--neon-cyan)', color: 'var(--surface-1)' }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`${active ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {active ? (
          <ChatWindow chat={active} onBack={() => setActive(null)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-slow"
              style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
              <Icon name="MessageCircle" size={36} style={{ color: 'var(--neon-cyan)' }} />
            </div>
            <div>
              <p className="text-slate-300 font-medium">Выберите чат</p>
              <p className="text-slate-500 text-sm mt-1">Нажмите на контакт слева, чтобы начать переписку</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Экран активного звонка ──────────────────────────────────────────
function CallScreen({ name, avatar, onEnd }: { name: string; avatar: string; onEnd: () => void }) {
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between py-16 px-8 animate-fade-in"
      style={{ background: 'linear-gradient(160deg, #0d1117 0%, #0a1628 50%, #0d1117 100%)' }}>
      {/* Фоновые круги */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, var(--neon-cyan), transparent 70%)' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-15 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, var(--neon-cyan), transparent 70%)', animationDelay: '0.5s' }} />
      </div>

      <div className="flex flex-col items-center gap-4 z-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white"
          style={{ boxShadow: '0 0 40px rgba(0,212,255,0.4)' }}>
          {avatar}
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-100">{name}</p>
          <p className="text-sm mt-1 font-mono" style={{ color: 'var(--neon-cyan)' }}>{fmt(seconds)}</p>
          <p className="text-xs text-slate-500 mt-1">Голосовой вызов</p>
        </div>
      </div>

      <div className="flex items-center gap-6 z-10">
        <button onClick={() => setMuted(p => !p)}
          className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{ background: muted ? '#f87171' : 'var(--surface-3)', border: '1px solid var(--glass-border)' }}>
            <Icon name={muted ? 'MicOff' : 'Mic'} size={22} className="text-white" />
          </div>
          <span className="text-xs text-slate-500">{muted ? 'Вкл. звук' : 'Выкл. звук'}</span>
        </button>

        <button onClick={onEnd}
          className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{ background: '#ef4444', boxShadow: '0 0 24px rgba(239,68,68,0.5)' }}>
            <Icon name="PhoneOff" size={26} className="text-white" />
          </div>
          <span className="text-xs text-slate-500">Завершить</span>
        </button>

        <button onClick={() => setSpeakerOn(p => !p)}
          className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{ background: speakerOn ? 'rgba(0,212,255,0.2)' : 'var(--surface-3)', border: `1px solid ${speakerOn ? 'var(--neon-cyan)' : 'var(--glass-border)'}` }}>
            <Icon name={speakerOn ? 'Volume2' : 'VolumeX'} size={22} style={{ color: speakerOn ? 'var(--neon-cyan)' : 'white' }} />
          </div>
          <span className="text-xs text-slate-500">Динамик</span>
        </button>
      </div>
    </div>
  );
}

// ── Модал создания группы ───────────────────────────────────────────
function CreateGroupModal({ onClose, onCreate }: { onClose: () => void; onCreate: (g: Group) => void }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💬');
  const [step, setStep] = useState<'form' | 'done'>('form');
  const emojis = ['💬', '💼', '🏠', '🎮', '📚', '🏋️', '🎵', '✈️', '🍕', '💡', '🚀', '🌿'];

  const submit = () => {
    if (!name.trim()) return;
    onCreate({
      id: Date.now(),
      name: name.trim(),
      emoji,
      lastMessage: 'Группа создана',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Samara' }),
      members: 1,
      unread: 0,
    });
    setStep('done');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-3xl p-6 animate-scale-in"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--glass-border)' }}>
        {step === 'form' ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-100">Новая группа</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--surface-3)]">
                <Icon name="X" size={16} className="text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-2">Выбери иконку</p>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {emojis.map(e => (
                <button key={e} onClick={() => setEmoji(e)}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                  style={{
                    background: emoji === e ? 'rgba(0,212,255,0.15)' : 'var(--surface-3)',
                    border: `1px solid ${emoji === e ? 'var(--neon-cyan)' : 'transparent'}`,
                  }}>
                  {e}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500 mb-2">Название группы</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Например: Рабочий чат"
              maxLength={40}
              className="w-full border rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all mb-4"
              style={{ background: 'var(--surface-3)', borderColor: name ? 'var(--neon-cyan)' : 'var(--glass-border)' }}
              autoFocus
            />

            <button onClick={submit} disabled={!name.trim()}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: name.trim() ? 'var(--neon-cyan)' : 'var(--surface-3)',
                color: name.trim() ? 'var(--surface-1)' : '#64748b',
                boxShadow: name.trim() ? '0 0 20px rgba(0,212,255,0.3)' : 'none',
              }}>
              Создать группу
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-3xl">
              {emoji}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-100">{name}</p>
              <p className="text-sm text-slate-400 mt-1">Группа успешно создана!</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(34,211,160,0.15)' }}>
              <Icon name="Check" size={22} style={{ color: 'var(--neon-green)' }} />
            </div>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--surface-3)', color: 'var(--neon-cyan)', border: '1px solid var(--glass-border)' }}>
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GroupsSection({ search }: { search: string }) {
  const [groups, setGroups] = useState(GROUPS);
  const [showCreate, setShowCreate] = useState(false);
  const filtered = useMemo(() =>
    groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase())),
    [search, groups]
  );
  return (
    <div className="flex flex-col h-full">
      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreate={g => { setGroups(prev => [g, ...prev]); }}
        />
      )}
      <div className="p-4 border-b border-[var(--glass-border)]">
        <h2 className="text-lg font-semibold text-slate-100 mb-1">Группы</h2>
        <p className="text-xs text-slate-500">Все ваши групповые чаты</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {filtered.map((g, i) => (
          <div
            key={g.id}
            className="rounded-2xl p-4 transition-all cursor-pointer animate-fade-in"
            style={{ animationDelay: `${i * 50}ms`, background: 'var(--surface-2)', border: '1px solid var(--glass-border)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-2)')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-2xl flex-shrink-0">
                {g.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-100 text-sm">{g.name}</span>
                  <span className="text-xs text-slate-500">{g.time}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400 truncate">{g.lastMessage}</span>
                  {g.unread > 0 && (
                    <span className="flex-shrink-0 ml-2 min-w-[18px] h-[18px] text-white text-xs font-bold rounded-full flex items-center justify-center px-1"
                      style={{ background: 'var(--neon-purple)' }}>
                      {g.unread}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Icon name="Users" size={11} className="text-slate-500" />
                  <span className="text-xs text-slate-500">{g.members} участников</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-2xl p-4 border border-dashed border-[var(--glass-border)] flex items-center justify-center gap-2 transition-all text-slate-400 hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]">
          <Icon name="Plus" size={16} />
          <span className="text-sm font-medium">Создать группу</span>
        </button>
      </div>
    </div>
  );
}

function CallsSection({ search }: { search: string }) {
  const [activeCall, setActiveCall] = useState<{ name: string; avatar: string } | null>(null);
  const filtered = useMemo(() =>
    CALLS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const typeConfig = {
    incoming: { icon: 'PhoneIncoming', color: 'var(--neon-green)', label: 'Входящий' },
    outgoing: { icon: 'PhoneOutgoing', color: 'var(--neon-cyan)', label: 'Исходящий' },
    missed: { icon: 'PhoneMissed', color: '#f87171', label: 'Пропущенный' },
  };
  return (
    <div className="flex flex-col h-full">
      {activeCall && (
        <CallScreen
          name={activeCall.name}
          avatar={activeCall.avatar}
          onEnd={() => setActiveCall(null)}
        />
      )}
      <div className="p-4 border-b border-[var(--glass-border)]">
        <h2 className="text-lg font-semibold text-slate-100 mb-1">Вызовы</h2>
        <p className="text-xs text-slate-500">История звонков</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((call, i) => {
          const cfg = typeConfig[call.type];
          return (
            <div
              key={call.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-[var(--glass-border)]/50 animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <AvatarComp initials={call.avatar} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-100 text-sm">{call.name}</span>
                  <Icon name={cfg.icon as 'Phone'} size={13} style={{ color: cfg.color }} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs" style={{ color: call.type === 'missed' ? '#f87171' : '#64748b' }}>{cfg.label}</span>
                  <span className="text-xs text-slate-600">·</span>
                  <span className="text-xs text-slate-500">{call.time}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-mono">{call.duration}</span>
                <div className="flex gap-1 mt-1 justify-end">
                  <button
                    onClick={() => setActiveCall({ name: call.name, avatar: call.avatar })}
                    className="p-1.5 rounded-lg transition-all hover:bg-[var(--surface-2)] hover:scale-110"
                    title="Аудиозвонок"
                  >
                    <Icon name="Phone" size={13} style={{ color: 'var(--neon-cyan)' }} />
                  </button>
                  <button
                    onClick={() => setActiveCall({ name: call.name, avatar: call.avatar })}
                    className="p-1.5 rounded-lg transition-all hover:bg-[var(--surface-2)] hover:scale-110"
                    title="Видеозвонок"
                  >
                    <Icon name="Video" size={13} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactsSection({ search }: { search: string }) {
  const filtered = useMemo(() =>
    CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)),
    [search]
  );
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--glass-border)]">
        <h2 className="text-lg font-semibold text-slate-100 mb-1">Контакты</h2>
        <p className="text-xs text-slate-500">{CONTACTS.length} контактов</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-[var(--glass-border)]/50 animate-fade-in"
            style={{ animationDelay: `${i * 40}ms` }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
          >
            <AvatarComp initials={c.avatar} online={c.online} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-100 text-sm">{c.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.status}</p>
              <p className="text-xs text-slate-600 font-mono">{c.phone}</p>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-xl transition-colors hover:bg-[var(--surface-2)]">
                <Icon name="MessageCircle" size={15} style={{ color: 'var(--neon-cyan)' }} />
              </button>
              <button className="p-2 rounded-xl transition-colors hover:bg-[var(--surface-2)]">
                <Icon name="Phone" size={15} className="text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const notifIcon = { message: 'MessageCircle', group: 'Users', call: 'Phone' };
  const markAll = () => setItems(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Уведомления</h2>
          <p className="text-xs text-slate-500">{items.filter(n => !n.read).length} новых</p>
        </div>
        <button onClick={markAll} className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ color: 'var(--neon-cyan)', background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
          Прочитать все
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {items.map((n, i) => (
          <div
            key={n.id}
            className="rounded-2xl p-4 transition-all animate-fade-in"
            style={{
              animationDelay: `${i * 50}ms`,
              background: 'var(--surface-2)',
              border: `1px solid ${!n.read ? 'rgba(0,212,255,0.25)' : 'var(--glass-border)'}`,
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{
                background: n.type === 'message' ? 'rgba(0,212,255,0.15)' : n.type === 'group' ? 'rgba(168,85,247,0.15)' : 'rgba(34,211,160,0.15)'
              }}>
                <Icon name={notifIcon[n.type] as 'Phone'} size={16} style={{
                  color: n.type === 'message' ? 'var(--neon-cyan)' : n.type === 'group' ? 'var(--neon-purple)' : 'var(--neon-green)'
                }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-100 text-sm">{n.from}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{n.time}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--neon-cyan)' }} />}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{n.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsSection() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [preview, setPreview] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{
        background: value ? 'var(--neon-cyan)' : 'var(--surface-3)',
        boxShadow: value ? '0 0 10px rgba(0,212,255,0.4)' : 'none'
      }}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--glass-border)]">
        <h2 className="text-lg font-semibold text-slate-100">Настройки</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="rounded-2xl p-4 flex items-center gap-4 animate-fade-in"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--glass-border)' }}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            ВЫ
          </div>
          <div>
            <p className="font-semibold text-slate-100">Мой профиль</p>
            <p className="text-sm text-slate-400 mt-0.5">+7 900 000-00-00</p>
            <p className="text-xs mt-1" style={{ color: 'var(--neon-green)' }}>В сети</p>
          </div>
          <button className="ml-auto p-2 rounded-xl transition-colors hover:bg-[var(--surface-3)]">
            <Icon name="Edit" size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden animate-fade-in"
          style={{ animationDelay: '80ms', background: 'var(--surface-2)', border: '1px solid var(--glass-border)' }}>
          <div className="px-4 py-3 border-b border-[var(--glass-border)]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Уведомления</p>
          </div>
          {[
            { label: 'Push-уведомления', desc: 'Получать уведомления о новых сообщениях', value: notifications, onChange: () => setNotifications(p => !p) },
            { label: 'Звуки', desc: 'Звуковые сигналы при получении сообщений', value: sounds, onChange: () => setSounds(p => !p) },
            { label: 'Предпросмотр', desc: 'Показывать текст в уведомлениях', value: preview, onChange: () => setPreview(p => !p) },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]/50 last:border-0">
              <div>
                <p className="text-sm text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden animate-fade-in"
          style={{ animationDelay: '120ms', background: 'var(--surface-2)', border: '1px solid var(--glass-border)' }}>
          <div className="px-4 py-3 border-b border-[var(--glass-border)]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Аккаунт</p>
          </div>
          {['Конфиденциальность', 'Безопасность', 'Устройства', 'Хранилище'].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]/50 last:border-0 transition-colors hover:bg-[var(--surface-3)]">
              <span className="text-sm text-slate-200">{item}</span>
              <Icon name="ChevronRight" size={14} className="text-slate-500" />
            </button>
          ))}
        </div>

        <button className="rounded-2xl px-4 py-3 text-red-400 text-sm font-medium flex items-center gap-2 transition-colors hover:bg-red-500/10 animate-fade-in"
          style={{ animationDelay: '160ms', background: 'var(--surface-2)', border: '1px solid var(--glass-border)' }}>
          <Icon name="LogOut" size={15} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [section, setSection] = useState<Section>('chats');
  const [search, setSearch] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Samara' })
  );

  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Samara' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);



  const sectionSearchPlaceholders: Record<Section, string> = {
    chats: 'Поиск по чатам и сообщениям...',
    groups: 'Поиск по группам...',
    calls: 'Поиск по вызовам...',
    contacts: 'Поиск контактов...',
    notifications: '',
    settings: '',
  };

  const getBadge = (id: Section) => {
    if (id === 'chats') return CHATS.reduce((s, c) => s + c.unread, 0);
    if (id === 'groups') return GROUPS.reduce((s, g) => s + g.unread, 0);
    if (id === 'notifications') return NOTIFICATIONS.filter(n => !n.read).length;
    return 0;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--surface-1)' }}>
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)] flex-shrink-0" style={{ background: 'var(--surface-2)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 12px rgba(0,212,255,0.5)' }}>
            <Icon name="Zap" size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-100 tracking-tight">NightChat</span>
        </div>
        <button onClick={() => setMobileNav(p => !p)} className="p-2 rounded-xl transition-colors relative hover:bg-[var(--surface-3)]">
          <Icon name="Menu" size={18} className="text-slate-300" />
          {getBadge('chats') + getBadge('groups') > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--neon-cyan)' }} />
          )}
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className={`
          fixed md:relative inset-0 z-50 md:z-auto
          flex flex-col w-64 lg:w-72 flex-shrink-0
          border-r border-[var(--glass-border)]
          transition-transform duration-300
          ${mobileNav ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `} style={{ background: 'var(--surface-2)' }}>
          <div className="p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center"
                style={{ boxShadow: '0 0 16px rgba(0,212,255,0.5)' }}>
                <Icon name="Zap" size={16} className="text-white" />
              </div>
              <span className="font-bold text-slate-100 tracking-tight text-lg">NightChat</span>
            </div>
            <button className="md:hidden p-1.5 rounded-lg transition-colors hover:bg-[var(--surface-3)]" onClick={() => setMobileNav(false)}>
              <Icon name="X" size={16} className="text-slate-400" />
            </button>
          </div>

          <div className="px-3 mb-3 flex-shrink-0">
            <SearchBar value={search} onChange={setSearch} placeholder={sectionSearchPlaceholders[section] || 'Поиск...'} />
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-1">
            {NAV.map(item => {
              const badge = getBadge(item.id);
              const isActive = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setSection(item.id); setMobileNav(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left mb-0.5"
                  style={{
                    background: isActive ? 'rgba(0,212,255,0.1)' : 'transparent',
                    color: isActive ? 'var(--neon-cyan)' : '#94a3b8',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface-3)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon name={item.icon as 'Phone'} size={18} />
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {badge > 0 && (
                    <span className="min-w-[20px] h-5 rounded-full text-xs font-bold flex items-center justify-center px-1"
                      style={{
                        background: isActive ? 'var(--neon-cyan)' : 'rgba(0,212,255,0.2)',
                        color: isActive ? 'var(--surface-1)' : 'var(--neon-cyan)',
                      }}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[var(--glass-border)] flex-shrink-0">
            {/* Часы Тольятти */}
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1 rounded-xl"
              style={{ background: 'var(--surface-3)' }}>
              <Icon name="Clock" size={13} className="text-slate-500 flex-shrink-0" />
              <span className="text-xs text-slate-400">Тольятти</span>
              <span className="ml-auto text-xs font-mono font-medium" style={{ color: 'var(--neon-cyan)' }}>{clock}</span>
            </div>
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                ВЫ
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">Мой профиль</p>
                <p className="text-xs" style={{ color: 'var(--neon-green)' }}>В сети</p>
              </div>
              <button onClick={() => setSection('settings')} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--surface-3)]">
                <Icon name="Settings" size={14} className="text-slate-500" />
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay mobile */}
        {mobileNav && (
          <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileNav(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden" style={{ background: 'var(--surface-1)' }}>
          {section === 'chats' && <ChatsSection search={search} />}
          {section === 'groups' && <GroupsSection search={search} />}
          {section === 'calls' && <CallsSection search={search} />}
          {section === 'contacts' && <ContactsSection search={search} />}
          {section === 'notifications' && <NotificationsSection />}
          {section === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}