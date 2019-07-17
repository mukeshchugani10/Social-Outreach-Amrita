var mongoose = require('mongoose');
var SponsorSchema = new mongoose.Schema({
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
    }
});
mongoose.model('Sponsor', SponsorSchema);

module.exports = mongoose.model('Sponsor');
