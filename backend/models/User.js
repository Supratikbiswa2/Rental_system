const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName:  { type: String, default: '' },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  phone:     { type: String, default: '' },
  city:      { type: String, default: '' },
  prefs: {
    emailNotifications: { type: Boolean, default: true  },
    pushNotifications:  { type: Boolean, default: true  },
    marketingEmails:    { type: Boolean, default: false },
    darkMode:           { type: Boolean, default: false },
  },
}, { timestamps: true });

// Hash password before saving — async hooks don't need `next`
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to check password
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);