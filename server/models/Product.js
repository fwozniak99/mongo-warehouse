const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: { 
        type: String,
        required: true,
        unique: [ true, "Must be unique!" ],
     },
     price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
});

module.exports = model('Product', productSchema);