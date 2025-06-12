'use client';

import React, { useState, useEffect } from 'react';

const NotesPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const fetchQuickNotes = async () => {
      try {
        const response = await fetch('/api/quick-notes');
        if (response.ok) {
          const data = await response.json();
          setMessages(data.map((note: { content: any }) => note.content));
        } else {
          console.error('Error fetching quick notes:', response.status);
        }
      } catch (error) {
        console.error('Error fetching quick notes:', error);
      }
    };

    fetchQuickNotes();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        const response = await fetch('/api/quick-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: newMessage }),
        });

        if (response.ok) {
          setMessages([...messages, newMessage]);
          setNewMessage('');
        } else {
          console.error('Error saving quick note:', response.status);
          alert(`Error saving quick note: ${response.status}`);
        }
      } catch (error) {
        console.error('Error saving quick note:', error);
        alert(`Error saving quick note: ${error}`);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className=''>
      {/*top*/}
      <div className='flex items-center justify-between'>
        <h1>Notes</h1>
        {/* No actions needed on the right for this page */}
      </div>

      {/* Chat Section */}
      <div className='mt-5'>
        {' '}
        {/* Add some margin top */}
        <h2 className='text-lg font-semibold mb-2'>Quick Chat</h2>
        {/* Message Display Area */}
        <div className='border border-borderColor rounded p-3 mb-3 h-64 overflow-y-auto bg-secondary dark:bg-secondary-dark'>
          {messages.map((message, index) => (
            <div
              key={index}
              className='bg-lightEmphasisColor dark:bg-darkEmphasisColor p-2 rounded mb-2 text-sm'
            >
              {message}
            </div>
          ))}
          {messages.length === 0 && <p className='text-gray-500 italic'>No messages yet.</p>}
        </div>
        {/* Input Area */}
        <div className='flex gap-2'>
          <input
            type='text'
            value={newMessage}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder='Type your message...'
            className='flex-grow p-2 border rounded bg-inputBgColor text-textColor border-borderColor focus:outline-none focus:ring-1 focus:ring-accent'
          />
          <button
            onClick={handleSendMessage}
            className='px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent-hover transition duration-200 ease-in-out'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
