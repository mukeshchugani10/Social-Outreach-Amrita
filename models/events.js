var mongoose = require('mongoose');
var EventSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    headng: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true
    }
});
mongoose.model('Event', EventSchema);

module.exports = mongoose.model('Event');
