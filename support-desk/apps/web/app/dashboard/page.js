'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      const res = await fetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!user) return <p className="p-6 text-red-500">Please log in to view tickets.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Support Desk Dashboard</h1>
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map(ticket => (
            <li key={ticket.id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">{ticket.subject}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  ticket.status === 'open' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
