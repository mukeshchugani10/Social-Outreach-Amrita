var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sop', { useNewUrlParser: true }).catch((err) => {
    console.log(err);
    console.log("Database is not connected");
});
mongoose.set('useCreateIndex', true);