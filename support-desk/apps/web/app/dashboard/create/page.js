'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreateTicket() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    loadUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setStatus('Please log in first.');
      return;
    }

    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, userId }),
    });

    if (res.ok) {
      setStatus('Ticket submitted successfully!');
      setSubject('');
      setMessage('');
    } else {
      setStatus('Failed to submit ticket.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
      <input
        value={subject}
        placeholder="Subject"
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2"
      />
      <textarea
        value={message}
        placeholder="How can we help?"
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">Submit Ticket</button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
