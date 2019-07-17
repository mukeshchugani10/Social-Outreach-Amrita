var mongoose = require('mongoose');
var VolunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String
    },
    reason: {
        type: String
    }
});
mongoose.model('Volunteer', VolunteerSchema);

module.exports = mongoose.model('Volunteer');
