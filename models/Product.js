const mongoose = require('mongoose');


// const productSchema = new mongoose.Schema( {
//     name: {
//         type: 'String',
//         required: true
//     },
//     price: {
//         type: 'Number',
//         required: true
//     },
//     desc : {
//         type: 'String',
//     },
// },
// {
//     versionKey: false,
//     timestamps: true,

// web 70 anh khoa 
// });

const product = mongoose.Schema({
    name: {
        type : String,
        require: true,
    },
    price : {
        type: Number,
        required: true
    },
    quantity : {
        type: Number,
        default: 0
    },
    image: {
        type: String,

    },
    createBy: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
    }
}, {
    timestamps: true,

// web72 thường dùng
})

// const Product = mongoose.Schema({
//     name: {
//         type: String,
//         require: true,
//     }, 
//     slug: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     category: {
//         type: mongoose.Types.ObjectId,
//         ref: "Category",
//         required: true,
//     },
//     quantity: {
//         type: Number,
//         default: 0
//     },
//     thumbnail: {
//         type: String,
//         required: true
//     },
//     detail: {
//         type: String,
//         required: true
//     }

// },{ 
//     timestamps: true
// } 
// // Economic
// )

export default mongoose.model('Product', product);