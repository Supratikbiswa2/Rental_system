export const vehicleData = [
  { id: 'BK-01', name: 'City Cruiser', type: 'bike', model: 'Trek FX3', status: 'available', loc: 'Zone A', price: '$1.50/hr', km: '1,240' },
  { id: 'BK-02', name: 'Mountain Pro', type: 'bike', model: 'Giant Talon', status: 'available', loc: 'Zone B', price: '$2.00/hr', km: '887' },
  { id: 'BK-03', name: 'Urban Glider', type: 'bike', model: 'Cannondale', status: 'maintenance', loc: 'Depot', price: '$1.50/hr', km: '2,105' },
  { id: 'BK-07', name: 'City Cruiser', type: 'bike', model: 'Trek FX3', status: 'in-use', loc: 'Zone B', price: '$1.50/hr', km: '554' },
  { id: 'BK-11', name: 'Classic Ride', type: 'bike', model: 'Specialized', status: 'available', loc: 'Zone C', price: '$1.00/hr', km: '3,411' },
  { id: 'BK-12', name: 'Sport Racer', type: 'bike', model: 'Trek Domane', status: 'available', loc: 'Zone A', price: '$2.50/hr', km: '320' },
  { id: 'SC-01', name: 'Spark E1', type: 'scooter', model: 'Xiaomi Pro 2', status: 'available', loc: 'Zone C', price: '$3.00/hr', km: '430', bat: 92 },
  { id: 'SC-02', name: 'Volt Rider', type: 'scooter', model: 'Segway Ninebot', status: 'available', loc: 'Zone A', price: '$3.50/hr', km: '1,820', bat: 45 },
  { id: 'SC-04', name: 'Spark E1', type: 'scooter', model: 'Xiaomi Pro 2', status: 'available', loc: 'Zone C', price: '$3.00/hr', km: '672', bat: 78 },
  { id: 'SC-07', name: 'Urban Flash', type: 'scooter', model: 'Ninebot Max', status: 'in-use', loc: 'Zone D', price: '$4.00/hr', km: '980', bat: 12 },
];

export const recentRentals = [
  { id: '#1042', user: 'Sarah M.', vehicle: 'BK-11', type: 'bike', start: '08:45 AM', duration: '42 min', amount: '$8.40', status: 'completed' },
  { id: '#1041', user: 'Tom R.', vehicle: 'SC-04', type: 'scooter', start: '08:12 AM', duration: '1h 18m', amount: '$18.50', status: 'completed' },
  { id: '#1040', user: 'Alex J.', vehicle: 'BK-07', type: 'bike', start: 'Ongoing', duration: '—', amount: '—', status: 'active' },
  { id: '#1039', user: 'Maria K.', vehicle: 'SC-02', type: 'scooter', start: 'Yesterday', duration: '55 min', amount: '$13.75', status: 'completed' },
  { id: '#1038', user: 'James L.', vehicle: 'BK-05', type: 'bike', start: 'Yesterday', duration: '—', amount: '$5.00', status: 'cancelled' },
];

export const rideHistory = [
  { id: '#1040', vehicle: '🚲 BK-07', date: 'Today', duration: 'Ongoing', distance: '—', amount: '—', status: 'active' },
  { id: '#1037', vehicle: '🛴 SC-04', date: 'Jun 5', duration: '1h 12m', distance: '8.4 km', amount: '$14.40', status: 'completed' },
  { id: '#1031', vehicle: '🚲 BK-02', date: 'Jun 3', duration: '45 min', distance: '5.2 km', amount: '$8.25', status: 'completed' },
  { id: '#1024', vehicle: '🛴 SC-01', date: 'Jun 1', duration: '2h 00m', distance: '18.1 km', amount: '$24.00', status: 'completed' },
  { id: '#1018', vehicle: '🚲 BK-09', date: 'May 30', duration: '—', distance: '—', amount: '$0.00', status: 'cancelled' },
  { id: '#1012', vehicle: '🚲 BK-05', date: 'May 28', duration: '30 min', distance: '3.8 km', amount: '$5.50', status: 'completed' },
];

export const billingHistory = [
  { date: 'Jun 5', desc: 'Rental #1037', method: 'Visa ••4821', amount: '$14.40' },
  { date: 'Jun 3', desc: 'Rental #1031', method: 'Visa ••4821', amount: '$8.25' },
  { date: 'Jun 1', desc: 'Rental #1024', method: 'Google Pay', amount: '$24.00' },
  { date: 'May 28', desc: 'Rental #1012', method: 'Visa ••4821', amount: '$5.50' },
  { date: 'May 25', desc: 'Monthly Pass', method: 'Visa ••4821', amount: '$29.99' },
];

export const weekData = [
  { day: 'Mon', value: 12 },
  { day: 'Tue', value: 18 },
  { day: 'Wed', value: 9 },
  { day: 'Thu', value: 24 },
  { day: 'Fri', value: 31 },
  { day: 'Sat', value: 27, active: true },
  { day: 'Sun', value: 15 },
];
