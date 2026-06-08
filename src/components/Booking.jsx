import { useState } from 'react';

const durations = [
  { label: '30 min — $3.00', price: 3.00, hours: 0.5 },
  { label: '1 hour — $5.50', price: 5.50, hours: 1 },
  { label: '2 hours — $9.00', price: 9.00, hours: 2 },
  { label: 'Half day (4h) — $15.00', price: 15.00, hours: 4 },
  { label: 'Full day (8h) — $25.00', price: 25.00, hours: 8 },
];

export default function Booking({ onBookingConfirmed }) {
  const today = new Date().toISOString().split('T')[0];
  const [vehicleType, setVehicleType] = useState('🚲 City Bike');
  const [zone, setZone] = useState('Zone A – City Center');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('09:00');
  const [durIdx, setDurIdx] = useState(3);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const base = durations[durIdx].price;
  const tax = +(base * 0.08).toFixed(2);
  const discount = promoApplied ? +(base * 0.2).toFixed(2) : 0;
  const total = (base + tax - discount).toFixed(2);

  const applyPromo = () => {
    if (promo.toUpperCase() === 'VELO20') setPromoApplied(true);
    else alert('Invalid promo code.');
  };

  const mapPins = [
    { cls: 'pin-bike', left: '30%', top: '35%', label: 'BK-01 (0.2km)' },
    { cls: 'pin-bike', left: '55%', top: '55%', label: 'BK-11 (0.5km)' },
    { cls: 'pin-scooter', left: '70%', top: '30%', label: 'SC-04 (0.8km)' },
  ];

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ti ti-calendar-plus"></i>New Rental Booking</div>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <select className="form-control" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
              <option>🚲 City Bike</option>
              <option>🚲 Mountain Bike</option>
              <option>🛴 Electric Scooter</option>
              <option>🛴 Premium Scooter</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Pickup Location</label>
            <select className="form-control" value={zone} onChange={e => setZone(e.target.value)}>
              <option>Zone A – City Center</option>
              <option>Zone B – Park East</option>
              <option>Zone C – Downtown</option>
              <option>Zone D – Waterfront</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input className="form-control" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Rental Duration</label>
            <select className="form-control" value={durIdx} onChange={e => setDurIdx(Number(e.target.value))}>
              {durations.map((d, i) => <option key={i} value={i}>{d.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Promo Code</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input className="form-control" type="text" placeholder="e.g. VELO20" value={promo} onChange={e => setPromo(e.target.value)} />
              <button className="btn btn-sm" onClick={applyPromo}>Apply</button>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onBookingConfirmed}>
            <i className="ti ti-check"></i> Confirm Booking
          </button>
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: '14px' }}>
          <div className="card-header"><div className="card-title">Booking Summary</div></div>
          <div className="card-body">
            <table style={{ fontSize: '13px' }}>
              <tbody>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Vehicle</td><td style={{ textAlign: 'right', padding: '5px 0' }}>{vehicleType}</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Pickup Zone</td><td style={{ textAlign: 'right', padding: '5px 0' }}>{zone.split(' – ')[0]}</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Duration</td><td style={{ textAlign: 'right', padding: '5px 0' }}>{durations[durIdx].hours}h</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Base Rate</td><td style={{ textAlign: 'right', padding: '5px 0' }}>${base.toFixed(2)}</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '5px 0' }}>Tax (8%)</td><td style={{ textAlign: 'right', padding: '5px 0' }}>${tax}</td></tr>
                {promoApplied && (
                  <tr><td style={{ color: 'var(--primary)', padding: '5px 0' }}>Promo (20% off)</td><td style={{ textAlign: 'right', padding: '5px 0', color: 'var(--primary)' }}>-${discount.toFixed(2)}</td></tr>
                )}
                <tr><td colSpan="2"><div style={{ borderTop: '1px dashed var(--border)', margin: '6px 0' }}></div></td></tr>
                <tr>
                  <td style={{ fontWeight: 700, padding: '5px 0' }}>Total</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '16px', padding: '5px 0', color: 'var(--primary)' }}>${total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="ti ti-map"></i>Nearby Available</div></div>
          <div className="card-body" style={{ padding: '8px' }}>
            <div className="map-area" style={{ minHeight: '140px' }}>
              <div className="map-grid"></div>
              {mapPins.map(p => (
                <div key={p.label} className={`map-pin ${p.cls}`} style={{ left: p.left, top: p.top }}>
                  <div className="pin-dot"></div>
                  <div className="pin-label">{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
