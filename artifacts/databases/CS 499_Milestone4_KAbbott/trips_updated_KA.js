/*
  (KA) Enhancements for CS 499 Milestone Four - Databases

  I made two key updates to this file as part of my final project:

  1. In getTripByCode(), I added a case-insensitive search using RegExp so users
     can find trips by tripCode no matter how it's capitalized.

  2. In both addTrip() and updateTrip(), I added basic validation to make sure
     all required fields are filled out before saving or updating anything.
     This helps keep the database clean and avoids bad or incomplete data.

  These changes were made to improve how the app handles data and how flexible
  the API is for users and future devs.

  - Keon Abbott
*/
const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

// GET all trips
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({});
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trips', error: err });
  }
};

// GET a single trip by tripCode
const getTripByCode = async (req, res) => {
  const tripCode = req.params.tripCode;

  try {
        // (KA) Using RegExp for case-insensitive tripCode matching
    const trip = await Trip.findOne({ code: new RegExp(`^${tripCode}$`, 'i') });
    if (!trip) {
      return res.status(404).json({ message: `Trip with code ${tripCode} not found` });
    }
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trip', error: err });
  }
};

// POST a new trip
const addTrip = async (req, res) => {
  console.log('Incoming trip data:', req.body); // Log the request payload

  // (KA) Validating input fields before creating a new trip
  const { code, name, length, start, resort, perPerson, image, description } = req.body;
  if (!code || !name || !length || !start || !resort || !perPerson || !image || !description) {
    return res.status(400).json({ message: "All fields must be filled out." });
  }

  try {
    const newTrip = await Trip.create(req.body);
    res.status(201).json(newTrip);
  } catch (err) {
    console.error('Error creating trip:', err.message);
    console.error(err); // Full error object

    res.status(400).json({
      message: 'Trip creation failed',
      error: err.message || err
    });
  }
};

// PUT (update) a trip
const updateTrip = async (req, res) => {
  const tripCode = req.params.tripCode;

  // (KA) Validating update fields to ensure integrity of data
  const { code, name, length, start, resort, perPerson, image, description } = req.body;
  if (!code || !name || !length || !start || !resort || !perPerson || !image || !description) {
    return res.status(400).json({ message: "All fields must be filled out." });
  }

  try {
    const updatedTrip = await Trip.findOneAndUpdate(
      { code: tripCode },
      req.body,
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: `Trip with code ${tripCode} not found` });
    }

    res.status(200).json(updatedTrip);
  } catch (err) {
    res.status(400).json({ message: 'Trip update failed', error: err });
  }
};

// DELETE a trip
const deleteTrip = async (req, res) => {
  const tripCode = req.params.tripCode;

  try {
    const deletedTrip = await Trip.findOneAndDelete({ code: tripCode });

    if (!deletedTrip) {
      return res.status(404).json({ message: `Trip with code ${tripCode} not found` });
    }

    res.status(200).json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Trip deletion failed', error: err });
  }
};

module.exports = {
  getTrips,
  getTripByCode,
  addTrip,
  updateTrip,
  deleteTrip
};
