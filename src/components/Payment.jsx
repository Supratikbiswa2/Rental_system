import { useState } from 'react';
import { billingHistory } from '../data';

const methods = [
  { icon: 'ti-credit-card', name: 'Visa •••• 4821', desc: 'Expires 09/27 · Default' },
  { icon: 'ti-brand-mastercard', name: 'Mastercard •••• 7530', desc: 'Expires 03/26' },
  { icon: 'ti-device-mobile', name: 'Google Pay', desc: 'Mobile wallet linked' },
  { icon: 'ti-brand-paypal', name: 'PayPal', desc: 'alex@velodemo.com' },
];

export default function Payment() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid-2">
      <div>
        <div className="card" style={{ marginBottom: '14px' }}>
          <div className="card-header">
            <div className="card-title"><i className="ti ti-wallet"></i>Payment Methods</div>
            <button className="btn btn-sm btn-primary" onClick={() => alert('Add Card modal (PCI-compliant)')}>
              <i className="ti ti-plus"></i> Add
            </button>
          </div>
          <div className="card-body">
            {methods.map((m, i) => (
              <div key={i} className={`payment-method${selected === i ? ' selected' : ''}`} onClick={() => setSelected(i)}>
                <i className={`ti ${m.icon}`}></i>
                <div className="payment-method-info">
                  <div className="payment-method-name">{m.name}</div>
                  <div className="payment-method-desc">{m.desc}</div>
                </div>
                <div className="payment-check">
                  {selected === i && <i className="ti ti-check" style={{ fontSize: '11px', color: '#fff' }}></i>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="ti ti-tag"></i>Active Promo Codes</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: 'var(--primary-pale)', borderRadius: '8px', marginBottom: '8px' }}>
              <i className="ti ti-discount-2" style={{ color: 'var(--primary)', fontSize: '20px' }}></i>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>VELO20</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>20% off next ride · Expires Jun 30</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: 'var(--accent-pale)', borderRadius: '8px' }}>
              <i className="ti ti-gift" style={{ color: '#85500b', fontSize: '20px' }}></i>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>WELCOME10</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>$10 credit · First 3 uses remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title"><i className="ti ti-receipt"></i>Billing History</div></div>
        <div className="card-body" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>Date</th><th>Description</th><th>Method</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {billingHistory.map((b, i) => (
                <tr key={i}>
                  <td>{b.date}</td>
                  <td>{b.desc}</td>
                  <td>{b.method}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{b.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
