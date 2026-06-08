export default function Sidebar({ activePage, onNavigate, user }) {

  // Derive display name and initials from real user
  const email       = user?.email ?? '';
  const metaName    = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? '';
  const displayName = metaName || email.split('@')[0];
  const initials    = metaName
    ? metaName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : email.slice(0, 2).toUpperCase();

  const navItem = (page, icon, label, badge, badgeRed) => (
    <button
      className={`nav-item${activePage === page ? ' active' : ''}`}
      onClick={() => onNavigate(page)}
    >
      <i className={`ti ${icon}`}></i> {label}
      {badge && <span className={`nav-badge${badgeRed ? ' nav-badge-red' : ''}`}>{badge}</span>}
    </button>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon"><i className="ti ti-scooter"></i></div>
          <div>
            <div className="logo-text">VeloRide</div>
            <div className="logo-sub">Rental System</div>
          </div>
        </div>
      </div>
      <div className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {navItem('dashboard',   'ti-dashboard',     'Dashboard')}
        {navItem('vehicles',    'ti-bike',          'Vehicles', '24')}
        {navItem('map',         'ti-map-pin',       'Live Map')}
        <div className="nav-section-label">Rentals</div>
        {navItem('booking',     'ti-calendar-plus', 'Book a Ride')}
        {navItem('activeride',  'ti-player-play',   'Active Ride')}
        {navItem('history',     'ti-history',       'Ride History')}
        <div className="nav-section-label">Account</div>
        {navItem('payment',     'ti-credit-card',   'Payments')}
        {navItem('maintenance', 'ti-tool',          'Maintenance')}
        {navItem('support',     'ti-headset',       'Support', '2', true)}
        {navItem('profile',     'ti-user-circle',   'Profile')}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={() => onNavigate('profile')}>
          <div className="avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-role">Premium Member</div>
          </div>
          <i className="ti ti-chevron-right" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}></i>
        </div>
      </div>
    </div>
  );
}