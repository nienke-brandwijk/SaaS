'use client'

import { useState, useRef, useEffect } from 'react';

export default function Chatbot({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = user ? `chat_messages_${user.id}` : null;
  useEffect(() => {
    if (user && STORAGE_KEY) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } else {
      setMessages([]);
    }
  }, [user, STORAGE_KEY]);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user && STORAGE_KEY) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, user, STORAGE_KEY]);

  const sendMessage = async () => {
    if (!input.trim()) {
        return;
    }
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Something went wrong.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 flex items-center justify-center hover:scale-105 transition-transform"
        >
        <img src="/chatbotlogo.png" alt="Chatbot Logo" className="w-full h-full object-contain" />
      </button>
      {isOpen && (
        <div className="mt-2 w-80 h-96 bg-bgDefault rounded-lg shadow-sm flex flex-col overflow-hidden">
          <div className="bg-colorBtn text-txtColorBtn p-2 font-bold rounded-lg flex justify-between items-center">
            AI Chatbot
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  msg.role === 'user' ? 'bg-bgAI self-end' : 'bg-white self-start'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-sm text-txtSoft">Typing...</div>}
            <div ref={messagesRef} />
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input input-bordered bg-bgDefault placeholder:text-txtHint flex-1 focus:outline-none"
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="btn btn-primary p-0 w-8 h-8 flex items-center justify-center">
                <img src="/sendlogo.png" alt="Send" className="w-full h-full object-contain" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
