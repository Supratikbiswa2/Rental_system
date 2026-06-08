import { useState, useEffect } from 'react';
import './index.css';
import { supabase } from './supabaseClient';

import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import LiveMap from './components/LiveMap';
import Booking from './components/Booking';
import ActiveRide from './components/ActiveRide';
import RideHistory from './components/RideHistory';
import Payment from './components/Payment';
import Maintenance from './components/Maintenance';
import Support from './components/Support';
import Profile from './components/Profile';

const pageTitles = {
  dashboard:  'Dashboard',
  vehicles:   'Fleet Vehicles',
  map:        'Live Map',
  booking:    'Book a Ride',
  activeride: 'Active Ride',
  history:    'Ride History',
  payment:    'Payments & Billing',
  maintenance:'Maintenance',
  support:    'Customer Support',
  profile:    'My Profile',
};

export default function App() {
  const [user,         setUser]         = useState(null);   // ← stores real user object
  const [authLoading,  setAuthLoading]  = useState(true);   // ← wait for Supabase to check session
  const [page,         setPage]         = useState('dashboard');
  const [bookingModal, setBookingModal] = useState(false);

  // ── On mount: restore existing session + listen for auth changes ─────────
  useEffect(() => {
    // 1. Check if user is already logged in (page refresh / OAuth redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // 2. Listen for login / logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── While Supabase checks for an existing session, show a loader ─────────
  if (authLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', gap: '10px', color: '#6b7280', fontFamily: 'system-ui',
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <i className="ti ti-loader-2" style={{ fontSize: '24px', animation: 'spin 1s linear infinite' }}></i>
        Loading…
      </div>
    );
  }

  // ── Not logged in → show login screen ────────────────────────────────────
  if (!user) {
    return <LoginPage onLogin={setUser} />;   // ← onLogin now receives the user object
  }

  // ── Logged in → render the app ────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <Dashboard onNavigate={setPage} />;
      case 'vehicles':   return <Vehicles onNavigate={setPage} />;
      case 'map':        return <LiveMap />;
      case 'booking':    return <Booking onBookingConfirmed={() => setBookingModal(true)} />;
      case 'activeride': return <ActiveRide onNavigate={setPage} />;
      case 'history':    return <RideHistory />;
      case 'payment':    return <Payment />;
      case 'maintenance':return <Maintenance />;
      case 'support':    return <Support />;
      case 'profile':    return <Profile user={user} />;   // ✅ user is always defined here
      default:           return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={page} onNavigate={setPage} user={user} />
      <div className="main-area">
        <div className="topbar">
          <div className="topbar-title">{pageTitles[page]}</div>
          <div className="topbar-actions">
            <button className="btn btn-sm"><i className="ti ti-bell"></i></button>
            <button className="btn btn-sm btn-primary" onClick={() => setPage('booking')}>
              <i className="ti ti-plus"></i> New Rental
            </button>
          </div>
        </div>
        <div className="content">
          {renderPage()}
        </div>
      </div>

      {/* Booking Confirm Modal */}
      {bookingModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-title" style={{ color: 'var(--primary)' }}>
              <i className="ti ti-circle-check" style={{ fontSize: '22px' }}></i> Booking Confirmed!
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Your rental has been booked. A confirmation has been sent to {user.email}
            </p>
            <table style={{ fontSize: '13px', width: '100%' }}>
              <tbody>
                <tr><td style={{ color: 'var(--text-muted)', padding: '4px 0' }}>Booking ID</td><td style={{ textAlign: 'right', fontWeight: 600 }}>#1043</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '4px 0' }}>Vehicle</td><td style={{ textAlign: 'right' }}>City Bike</td></tr>
                <tr><td style={{ color: 'var(--text-muted)', padding: '4px 0' }}>QR Unlock Code</td><td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>VR-4821-XK</td></tr>
              </tbody>
            </table>
            <div className="modal-footer">
              <button className="btn" onClick={() => setBookingModal(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setBookingModal(false); setPage('activeride'); }}>
                <i className="ti ti-player-play"></i> Start Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}