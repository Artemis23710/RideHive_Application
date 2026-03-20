const Tour = require('../models/tour.model');
const Users = require('../models/user.model');

async function createTour(data) {
  const tour = new Tour(data);
  return tour.save();
}

async function getAllTour() {
  return Tour.find({ status: 'Active' })
    .populate('customer_id')
    .sort({ createdAt: -1 })
    .lean();
}

async function getTourById(id) {
  return Tour.findById(id);
}

async function updateTour(id, updateData) {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    return updatedTour;
  } catch (error) {
    throw error;
  }
}

async function deleteTour(id) {
  try {
    const deletedTour = await Tour.findByIdAndUpdate(
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

    return deletedTour;
  } catch (error) {
    throw error;
  }
}

async function getAllCustomer() {

  return Users.find({ role: 'Customer' })
    .sort({ createdAt: -1 })
    .lean();
    
}

module.exports = { createTour, getAllTour, getTourById, updateTour, deleteTour ,getAllCustomer};