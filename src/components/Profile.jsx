import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Profile({ user }) {
  // ── State ──────────────────────────────────────────────────────────────
  const [profile,     setProfile]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [editMode,    setEditMode]    = useState(false);
  const [saveMsg,     setSaveMsg]     = useState('');   // success/error feedback
  const [prefs,       setPrefs]       = useState({
    emailNotifications: true,
    pushNotifications:  true,
    marketingEmails:    false,
    darkMode:           false,
  });

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [phone,    setPhone]    = useState('');
  const [city,     setCity]     = useState('');

  // ── Derived display values ─────────────────────────────────────────────
  const email      = user?.email ?? '—';
  const avatarText = fullName
    ? fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : email.slice(0, 2).toUpperCase();

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  // ── Load profile from Supabase on mount ───────────────────────────────
  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = row not found (first login, profile not created yet)
      console.error('Error fetching profile:', error.message);
    }

    if (data) {
      setProfile(data);
      setFullName(data.full_name ?? user.user_metadata?.full_name ?? '');
      setPhone(data.phone ?? '');
      setCity(data.city ?? '');
      setPrefs({
        emailNotifications: data.pref_email_notifications ?? true,
        pushNotifications:  data.pref_push_notifications  ?? true,
        marketingEmails:    data.pref_marketing_emails    ?? false,
        darkMode:           data.pref_dark_mode           ?? false,
      });
    } else {
      // No profile row yet — prefill from OAuth metadata if available
      setFullName(user.user_metadata?.full_name ?? user.user_metadata?.name ?? '');
    }

    setLoading(false);
  };

  // ── Save profile changes ───────────────────────────────────────────────
  const saveProfile = async () => {
    setSaving(true);
    setSaveMsg('');

    const updates = {
      id:                       user.id,
      full_name:                fullName.trim(),
      phone:                    phone.trim(),
      city:                     city.trim(),
      pref_email_notifications: prefs.emailNotifications,
      pref_push_notifications:  prefs.pushNotifications,
      pref_marketing_emails:    prefs.marketingEmails,
      pref_dark_mode:           prefs.darkMode,
      updated_at:               new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updates);           // upsert = insert if not exists, update if exists

    setSaving(false);

    if (error) {
      setSaveMsg('error:' + error.message);
    } else {
      setSaveMsg('success:Profile saved successfully!');
      setEditMode(false);
      fetchProfile();             // re-fetch to confirm saved values
    }

    setTimeout(() => setSaveMsg(''), 4000);
  };

  // ── Cancel edit ────────────────────────────────────────────────────────
  const cancelEdit = () => {
    setFullName(profile?.full_name ?? '');
    setPhone(profile?.phone ?? '');
    setCity(profile?.city ?? '');
    setEditMode(false);
    setSaveMsg('');
  };

  // ── Toggle preference ──────────────────────────────────────────────────
  const togglePref = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Sign out ───────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // App.jsx's onAuthStateChange listener will set user to null automatically
  };

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)', gap: '10px' }}>
        <i className="ti ti-loader-2" style={{ fontSize: '22px', animation: 'spin 1s linear infinite' }}></i>
        Loading profile…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div>

      {/* Save message banner */}
      {saveMsg && (
        <div style={{
          marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '8px',
          background: saveMsg.startsWith('success') ? 'var(--primary-pale)' : 'var(--danger-pale)',
          color:      saveMsg.startsWith('success') ? 'var(--primary)'      : 'var(--danger)',
          border:     `1px solid ${saveMsg.startsWith('success') ? 'var(--primary)' : 'var(--danger)'}`,
        }}>
          <i className={`ti ${saveMsg.startsWith('success') ? 'ti-circle-check' : 'ti-alert-circle'}`}
            style={{ fontSize: '16px', flexShrink: 0 }}></i>
          {saveMsg.split(':')[1]}
        </div>
      )}

      {/* Profile header */}
      <div className="profile-header">
        <div className="profile-avatar">{avatarText}</div>
        <div style={{ flex: 1 }}>
          <div className="profile-name">{fullName || email}</div>
          <div className="profile-since">Member since {memberSince}</div>
          <div className="profile-badges">
            <span className="profile-badge">⭐ Premium</span>
            <span className="profile-badge">🚲 Eco Rider</span>
            <span className="profile-badge">🏆 Top User</span>
          </div>
        </div>
        {/* Sign out button */}
        <button
          className="btn btn-sm"
          onClick={handleSignOut}
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}
        >
          <i className="ti ti-logout"></i> Sign Out
        </button>
      </div>

      <div className="grid-2">

        {/* ── Personal Info card ────────────────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ti ti-user"></i>Personal Info</div>
            {!editMode ? (
              <button className="btn btn-sm" onClick={() => setEditMode(true)}>
                <i className="ti ti-pencil"></i> Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-sm" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </button>
                <button className="btn btn-sm btn-primary" onClick={saveProfile} disabled={saving}>
                  {saving
                    ? <><i className="ti ti-loader-2" style={{ animation: 'spin 1s linear infinite' }}></i> Saving…</>
                    : <><i className="ti ti-check"></i> Save</>
                  }
                </button>
              </div>
            )}
          </div>
          <div className="card-body">

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your full name"
                disabled={!editMode}
                style={{ background: editMode ? 'var(--surface)' : 'var(--bg)', cursor: editMode ? 'text' : 'default' }}
              />
            </div>

            {/* Email — always read-only, comes from Supabase Auth */}
            <div className="form-group">
              <label className="form-label">
                Email
                <span style={{ marginLeft: '6px', fontSize: '10px', background: 'var(--info-pale)', color: 'var(--info)', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                  verified
                </span>
              </label>
              <input
                className="form-control"
                value={email}
                disabled
                style={{ background: 'var(--bg)', cursor: 'default', color: 'var(--text-muted)' }}
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 000-0000"
                disabled={!editMode}
                style={{ background: editMode ? 'var(--surface)' : 'var(--bg)', cursor: editMode ? 'text' : 'default' }}
              />
            </div>

            {/* City */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City</label>
              <input
                className="form-control"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                disabled={!editMode}
                style={{ background: editMode ? 'var(--surface)' : 'var(--bg)', cursor: editMode ? 'text' : 'default' }}
              />
            </div>

          </div>
        </div>

        <div>
          {/* ── Ride Stats card ─────────────────────────────────────────── */}
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-header">
              <div className="card-title"><i className="ti ti-chart-bar"></i>Ride Stats</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center' }}>
                {[
                  { val: '47',      label: 'Total Rides' },
                  { val: '184 km',  label: 'Distance' },
                  { val: '38h 20m', label: 'Time Riding' },
                  { val: '$312',    label: 'Total Spent' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'var(--bg)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '20px', color: 'var(--primary)' }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Preferences card ────────────────────────────────────────── */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="ti ti-settings"></i>Preferences</div>
              {Object.values(prefs).some((v, i) => {
                const keys = Object.keys(prefs);
                const originals = {
                  emailNotifications: profile?.pref_email_notifications ?? true,
                  pushNotifications:  profile?.pref_push_notifications  ?? true,
                  marketingEmails:    profile?.pref_marketing_emails    ?? false,
                  darkMode:           profile?.pref_dark_mode           ?? false,
                };
                return prefs[keys[i]] !== originals[keys[i]];
              }) && (
                <button className="btn btn-sm btn-primary" onClick={saveProfile} disabled={saving}>
                  <i className="ti ti-check"></i> Save
                </button>
              )}
            </div>
            <div className="card-body">
              {[
                { key: 'emailNotifications', label: 'Email Notifications' },
                { key: 'pushNotifications',  label: 'Push Notifications'  },
                { key: 'marketingEmails',    label: 'Marketing Emails'    },
                { key: 'darkMode',           label: 'Dark Mode'           },
              ].map((p, i, arr) => (
                <div
                  key={p.key}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '13px' }}>{p.label}</span>

                  {/* Toggle switch */}
                  <div
                    onClick={() => togglePref(p.key)}
                    style={{
                      width: '36px', height: '20px', borderRadius: '10px', position: 'relative',
                      cursor: 'pointer', transition: 'background 0.2s',
                      background: prefs[p.key] ? 'var(--primary)' : '#d1d5db',
                    }}
                  >
                    <div style={{
                      width: '16px', height: '16px', background: '#fff', borderRadius: '50%',
                      position: 'absolute', top: '2px', transition: 'left 0.2s',
                      left: prefs[p.key] ? '18px' : '2px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}