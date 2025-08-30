import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
   products : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",    
   }],

   payment: {},
   buyer : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
   },
   status: {
    type: String,
    default: "Not Processed",
    enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"]
   }
},{timestamps: true})

export default mongoose.model("Order", orderSchema);