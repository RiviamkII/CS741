var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    username: String,
    password: String
});

// adminSchema.set('toJSON', {
//     transform : function( doc, result, options ) {
//         delete result.password;
//     }
// } );

var Admin = mongoose.model('Admin', adminSchema, 'admin');
module.exports = Admin;