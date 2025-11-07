'use client'

import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        className="w-16 h-16 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
        <img src="/chatbotlogo.png" alt="Chatbot Logo" className="w-full h-full object-contain" />
    </button>
      {isOpen && (
        <div className="mt-2 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
          <div className="bg-orange-700 text-white p-2 font-bold flex justify-between items-center">
            AI Chatbot
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  msg.role === 'user' ? 'bg-gray-200 self-end' : 'bg-gray-300 self-start'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Typing...</div>}
            <div ref={messagesRef} />
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input input-bordered flex-1 focus:outline-none"
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="btn btn-primary p-0 w-8 h-8     flex items-center justify-center">
                <img src="/sendlogo.png" alt="Send" className="w-full h-full object-contain" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
