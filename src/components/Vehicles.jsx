import { useState } from 'react';
import { vehicleData } from '../data';

const statusMap = {
  available: 'badge-green',
  'in-use': 'badge-amber',
  maintenance: 'badge-gray',
};
const statusLabel = {
  available: 'Available',
  'in-use': 'In Use',
  maintenance: 'Maintenance',
};

export default function Vehicles({ onNavigate }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = vehicleData.filter(v => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'available' && v.status === 'available') ||
      (filter === 'in-use' && v.status === 'in-use') ||
      (filter === 'maintenance' && v.status === 'maintenance') ||
      (filter === 'bike' && v.type === 'bike') ||
      (filter === 'scooter' && v.type === 'scooter');
    const matchSearch =
      !search ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.loc.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const chips = [
    { key: 'all', label: 'All (24)' },
    { key: 'available', label: 'Available' },
    { key: 'in-use', label: 'In Use' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'bike', label: 'Bikes' },
    { key: 'scooter', label: 'Scooters' },
  ];

  return (
    <div>
      <div className="search-bar">
        <i className="ti ti-search"></i>
        <input
          type="text"
          placeholder="Search by ID, model, location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="filter-chips">
        {chips.map(c => (
          <div key={c.key} className={`chip${filter === c.key ? ' active' : ''}`} onClick={() => setFilter(c.key)}>
            {c.label}
          </div>
        ))}
      </div>
      <div className="vehicle-grid">
        {filtered.map(v => {
          const batClass = v.bat > 60 ? 'battery-high' : v.bat > 25 ? 'battery-mid' : 'battery-low';
          return (
            <div className="vehicle-card" key={v.id}>
              <div className={`vehicle-card-img ${v.type}`}>{v.type === 'bike' ? '🚲' : '🛴'}</div>
              <div className="vehicle-card-body">
                <div className="vehicle-name">
                  {v.name} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>({v.id})</span>
                </div>
                <div className="vehicle-meta">
                  <span><i className="ti ti-map-pin"></i>{v.loc}</span>
                  <span><i className="ti ti-road"></i>{v.km} km</span>
                  {v.bat !== undefined && <span><i className="ti ti-battery"></i>{v.bat}%</span>}
                </div>
                {v.bat !== undefined && (
                  <div className={`battery-bar ${batClass}`}>
                    <div className="battery-fill" style={{ width: `${v.bat}%` }}></div>
                  </div>
                )}
                <div className="vehicle-footer">
                  <div className="vehicle-price">{v.price} <span>rental</span></div>
                  <span className={`badge ${statusMap[v.status] || 'badge-gray'}`}>{statusLabel[v.status]}</span>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                  onClick={() => onNavigate('booking')}
                >
                  <i className="ti ti-calendar-plus"></i> Book
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
