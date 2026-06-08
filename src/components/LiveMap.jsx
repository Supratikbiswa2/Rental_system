import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── Fix Leaflet's broken default icon paths in React ──────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Static vehicle data ────────────────────────────────────────────────────
// Change these lat/lng to your actual city coordinates
const vehicleData = [
  { id: 'BK-01', type: 'bike',    status: 'available', loc: 'Zone A', bat: null, lat: 22.507351, lng: 88.399250 },
  { id: 'BK-07', type: 'bike',    status: 'active',    loc: 'Zone B', bat: null, lat: 22.515173, lng: 88.392944 },
  { id: 'BK-11', type: 'bike',    status: 'available', loc: 'Zone C', bat: null, lat: 22.518320, lng: 88.418634 },
  { id: 'SC-02', type: 'scooter', status: 'available', loc: 'Zone A', bat: 45,   lat: 22.513080, lng: 88.403686 },
  { id: 'SC-04', type: 'scooter', status: 'available', loc: 'Zone C', bat: 78,   lat: 22.519978, lng: 88.401347 },
  { id: 'SC-07', type: 'scooter', status: 'lowbat',    loc: 'Zone D', bat: 12,   lat: 22.505827, lng: 88.414900 },
  { id: 'BK-05', type: 'bike',    status: 'active',    loc: 'Zone B', bat: null, lat: 22.512022, lng: 88.416338 },
];

// ── Color per status ───────────────────────────────────────────────────────
const markerColor = {
  available: (type) => type === 'bike' ? '#378ADD' : '#1D9E75',
  active:    ()     => '#EF9F27',
  lowbat:    ()     => '#E24B4A',
};

const statusBadge = { available: 'badge-green', active: 'badge-amber', lowbat: 'badge-red' };
const statusLabel = { available: 'Available',   active: 'Active',      lowbat: 'Low Battery' };
const batClass    = (b) => b > 60 ? 'battery-high' : b > 25 ? 'battery-mid' : 'battery-low';

// ── Build a custom circular SVG icon for each vehicle ─────────────────────
const makeIcon = (vehicle) => {
  const color  = markerColor[vehicle.status]?.(vehicle.type) ?? '#888';
  const emoji  = vehicle.type === 'bike' ? '🚲' : '🛴';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="19" fill="${color}" stroke="white" stroke-width="3"
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))"/>
      <text x="21" y="27" text-anchor="middle" font-size="18">${emoji}</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',          // wipe Leaflet's default white box
    iconSize:    [42, 42],
    iconAnchor:  [21, 21],
    popupAnchor: [0, -22],
  });
};

// ── Helper: fly to a vehicle from the table ────────────────────────────────
// Must be rendered inside <MapContainer> to access the map instance
function FlyTo({ target }) {
  const map = useMap();
  if (target) map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
  return null;
}

