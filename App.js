import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logStart, logSuccess, logFailure } from './store/interactionSlice';

function App() {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.interactions.logs);
  
  const [hcpId, setHcpId] = useState('HCP-00234');
  const [notes, setNotes] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Welcome! Share your interaction summary or type a specific tool command (log, edit, compliance, schedule, profile).' }
  ]);
  const [isChatMode, setIsChatMode] = useState(true);

  const sendToAI = async (textInput) => {
    dispatch(logStart());
    try {
      const response = await fetch('http://127.0.0.1:8000/api/hcp/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textInput, hcp_id: hcpId })
      });
      const data = await response.json();
      
      const newLog = {
        id: Date.now(),
        hcpId: hcpId,
        notes: data.response || "No text payload returned from backend.",
        timestamp: new Date().toLocaleTimeString()
      };
      
      dispatch(logSuccess(newLog));
      return data.response;
    } catch (err) {
      dispatch(logFailure(err.message));
      return 'API Communication failure. Verify your FastAPI server is active.';
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    await sendToAI(notes);
    setNotes('');
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    
    const aiResponse = await sendToAI(userText);
    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '32px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
        <h2 style={{ color: '#4f46e5', margin: 0 }}>🤖 AI-First HCP CRM Dashboard</h2>
        <button 
          onClick={() => setIsChatMode(!isChatMode)}
          style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          Toggle to {isChatMode ? 'Structured Form View' : 'Conversational Chat View'}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Side: Input Workspace */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#1f2937' }}>Logging Node Workspace (HCP: {hcpId})</h3>
          
          {isChatMode ? (
            <div>
              <div style={{ height: '350px', overflowY: 'auto', border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#fafafa' }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#4f46e5' : '#e5e7eb', color: m.role === 'user' ? '#fff' : '#1f2937', padding: '12px 16px', borderRadius: '8px', maxWidth: '80%', fontSize: '0.95rem', lineHeight: '1.4' }}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '1rem' }} value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type interaction details or commands..." />
                <button style={{ padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }} onClick={handleChatSubmit}>Send</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#4b5563' }}>Form Field Input Summary:</label>
              <textarea style={{ width: '100%', height: '200px', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '1rem', resize: 'none' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Submit formal interaction logs directly to SQL database..." />
              <button type="submit" style={{ marginTop: '16px', padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', width: '100%', cursor: 'pointer', fontWeight: '500' }}>Save Interaction</button>
            </form>
          )}
        </div>

        {/* Right Side: Redux Logs Panel */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#1f2937' }}>State Registry Output Logs (Redux Verified)</h3>
          {logs.length === 0 ? <p style={{ color: '#9ca3af' }}>No operational logs stored in active pipeline session.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '430px', overflowY: 'auto' }}>
              {logs.map(log => (
                <div key={log.id} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', background: '#f9fafb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px' }}>
                    <strong>Target: {log.hcpId}</strong>
                    <span>{log.timestamp}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151', lineHeight: '1.4' }}>{log.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;