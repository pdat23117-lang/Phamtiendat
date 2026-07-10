const mongoose = require("mongoose");

const danhGiaSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"sanpham",
        required:true,
    },

    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"dathang",
        required:true,
    },

    star:{
        type:Number,
        min:1,
        max:5,
        required:true,
    },

    comment:{
        type:String,
        default:"",
    },

},
{
    timestamps:true,
}
);

module.exports=mongoose.model("DanhGia",danhGiaSchema);