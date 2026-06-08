import { useState, useEffect, useRef } from 'react';

export default function ActiveRide({ onNavigate }) {
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [startTime] = useState(new Date());
  const [showIssueModal, setShowIssueModal] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!paused) setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const dist = (seconds * 0.003).toFixed(1);
  const cost = (seconds * 0.002).toFixed(2);
  const fmtStart = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const endRide = () => {
    clearInterval(intervalRef.current);
    alert(`Ride ended! Total: $${cost}. Vehicle locked. Thank you!`);
    onNavigate('history');
  };

  return (
    <div>
      <div className="ride-live" style={{ marginBottom: '16px' }}>
        <div className="ride-live-title">Currently Active</div>
        <div className="ride-live-vehicle">🚲 City Bike — BK-07</div>
        <div className="ride-stats-row">
          <div className="ride-stat"><div className="ride-stat-val">{fmt(seconds)}</div><div className="ride-stat-lbl">Duration</div></div>
          <div className="ride-stat"><div className="ride-stat-val">{dist} km</div><div className="ride-stat-lbl">Distance</div></div>
          <div className="ride-stat"><div className="ride-stat-val">${cost}</div><div className="ride-stat-lbl">Est. Cost</div></div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            className="btn"
            style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}
            onClick={() => setPaused(p => !p)}
          >
            <i className={`ti ${paused ? 'ti-player-play' : 'ti-player-pause'}`}></i> {paused ? 'Resume' : 'Pause'}
          </button>
          <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={endRide}>
            <i className="ti ti-flag"></i> End Ride
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title"><i className="ti ti-route"></i>Live Route</div></div>
          <div className="card-body" style={{ padding: '8px' }}>
            <div className="map-area" style={{ minHeight: '180px' }}>
              <div className="map-grid"></div>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 300 180">
                <polyline points="40,140 80,110 120,90 160,70 200,55 240,45" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="6,3" strokeLinecap="round" />
                <circle cx="40" cy="140" r="6" fill="var(--info)" />
                <circle cx="240" cy="45" r="6" fill="var(--primary)" />
              </svg>
              <div style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '11px', fontWeight: 600, background: 'rgba(255,255,255,0.9)', padding: '3px 8px', borderRadius: '6px' }}>
                ★ You are here
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="ti ti-info-circle"></i>Ride Details</div></div>
          <div className="card-body">
            <table style={{ fontSize: '13px' }}>
              <tbody>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Vehicle ID</td><td style={{ textAlign: 'right' }}>BK-07</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Pickup Zone</td><td style={{ textAlign: 'right' }}>Zone B – Park East</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Started</td><td style={{ textAlign: 'right' }}>{fmtStart}</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Rate</td><td style={{ textAlign: 'right' }}>$0.12/min</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Max Battery</td><td style={{ textAlign: 'right' }}>N/A (manual bike)</td></tr>
              </tbody>
            </table>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '12px', fontSize: '12px' }} onClick={() => setShowIssueModal(true)}>
              <i className="ti ti-alert-triangle"></i> Report an Issue
            </button>
          </div>
        </div>
      </div>

      {showIssueModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-title"><i className="ti ti-alert-triangle" style={{ color: 'var(--accent)', fontSize: '20px' }}></i> Report Issue</div>
            <div className="form-group"><label className="form-label">Issue Type</label>
              <select className="form-control"><option>Mechanical</option><option>Locked/Can't Start</option><option>GPS Error</option></select>
            </div>
            <div className="form-group"><label className="form-label">Details</label>
              <textarea className="form-control" rows="3" placeholder="Describe what's happening…"></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowIssueModal(false)}>Cancel</button>
              <button className="btn btn-warning" onClick={() => setShowIssueModal(false)}><i className="ti ti-send"></i> Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
