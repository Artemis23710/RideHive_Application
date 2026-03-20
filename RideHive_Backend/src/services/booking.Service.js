const Booking = require('../models/booking.model');
const Users = require('../models/user.model');

async function createBooking(data) {
  const booking = new Booking(data);
  return booking.save();
}

async function getAllBookings() {
  return Booking.find({ status: 'Active' })
    .populate('customer_id')
    .populate('vehicle_id')
    .populate('tour_id')
    .populate('driver_id')
    .sort({ createdAt: -1 })
    .lean();
}

async function getBookingById(id) {
  return Booking.findById(id);
}

async function updateBooking(id, updateData) {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    return updatedBooking;
  } catch (error) {
    throw error;
  }
}

async function deleteBooking(id) {
  try {
    const deletedBooking = await Booking.findByIdAndUpdate(
      id,
      { 
        status: 'Deleted',
        updatedAt: Date.now()
      },
      { 
        new: true,
        runValidators: true
      }
    ); 

    return deletedBooking;
  } catch (error) {
    throw error;
  }
}

async function getAllDriver() {

  return Users.find({ role: 'Driver' })
    .sort({ createdAt: -1 })
    .lean();
    
}


module.exports = { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking, getAllDriver };