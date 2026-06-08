import { weekData, recentRentals } from '../data';

const statusMap = {
  completed: { cls: 'badge-green', label: 'Completed' },
  active: { cls: 'badge-amber', label: 'Active' },
  cancelled: { cls: 'badge-red', label: 'Cancelled' },
};

const max = Math.max(...weekData.map(d => d.value));

export default function Dashboard({ onNavigate }) {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card stat-green">
          <div className="stat-label"><i className="ti ti-bike"></i> Available Vehicles</div>
          <div className="stat-value">18</div>
          <div className="stat-sub">12 bikes · 6 scooters</div>
        </div>
        <div className="stat-card stat-amber">
          <div className="stat-label"><i className="ti ti-player-play"></i> Active Rentals</div>
          <div className="stat-value">6</div>
          <div className="stat-sub">4 bikes · 2 scooters</div>
        </div>
        <div className="stat-card stat-blue">
          <div className="stat-label"><i className="ti ti-currency-dollar"></i> Today's Revenue</div>
          <div className="stat-value">$284</div>
          <div className="stat-sub">↑ 12% vs yesterday</div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-label"><i className="ti ti-tool"></i> Under Maintenance</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Due back in 2h</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '16px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ti ti-chart-bar"></i>Weekly Rentals</div>
          </div>
          <div className="card-body">
            <div className="chart-bars">
              {weekData.map((d, i) => (
                <div
                  key={i}
                  className={`chart-bar${d.active ? ' active' : ''}`}
                  style={{ height: `${Math.round(d.value / max * 100)}%` }}
                  title={`${d.value} rides`}
                />
              ))}
            </div>
            <div className="chart-labels">
              {weekData.map((d, i) => <div key={i} className="chart-label">{d.day}</div>)}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ti ti-bell"></i>Recent Notifications</div>
          </div>
          <div className="card-body" style={{ padding: '8px 16px' }}>
            <div className="notif">
              <div className="notif-icon green"><i className="ti ti-check" style={{ fontSize: '14px' }}></i></div>
              <div className="notif-text"><div className="notif-msg">Rental #1042 completed — $18.50 charged</div><div className="notif-time">2 min ago</div></div>
              <div className="notif-dot"></div>
            </div>
            <div className="notif">
              <div className="notif-icon amber"><i className="ti ti-battery-1" style={{ fontSize: '14px' }}></i></div>
              <div className="notif-text"><div className="notif-msg">Scooter SC-07 battery at 12%</div><div className="notif-time">15 min ago</div></div>
              <div className="notif-dot"></div>
            </div>
            <div className="notif">
              <div className="notif-icon blue"><i className="ti ti-calendar" style={{ fontSize: '14px' }}></i></div>
              <div className="notif-text"><div className="notif-msg">New reservation for tomorrow 9:00 AM</div><div className="notif-time">1 hr ago</div></div>
            </div>
            <div className="notif">
              <div className="notif-icon red"><i className="ti ti-alert-triangle" style={{ fontSize: '14px' }}></i></div>
              <div className="notif-text"><div className="notif-msg">BK-03 reported issue: flat tire</div><div className="notif-time">3 hrs ago</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ti ti-activity"></i>Recent Rentals</div>
          <button className="btn btn-sm" onClick={() => onNavigate('history')}>View All</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>ID</th><th>User</th><th>Vehicle</th><th>Start</th><th>Duration</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentRentals.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.user}</td>
                  <td>
                    <i className={`ti ${r.type === 'bike' ? 'ti-bike' : 'ti-scooter'}`}
                      style={{ color: r.type === 'bike' ? 'var(--info)' : 'var(--primary)' }}></i> {r.vehicle}
                  </td>
                  <td>{r.start}</td>
                  <td>{r.duration}</td>
                  <td>{r.amount}</td>
                  <td><span className={`badge ${statusMap[r.status]?.cls}`}>{statusMap[r.status]?.label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
