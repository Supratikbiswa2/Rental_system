export default function Maintenance() {
  const queue = [
    { icon: 'ti-alert-triangle', cls: 'maint-urgent', title: 'BK-03 — Flat Tire', sub: 'Reported by user · Jun 6, 8:14 AM', badge: 'badge-red', badgeLabel: 'Urgent' },
    { icon: 'ti-tool', cls: 'maint-normal', title: 'SC-07 — Battery Replacement', sub: 'Battery at 12% · Scheduled for today', badge: 'badge-amber', badgeLabel: 'Today' },
    { icon: 'ti-settings', cls: 'maint-normal', title: 'BK-11 — Brake Adjustment', sub: 'Routine service due · Jun 8', badge: 'badge-amber', badgeLabel: 'Soon' },
    { icon: 'ti-check', cls: 'maint-done', title: 'SC-02 — Chain Lubrication', sub: 'Completed · Jun 5, 3:00 PM', badge: 'badge-green', badgeLabel: 'Done' },
  ];

  const stats = [
    { label: 'Fleet Health', value: 88, cls: 'prog-green' },
    { label: 'On-time Service Rate', value: 72, cls: 'prog-amber' },
  ];

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ti ti-tool"></i>Maintenance Queue</div>
          <span className="badge badge-red">3 urgent</span>
        </div>
        <div className="card-body">
          {queue.map((q, i) => (
            <div key={i} className="maintenance-item">
              <div className={`maintenance-icon ${q.cls}`}><i className={`ti ${q.icon}`} style={{ fontSize: '18px' }}></i></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{q.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{q.sub}</div>
                <div style={{ marginTop: '4px' }}><span className={`badge ${q.badge}`}>{q.badgeLabel}</span></div>
              </div>
              <button className="btn btn-sm">Assign</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: '14px' }}>
          <div className="card-header"><div className="card-title"><i className="ti ti-chart-pie"></i>Fleet Health</div></div>
          <div className="card-body">
            {stats.map((s, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontWeight: 600 }}>{s.value}%</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${s.cls}`} style={{ width: `${s.value}%` }}></div>
                </div>
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '8px', textAlign: 'center', fontSize: '12px' }}>
              <div style={{ background: 'var(--primary-pale)', borderRadius: '8px', padding: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '20px', color: 'var(--primary)' }}>18</div>
                <div style={{ color: 'var(--text-muted)' }}>Operational</div>
              </div>
              <div style={{ background: 'var(--accent-pale)', borderRadius: '8px', padding: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '20px', color: 'var(--accent)' }}>3</div>
                <div style={{ color: 'var(--text-muted)' }}>In Service</div>
              </div>
              <div style={{ background: 'var(--danger-pale)', borderRadius: '8px', padding: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '20px', color: 'var(--danger)' }}>1</div>
                <div style={{ color: 'var(--text-muted)' }}>Critical</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title"><i className="ti ti-calendar"></i>Next Scheduled</div></div>
          <div className="card-body" style={{ padding: 0 }}>
            <table>
              <thead><tr><th>Vehicle</th><th>Task</th><th>Date</th></tr></thead>
              <tbody>
                <tr><td>BK-01</td><td>Tune-up</td><td>Jun 10</td></tr>
                <tr><td>SC-01</td><td>Battery Check</td><td>Jun 11</td></tr>
                <tr><td>BK-12</td><td>Brake Service</td><td>Jun 13</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
