import React, { useState } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import MessageInbox from '../../components/vendor/MessageInbox';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Archive,
  Trash2,
  Star,
  Clock
} from 'lucide-react';

const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const tabs = [
    { id: 'inbox', label: 'Inbox', count: 12 },
    { id: 'unread', label: 'Unread', count: 3 },
    { id: 'important', label: 'Important', count: 5 },
    { id: 'archived', label: 'Archived', count: 24 },
    { id: 'sent', label: 'Sent' },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Rahim Khan',
      avatar: 'RK',
      subject: 'Order #TOMART-2024-00123 Inquiry',
      preview: 'Hi, I wanted to check the status of my order...',
      time: '10:30 AM',
      unread: true,
      important: true,
      attachments: 1
    },
    {
      id: 2,
      sender: 'Nusrat Jahan',
      avatar: 'NJ',
      subject: 'Product Return Request',
      preview: 'The product I received was damaged...',
      time: 'Yesterday',
      unread: false,
      important: false,
      attachments: 0
    },
    {
      id: 3,
      sender: 'TomartBD Support',
      avatar: 'TS',
      subject: 'Account Verification Required',
      preview: 'Please verify your vendor account to continue...',
      time: '2 days ago',
      unread: false,
      important: true,
      attachments: 2
    },
    {
      id: 4,
      sender: 'Karim Uddin',
      avatar: 'KU',
      subject: 'Bulk Order Inquiry',
      preview: 'I\'m interested in purchasing 50 units of...',
      time: '3 days ago',
      unread: false,
      important: false,
      attachments: 1
    }
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">
              Communicate with customers and manage inquiries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MessageSquare className="h-4 w-4" />
              New Message
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Message List */}
        <div className="lg:col-span-1">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-sm font-medium relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {tab.label}
                    {tab.count && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Message List */}
            <div className="max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {message.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">
                            {message.sender}
                          </span>
                          {message.unread && (
                            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                          )}
                          {message.important && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {message.attachments > 0 && (
                            <Paperclip className="h-3 w-3 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1 truncate">
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {message.preview}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Message Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Avg Response Time</span>
                <span className="text-sm font-medium text-gray-900">2.4 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Customer Satisfaction</span>
                <span className="text-sm font-medium text-green-600">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Pending Replies</span>
                <span className="text-sm font-medium text-red-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Conversations</span>
                <span className="text-sm font-medium text-gray-900">48</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
              {/* Message Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {selectedMessage.avatar}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {selectedMessage.sender}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedMessage.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Video className="h-4 w-4" />
                    </button>
                    <div className="relative">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Received Message */}
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                      {selectedMessage.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg rounded-tl-none p-4">
                        <p className="text-gray-900">
                          Hi, I wanted to check the status of my order #TOMART-2024-00123. It was supposed to be delivered yesterday but I haven't received any updates yet.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">10:30 AM</p>
                      </div>
                    </div>
                  </div>

                  {/* Sent Message */}
                  <div className="flex gap-3 justify-end">
                    <div className="flex-1 max-w-[80%]">
                      <div className="bg-blue-100 rounded-lg rounded-tr-none p-4">
                        <p className="text-gray-900">
                          Hello! Thank you for reaching out. I've checked your order and it's currently being processed. The estimated delivery is tomorrow. I'll share the tracking details as soon as they're available.
                        </p>
                        <p className="text-sm text-gray-500 mt-2 text-right">10:45 AM</p>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                      Me
                    </div>
                  </div>

                  {/* Received Message */}
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                      {selectedMessage.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg rounded-tl-none p-4">
                        <p className="text-gray-900">
                          Thank you for the update! Please share the tracking details when available.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">10:50 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Smile className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          Save Draft
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm h-full flex items-center justify-center p-12">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Message Selected</h3>
                <p className="text-gray-500">
                  Select a message from the list to view conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Archive className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Archive All</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Trash2 className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Delete Old</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Star className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Mark Important</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Set Reminder</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;