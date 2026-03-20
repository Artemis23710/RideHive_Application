const { Schema, model } = require('mongoose');

const vehicalSchema = new Schema({
  vehicalname: { type: String, required:true },
  category: { type: String, required:true },
  type: { type: String, required:true},
  vehicalnumber: { type: String, required:true },
  pasengercapacity: { type: Number, required:true },
  location: {  type: String, default: '' },
  baseprice: {  type: Number, required:true },
  vehicalstatus: {  type: String, enum: ['Available', 'Booked', 'Maintenance'], default: 'Available' },
   vehicalimage: {
    data: { type: Buffer, default: null },
    contentType: { type: String, default: '' },
    filename: { type: String, default: '' },
    originalname: { type: String, default: '' }, // Added for original filename
    size: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now }
  },
  availabilitySchedule: {  type: [{ type: String,  }], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  status: { type: String, enum: ['Active', 'Deleted'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = model('vehicle', vehicalSchema);