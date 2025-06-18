import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/chatContext'; 
import { Send, Message as MessageIcon, Close } from '@mui/icons-material';
import { marked } from 'marked'; 
export const ChatModal = () => {
  const { messages, sendMessage, isOpen, toggleChat, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-xl hover:scale-105 transition-all duration-200"
      aria-label="Abrir chat"
    >
      <MessageIcon fontSize="medium" />
    </button>
  );

// ...existing code...
  return (
    <div className="fixed bottom-8 right-8 w-[32rem] max-w-[95vw] h-[650px] flex flex-col z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl shadow">
        <span className="font-bold text-xl tracking-wide">Tutor AI</span>
        <button onClick={toggleChat} className="text-white hover:text-gray-200 transition-colors">
          <Close fontSize="medium" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow
                ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
                {msg.role === 'user' ? 'Tú' : 'AI'}
              </div>
              {msg.role === 'assistant' ? (
                <div
                  className="rounded-xl px-4 py-2 text-base whitespace-pre-wrap shadow bg-purple-100 text-purple-900 prose prose-sm max-w-full"
                  dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                />
              ) : (
                <div className="rounded-xl px-4 py-2 text-base whitespace-pre-wrap shadow bg-blue-100 text-blue-900">
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 flex gap-3 border-t border-gray-200 bg-white">
        <input
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-3 text-white hover:scale-110 transition-all duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Send fontSize="medium" />
        </button>
      </form>
    </div>
  );
};
