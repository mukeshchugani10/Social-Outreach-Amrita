var mongoose = require('mongoose');
var EventVolunteerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    }
});
mongoose.model('EventVolunteer', EventVolunteerSchema);

module.exports = mongoose.model('EventVolunteer');
