const Booking = require('../models/booking.model');

// Create and Save a new Note
exports.create = (req, res) => {
    console.log('request body', req.body)
    // Validate request
    if(!req.body.users) {
        return res.stausertus(400).send({
            message: "Email is required"
        });
    }

    // Create a User
    const booking = new Booking({
        users: req.body.users,
        hallName: req.body.hallName,
        start: req.body.start,
        end: req.body.end,
        rent: req.body.rent       
    });

    // Save User in the database
    booking.save()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Booking.find()
    .populate('users')   
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};
// Find a single note with a noteId
exports.findOne = (req, res) => {
    Booking.findById(req.params.bookingId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.bookingId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.bookingId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.bookingId
        });
    });
};
// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.email) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Find note and update it with the request body
    Booking.findByIdAndUpdate(req.params.bookingId, {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        city: req.body.city
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.bookingId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.bookingId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.bookingId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Booking.findByIdAndRemove(req.params.bookingId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.bookingId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.bookingId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.bookingId
        });
    });
};