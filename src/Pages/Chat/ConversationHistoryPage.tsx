import React, { useEffect, useRef } from 'react';
import { useChat } from "../../context/chatContext";
import ChatSidebar from "./chatSidebar";
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { marked } from "marked";

const ConversationHistoryPage = () => {
  const {
    messages,
    sendMessage,
    isLoading,
    areConversationsLoaded,
    loadConversations,
  } = useChat();

  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!areConversationsLoaded) {
      loadConversations();
    }
  }, [areConversationsLoaded, loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Chat window */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 md:px-0">
          <div className="w-full max-w-2xl h-[90vh] bg-white border border-gray-200 shadow-lg flex flex-col rounded-2xl mt-4 md:mt-8">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center rounded-t-2xl bg-gradient-to-br from-blue-600 to-purple-600">
              <h3 className="font-medium text-white">
                Conversación con Tutor
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' ? (
                    <div
                      className="max-w-[90%] md:max-w-[70%] rounded-xl px-4 py-2 shadow bg-purple-100 text-purple-900 prose prose-sm"
                      dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                    />
                  ) : (
                    <div
                      className="max-w-[90%] md:max-w-[70%] rounded-xl px-4 py-2 shadow bg-blue-500 text-white"
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.timestamp && (
                        <div className="text-xs mt-1 text-blue-100">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              if (!input.trim()) return;
              sendMessage(input);
              setInput('');
            }} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
    
      </div>
    </div>
  );
};

export default ConversationHistoryPage;