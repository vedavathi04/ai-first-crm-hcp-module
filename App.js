import React, { useState } from 'react';

function App() {
  // Left Side Form Controlled States
  const [hcpName, setHcpName] = useState('');
  const [interactionType, setInteractionType] = useState('Meeting');
  const [date, setDate] = useState('2025-04-19');
  const [time, setTime] = useState('19:36');
  const [attendees, setAttendees] = useState('');
  const [topicsDiscussed, setTopicsDiscussed] = useState('');
  const [outcomes, setOutcomes] = useState('');
  const [followUpActions, setFollowUpActions] = useState('');
  const [sentiment, setSentiment] = useState('Neutral');
  const [followUps, setFollowUps] = useState([
    '+ Schedule follow-up meeting in 2 weeks',
    '+ Send OncoBoost Phase III PDF',
    '+ Add Dr. Sharma to advisory board invite list'
  ]);

  const [chatInput, setChatInput] = useState('');
  const [chatLogs, setChatLogs] = useState([]);

  const handleLogSubmit = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setChatInput('');

    try {
      const response = await fetch('http://localhost:8000/api/hcp/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, hcp_id: "HCP-00234" })
      });
      const data = await response.json();

      if (data.extracted_data) {
        const ext = data.extracted_data;
        if (ext.hcp_name) setHcpName(ext.hcp_name);
        if (ext.topics_discussed) setTopicsDiscussed(ext.topics_discussed);
        if (ext.sentiment) setSentiment(ext.sentiment);
        if (ext.follow_ups) setFollowUps(ext.follow_ups);
        if (ext.interaction_type) setInteractionType(ext.interaction_type);
        if (ext.date) setDate(ext.date);
        if (ext.time) setTime(ext.time);
        
        // Dynamic mappings for the requested fields from the AI response
        if (ext.attendees) setAttendees(ext.attendees);
        if (ext.outcomes) setOutcomes(ext.outcomes);
        if (ext.follow_up_actions) setFollowUpActions(ext.follow_up_actions);
      }

      setChatLogs(prev => [...prev, { user: userMessage, ai: data.response }]);
    } catch (error) {
      setChatLogs(prev => [...prev, { user: userMessage, ai: "Connection Error: Please verify your FastAPI backend server window is open and running." }]);
    }
  };

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', padding: '20px', backgroundColor: '#f4f6f8', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#0f172a', margin: '0 0 20px 0', flexShrink: 0 }}>Log HCP Interaction</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* LEFT PANEL: Unlocked Scrollable Form View Area */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Interaction Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '13px', color: '#334155' }}>HCP Name</label>
              <input 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} 
                value={hcpName} 
                onChange={(e) => setHcpName(e.target.value)} 
                placeholder="Search or select HCP..." 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '13px', color: '#334155' }}>Interaction Type</label>
              <select 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '13px', outline: 'none' }} 
                value={interactionType} 
                onChange={(e) => setInteractionType(e.target.value)}
              >
                <option value="Meeting">Meeting</option>
                <option value="Call">Call</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '13px', color: '#334155' }}>Date</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '13px', color: '#334155' }}>Time</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '13px', color: '#334155' }}>Attendees</label>
            <input 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} 
              value={attendees} 
              onChange={(e) => setAttendees(e.target.value)} 
              placeholder="Enter names or search..." 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '13px', color: '#334155' }}>Topics Discussed</label>
            <textarea 
              style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'none', fontSize: '13px', outline: 'none' }} 
              value={topicsDiscussed} 
              onChange={(e) => setTopicsDiscussed(e.target.value)} 
              placeholder="Enter key discussion points..." 
            />
          </div>

          <button style={{ alignSelf: 'flex-start', padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
            ✨ Summarize from Voice Note (Requires Consent)
          </button>

          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px', fontSize: '13px', color: '#334155' }}>Materials Shared / Samples Distributed</label>
            <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Materials Shared (No materials added)</span>
              <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', fontSize: '12px', cursor: 'pointer' }}>🔍 Search/Add</button>
            </div>
            <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Samples Distributed (No samples added)</span>
              <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', fontSize: '12px', cursor: 'pointer' }}>📦 Add Sample</button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '13px', color: '#334155' }}>Observed/Inferred HCP Sentiment</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Positive', 'Neutral', 'Negative'].map((s) => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="sentiment" 
                    value={s}
                    checked={sentiment === s} 
                    onChange={() => setSentiment(s)} 
                  /> {s}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '13px', color: '#334155' }}>Outcomes</label>
            <textarea 
              style={{ width: '100%', height: '60px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'none', fontSize: '13px', outline: 'none' }} 
              value={outcomes} 
              onChange={(e) => setOutcomes(e.target.value)} 
              placeholder="Key outcomes or agreements..." 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '13px', color: '#334155' }}>Follow-up Actions</label>
            <textarea 
              style={{ width: '100%', height: '60px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'none', fontSize: '13px', outline: 'none' }} 
              value={followUpActions} 
              onChange={(e) => setFollowUpActions(e.target.value)} 
              placeholder="Enter next steps or tasks..." 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '12px', color: '#475569' }}>AI Suggested Follow-ups:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {followUps.map((f, idx) => (
                <span key={idx} style={{ fontSize: '13px', color: '#2563eb', cursor: 'pointer' }}>{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Fixed AI Assistant Sidebar */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>🌐 AI Assistant</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Log interaction via chat</span>
          </div>

          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f8fafc', flex: 1, overflowY: 'auto' }}>
            <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
              Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.
            </div>

            {chatLogs.map((log, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ alignSelf: 'flex-end', backgroundColor: '#2563eb', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', maxWidth: '85%' }}>
                  {log.user}
                </div>
                <div style={{ alignSelf: 'flex-start', backgroundColor: '#e2e8f0', color: '#1e293b', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', maxWidth: '85%', fontWeight: '500' }}>
                  {log.ai}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', backgroundColor: '#fff', borderRadius: '0 0 8px 8px', flexShrink: 0 }}>
            <input 
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              placeholder="Describe interaction..." 
              onKeyDown={e => e.key === 'Enter' && handleLogSubmit()} 
            />
            <button 
              style={{ backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
              onClick={handleLogSubmit}
            >
              Log
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
