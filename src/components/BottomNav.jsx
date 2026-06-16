export default function BottomNav({ activePage, onNavigate }) {
  const items = [
    { page: 'dashboard',  icon: 'ti-dashboard',     label: 'Home'    },
    { page: 'vehicles',   icon: 'ti-bike',           label: 'Vehicles'},
    { page: 'map',        icon: 'ti-map-pin',        label: 'Map'     },
    { page: 'booking',    icon: 'ti-calendar-plus',  label: 'Book'    },
    { page: 'profile',    icon: 'ti-user-circle',    label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.page}
          className={`bottom-nav-item${activePage === item.page ? ' active' : ''}`}
          onClick={() => onNavigate(item.page)}
          style={{ position: 'relative' }}
        >
          <i className={`ti ${item.icon}`}></i>
          {item.label}
        </button>
      ))}
    </nav>
  );
}