const { Schema, model } = require('mongoose');

const bookingSchema = new Schema({
  customer_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',                   
    required: true 
  },
    vehicle_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'vehicle',                   
    required: true 
  },
    tour_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Tour',                   
    required: false 
  },
   driver_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',                   
    required: false 
  },
  booking_type: { type: String, required:true },
  booking_name : { type: String, required:true},
  description: { type: String, required:true },
  bookingprice: {  type: Number, required:true },
  booking_date: { type: String, required:true},
  bookingstatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending'},
  status: { type: String, enum: ['Active', 'Deleted'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = model('Booking', bookingSchema);