import  { useState } from 'react';
import { useChat } from "../../context/chatContext";
import { PlusIcon, Bars3Icon, XMarkIcon, ChatBubbleLeftRightIcon, TrashIcon } from '@heroicons/react/24/outline';

const ChatSidebar = () => {
  const {
    conversations,
    currentConversation,
    selectConversation,
    setCurrentConversation,
    setMessages,
    deleteConversation,
    isLoading
  } = useChat();

  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleCreateNewConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
    setOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    setOpen(false);
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se seleccione la conversación
    try {
      await deleteConversation(conversationId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error al eliminar conversación:', error);
      alert('Error al eliminar la conversación');
    }
  };

  const confirmDelete = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(conversationId);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  return (
    <>
      <button
        className="md:hidden fixed top-20 left-4 z-30 bg-blue-600 text-white p-2 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Abrir conversaciones"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-5 border-b bg-gradient-to-br from-blue-600 to-purple-600 rounded-tl-2xl">
            <h2 className="text-lg font-bold text-white">Conversaciones</h2>
            <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/10">
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <button
            onClick={handleCreateNewConversation}
            className="mx-5 my-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center text-sm font-semibold shadow transition"
            disabled={isLoading}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva conversación
          </button>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              conversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`p-5 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition group ${
                    currentConversation === conversation.id ? 'bg-blue-100' : ''
                  }`}
                >
                  {showDeleteConfirm === conversation.id ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-700">¿Eliminar esta conversación?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleDeleteConversation(conversation.id, e)}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start" onClick={() => handleSelectConversation(conversation.id)}>
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400 mr-3 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {conversation.title || 'Sin título'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(conversation.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => confirmDelete(conversation.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-red-100 rounded"
                        title="Eliminar conversación"
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col w-80 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-xl">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-tl-2xl">
          <h2 className="text-lg font-bold text-white">Conversaciones</h2>
        </div>
        <button
          onClick={handleCreateNewConversation}
          className="mx-5 my-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center text-sm font-semibold shadow transition"
          disabled={isLoading}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva conversación
        </button>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`p-5 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition group ${
                  currentConversation === conversation.id ? 'bg-blue-100' : ''
                }`}
              >
                {showDeleteConfirm === conversation.id ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-700">¿Eliminar esta conversación?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start" onClick={() => handleSelectConversation(conversation.id)}>
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400 mr-3 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {conversation.title || 'Sin título'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conversation.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => confirmDelete(conversation.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-red-100 rounded"
                      title="Eliminar conversación"
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;