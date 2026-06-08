import { useState } from 'react';
import { rideHistory } from '../data';

const statusMap = {
  active: { cls: 'badge-amber', label: 'Active' },
  completed: { cls: 'badge-green', label: 'Completed' },
  cancelled: { cls: 'badge-red', label: 'Cancelled' },
};

export default function RideHistory() {
  const [tab, setTab] = useState('all');
  const [showReceipt, setShowReceipt] = useState(false);

  const filtered = rideHistory.filter(r => {
    if (tab === 'bike') return r.vehicle.includes('🚲');
    if (tab === 'scooter') return r.vehicle.includes('🛴');
    if (tab === 'cancelled') return r.status === 'cancelled';
    return true;
  });

  return (
    <div>
      <div className="tabs">
        {['all', 'bike', 'scooter', 'cancelled'].map(t => (
          <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'all' ? 'All Rides' : t === 'bike' ? 'Bikes' : t === 'scooter' ? 'Scooters' : 'Cancelled'}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>Ride ID</th><th>Vehicle</th><th>Date</th><th>Duration</th><th>Distance</th><th>Amount</th><th>Status</th><th>Receipt</th></tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.vehicle}</td>
                  <td>{r.date}</td>
                  <td>{r.duration}</td>
                  <td>{r.distance}</td>
                  <td>{r.amount}</td>
                  <td><span className={`badge ${statusMap[r.status].cls}`}>{statusMap[r.status].label}</span></td>
                  <td>
                    {r.status === 'completed' ? (
                      <button className="btn btn-sm" onClick={() => setShowReceipt(true)}><i className="ti ti-receipt"></i></button>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showReceipt && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-title">Receipt — Ride #1037</div>
            <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '14px', marginBottom: '14px', fontSize: '13px' }}>
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>VeloRide</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Invoice #INV-1037 · Jun 5, 2026</div>
              </div>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr><td style={{ color: 'var(--text-muted)', padding: '4px 0' }}>Vehicle</td><td style={{ textAlign: 'right' }}>SC-04 (Scooter)</td></tr>
                  <tr><td style={{ color: 'var(--text-muted)', padding: '4px 0' }}>Duration</td><td style={{ textAlign: 'right' }}>1h 12m</td></tr>
                  <tr><td style={{ color: 'var(--text-muted)', padding: '4px 0' }}>Distance</td><td style={{ textAlign: 'right' }}>8.4 km</td></tr>
                  <tr><td style={{ color: 'var(--text-muted)', padding: '4px 0' }}>Base Fare</td><td style={{ textAlign: 'right' }}>$12.00</td></tr>
                  <tr><td style={{ color: 'var(--text-muted)', padding: '4px 0' }}>Tax (8%)</td><td style={{ textAlign: 'right' }}>$0.96</td></tr>
                  <tr><td colSpan="2"><div style={{ borderTop: '1px dashed var(--border)', margin: '6px 0' }}></div></td></tr>
                  <tr><td style={{ fontWeight: 700 }}>Total Charged</td><td style={{ textAlign: 'right', fontWeight: 800, fontSize: '17px', color: 'var(--primary)' }}>$14.40</td></tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowReceipt(false)}>Close</button>
              <button className="btn btn-primary"><i className="ti ti-download"></i> Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
