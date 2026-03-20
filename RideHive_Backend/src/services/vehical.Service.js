const Vehical = require('../models/vehical.model');

async function createVehical(data) {
  const vehical = new Vehical(data);
  return vehical.save();
}

async function getAllVehical() {
  return Vehical.find({ status: 'Active' })
    .sort({ createdAt: -1 })
    .lean();
}

async function getVehicaleById(id) {
  return Vehical.findById(id);
}

async function updateVehical(id, updateData) {
  try {
    // Find and update the vehicle
    const updatedVehical = await Vehical.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true // Run schema validators on update
      }
    );
    return updatedVehical
  } catch (error) {
    throw error
  }
}

async function deleteVehicle(id) {
  try {
    const deletedVehicle = await Vehical.findByIdAndUpdate(
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

    return deletedVehicle;
  } catch (error) {
    throw error;
  }
}


module.exports = { createVehical, getAllVehical, getVehicaleById, updateVehical, deleteVehicle };