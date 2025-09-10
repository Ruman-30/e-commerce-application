import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    product: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "product" 
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true})

const reviewModel = mongoose.model("review", reviewSchema)

export default reviewModel