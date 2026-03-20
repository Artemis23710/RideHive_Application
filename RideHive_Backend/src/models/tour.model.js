const { Schema, model } = require('mongoose');

const tourSchema = new Schema({
  customer_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',                   
    required: true 
  },
  tourname: { type: String, required:true },
  description: { type: String, required:true },
  locations: { type: String, required:true},
  passenger_count: { type: String, required:true },
  totalprice: {  type: Number, required:true },
  tourSchedule: {  
    type: [{ 
      type: String, 
      required:true,
      match: /^\d{4}-\d{2}-\d{2}$/
    }], 
    default: [] 
  },
  starttime: { type: String, required:true},
  pickup_locations: { type: String, required:true},
  status: { type: String, enum: ['Active', 'Deleted'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = model('Tour', tourSchema);