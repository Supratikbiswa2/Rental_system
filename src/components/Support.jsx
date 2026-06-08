import { useState, useRef, useEffect } from 'react';

export default function Support() {
  const [messages, setMessages] = useState([
    { type: 'agent', text: 'Hello Alex! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendChat = () => {
    const msg = input.trim();
    if (!msg) return;
    setMessages(m => [...m, { type: 'user', text: msg }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { type: 'agent', text: "Thanks for reaching out! Our support team will look into this right away and get back to you within minutes." }]);
    }, 800);
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header"><div className="card-title"><i className="ti ti-headset"></i>Live Support Chat</div><span className="badge badge-green">Online</span></div>
        <div className="card-body">
          <div className="chat-area" ref={chatRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.type}`}>
                <div className="chat-avatar" style={m.type === 'user' ? { background: 'var(--primary)', color: '#fff' } : {}}>
                  {m.type === 'user' ? 'AJ' : 'AI'}
                </div>
                <div className="chat-bubble">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Type a message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
            />
            <button className="btn btn-primary btn-sm" onClick={sendChat}><i className="ti ti-send"></i></button>
          </div>
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: '14px' }}>
          <div className="card-header"><div className="card-title"><i className="ti ti-ticket"></i>Open Tickets</div></div>
          <div className="card-body" style={{ padding: 0 }}>
            <table>
              <thead><tr><th>Ticket</th><th>Issue</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                <tr>
                  <td>#T-201</td>
                  <td>Billing overcharge</td>
                  <td><span className="badge badge-amber">In Review</span></td>
                  <td>Jun 5</td>
                </tr>
                <tr>
                  <td>#T-198</td>
                  <td>Vehicle locked mid-ride</td>
                  <td><span className="badge badge-blue">Escalated</span></td>
                  <td>Jun 3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="ti ti-help-circle"></i>Quick Help</div></div>
          <div className="card-body">
            {['How do I unlock a bike?', 'What if I get a flat tire?', 'How is billing calculated?', 'How to extend my rental?'].map((q, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', fontSize: '13px', cursor: 'pointer', color: 'var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setMessages(m => [...m, { type: 'user', text: q }])}>
                {q} <i className="ti ti-chevron-right" style={{ fontSize: '14px' }}></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