// ── Map tile layers (all free, no API key) ─────────────────────────────────
const tileLayers = {
  streets: {
    label: 'Streets',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  topo: {
    label: 'Topo',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
  cycle: {
    label: 'Cycle',
    url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | CyclOSM',
  },
};

export default function LiveMap() {
  const [selected,    setSelected]    = useState(null);
  const [flyTarget,   setFlyTarget]   = useState(null);
  const [activeStyle, setActiveStyle] = useState('streets');

  const CENTER = [22.517200, 88.418747]; // change to your city center

  const handleRowClick = (v) => {
    setSelected(v);
    setFlyTarget(v);
    // Reset flyTarget next tick so clicking same row again still triggers FlyTo
    setTimeout(() => setFlyTarget(null), 100);
  };

  const tl = tileLayers[activeStyle];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── TOP ROW: Map + Detail panel ─────────────────────────────────── */}
      <div className="grid-2" style={{ alignItems: 'start' }}>

        {/* MAP CARD */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ti ti-map"></i>Live Fleet Map</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

              {/* Style switcher */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {Object.entries(tileLayers).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setActiveStyle(key)}
                    style={{
                      padding: '3px 9px', borderRadius: '6px', fontSize: '11px',
                      cursor: 'pointer', border: '1px solid var(--border)',
                      background: activeStyle === key ? 'var(--primary)' : 'var(--surface)',
                      color:      activeStyle === key ? '#fff'            : 'var(--text)',
                    }}
                  >
                    {val.label}
                  </button>
                ))}
              </div>

              <span className="badge badge-green">Live</span>
            </div>
          </div>

          <div className="card-body" style={{ padding: '8px' }}>
            {/* Leaflet map */}
            <MapContainer
              center={CENTER}
              zoom={14}
              style={{ height: '380px', width: '100%', borderRadius: '8px' }}
              scrollWheelZoom={true}
            >
              <TileLayer url={tl.url} attribution={tl.attribution} />

              {/* FlyTo helper — only active when a row is clicked */}
              {flyTarget && <FlyTo target={flyTarget} />}

              {vehicleData.map(v => (
                <Marker
                  key={v.id}
                  position={[v.lat, v.lng]}
                  icon={makeIcon(v)}
                  eventHandlers={{
                    click: () => setSelected(v),
                  }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'system-ui', minWidth: '130px' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                        {v.type === 'bike' ? '🚲' : '🛴'} {v.id}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>{v.loc}</div>

                      {v.bat !== null && (
                        <div style={{ marginBottom: '6px' }}>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '3px' }}>
                            Battery — {v.bat}%
                          </div>
                          <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
                            <div style={{
                              height: '100%',
                              width: `${v.bat}%`,
                              borderRadius: '3px',
                              background: v.bat > 60 ? '#1D9E75' : v.bat > 25 ? '#EF9F27' : '#E24B4A',
                            }} />
                          </div>
                        </div>
                      )}

                      <div style={{
                        display: 'inline-block', padding: '2px 9px', borderRadius: '12px',
                        fontSize: '11px', fontWeight: 600,
                        background: v.status === 'available' ? '#E1F5EE' : v.status === 'active' ? '#FAEEDA' : '#FCEBEB',
                        color:      v.status === 'available' ? '#0F6E56' : v.status === 'active' ? '#85500b'  : '#E24B4A',
                      }}>
                        {statusLabel[v.status]}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '14px', padding: '10px 4px 2px', flexWrap: 'wrap' }}>
              {[
                { color: '#378ADD', label: 'Bike — available' },
                { color: '#1D9E75', label: 'Scooter — available' },
                { color: '#EF9F27', label: 'In use' },
                { color: '#E24B4A', label: 'Low battery' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div className="card" style={{ minHeight: '380px' }}>
          <div className="card-header">
            <div className="card-title"><i className="ti ti-info-circle"></i>Vehicle Detail</div>
            {selected && (
              <button className="btn btn-sm" onClick={() => setSelected(null)}>
                <i className="ti ti-x"></i>
              </button>
            )}
          </div>
          <div className="card-body">
            {!selected ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>Click any marker on the map</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>or a row in the table below</div>
              </div>
            ) : (
              <div>
                {/* Hero */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, #0a4a38 100%)',
                  borderRadius: '10px', padding: '16px', color: '#fff',
                  display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px',
                }}>
                  <div style={{ fontSize: '44px' }}>{selected.type === 'bike' ? '🚲' : '🛴'}</div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{selected.id}</div>
                    <div style={{ fontSize: '12px', opacity: 0.75 }}>{selected.loc}</div>
                    <span style={{
                      display: 'inline-block', marginTop: '6px', padding: '2px 10px',
                      borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      background: 'rgba(255,255,255,0.2)',
                    }}>
                      {statusLabel[selected.status]}
                    </span>
                  </div>
                </div>

                {/* Info rows */}
                <table style={{ fontSize: '13px', width: '100%' }}>
                  <tbody>
                    {[
                      ['Type',    <span style={{ textTransform: 'capitalize' }}>{selected.type}</span>],
                      ['Zone',    selected.loc],
                      ['Status',  <span className={`badge ${statusBadge[selected.status]}`}>{statusLabel[selected.status]}</span>],
                      ['Coordinates', (
                        <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                          {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                        </span>
                      )],
                    ].map(([label, val]) => (
                      <tr key={label}>
                        <td style={{ color: 'var(--text-muted)', padding: '6px 0' }}>{label}</td>
                        <td style={{ textAlign: 'right', fontWeight: 500 }}>{val}</td>
                      </tr>
                    ))}

                    {selected.bat !== null && (
                      <tr>
                        <td style={{ color: 'var(--text-muted)', padding: '6px 0' }}>Battery</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                            <div className={`battery-bar ${batClass(selected.bat)}`} style={{ width: '80px' }}>
                              <div className="battery-fill" style={{ width: `${selected.bat}%` }} />
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '12px' }}>{selected.bat}%</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                  disabled={selected.status !== 'available'}
                >
                  <i className="ti ti-calendar-plus"></i>
                  {selected.status === 'available' ? 'Book This Vehicle' : 'Not Available Right Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Status table ─────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ti ti-list"></i>Vehicle Status</div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {vehicleData.length} vehicles · click a row to locate
          </span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Type</th><th>Battery</th>
                <th>Status</th><th>Location</th><th>Coordinates</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.map(v => (
                <tr
                  key={v.id}
                  onClick={() => handleRowClick(v)}
                  style={{
                    cursor: 'pointer',
                    background: selected?.id === v.id ? 'var(--primary-pale)' : '',
                  }}
                >
                  <td style={{ fontWeight: 600 }}>{v.type === 'bike' ? '🚲' : '🛴'} {v.id}</td>
                  <td style={{ textTransform: 'capitalize' }}>{v.type}</td>
                  <td>
                    {v.bat !== null ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div className={`battery-bar ${batClass(v.bat)}`} style={{ width: '60px' }}>
                          <div className="battery-fill" style={{ width: `${v.bat}%` }} />
                        </div>
                        <span style={{ fontSize: '11px' }}>{v.bat}%</span>
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td><span className={`badge ${statusBadge[v.status]}`}>{statusLabel[v.status]}</span></td>
                  <td>{v.loc}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {v.lat.toFixed(3)}, {v.lng.toFixed(3)}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={e => { e.stopPropagation(); handleRowClick(v); }}
                    >
                      <i className="ti ti-crosshair"></i> Locate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}