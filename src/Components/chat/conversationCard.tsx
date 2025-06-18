import React from 'react'
import { Link } from 'react-router-dom'
import { ChatBubbleLeftRightIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface ConversationCardProps {
  id: string
  title: string
  lastMessage: string
  timestamp: string
}

const ConversationCard: React.FC<ConversationCardProps> = ({ id, title, lastMessage, timestamp }) => {
  return (
    <Link 
      to={`/alumno/conversaciones/${id}`}
      className="block bg-white rounded-lg shadow-sm p-4 mb-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
          <div className="flex items-center mt-1 text-xs text-gray-400">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {new Date(timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ConversationCard