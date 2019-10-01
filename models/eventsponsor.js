var mongoose = require('mongoose');
var EventSponsorSchema = new mongoose.Schema({
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
mongoose.model('EventSponsor', EventSponsorSchema);

module.exports = mongoose.model('EventSponsor');
