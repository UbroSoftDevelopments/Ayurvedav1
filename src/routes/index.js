const express = require("express");
const multer = require('multer');
 const router = express.Router();

  router.get('/', (req,res,next)=>{
	  res.json({site:true});
  });
  
  
  router.use('/user', require("./user"));
  router.use('/admin', multer().none(), require("./admin"));
  router.use('/student', multer().none(), require("./student"));
  // Export the router
module.exports = router;