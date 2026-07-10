const express=require("express");

const router=express.Router();

const {

createReview,

getReview,

}=require("../controllers/danhgia");

const {protect}=require("../middleware/auth");

router.post("/",protect,createReview);

router.get("/:id",getReview);

module.exports=router;