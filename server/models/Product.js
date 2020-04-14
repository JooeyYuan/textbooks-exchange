const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    useremail: {
        type: String
    },
    username: {
        type: String
    },
    userphone: {
        type: String
    },
    usermajor: {
        type: String
    },
    userbio: {
        type: String
    },
    useraddr: {
        type: String
    },
    title: {
        type: String,
        maxlength: 50
    },
    author: {
        type: String,
        maxlength: 50
    },
    code: {
        type: String,
        maxlength: 50
    },
    professor: {
        type: String,
        maxlength: 50
    },
    ISBN: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    version: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    condition: {
        type: Number,
        default: 1
    },
    level: {
        type: Number,
        default: 1
    },
    department: {
        type: Number,
        default: 1
    },
    category: {
        type: Number,
        default: 1
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

productSchema.index({ 
    title:'text',
    description: 'text',
}, {
    weights: {
        name: 5,
        description: 1,
    }
})

const Product = mongoose.model('Product', productSchema);
module.exports = { Product }