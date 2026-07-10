const DanhGia=require("../models/DanhGia");

const createReview=async(req,res)=>{

try{

const review=await DanhGia.create({

user:req.user._id,

product:req.body.product,

order:req.body.order,

star:req.body.star,

comment:req.body.comment,

});

res.json({

success:true,

message:"Đánh giá thành công",

review,

});

}
catch(err){

res.status(500).json({

message:err.message,

});

}

};

const getReview=async(req,res)=>{

try{

const data=await DanhGia.find({

product:req.params.id,

}).populate("user","name");

res.json(data);

}
catch(err){

res.status(500).json({

message:err.message,

});

}

};

module.exports={

createReview,

getReview,

};