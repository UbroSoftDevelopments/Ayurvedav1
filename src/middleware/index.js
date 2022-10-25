const jwt = require('jsonwebtoken');
const checkAuth = (req,res,next)=>{
	var {authorization} = req.headers;
	if(!authorization){
    authorization = req.query.Authorization;
  
      if(!authorization){
        authorization = req.body.Authorization;
      
      if(!authorization)
    		return res.status(401).send({status:false,message:'Unauthorized access',data:req.query});
    	}
  }
	   var tokenArr = authorization.split(' ');
     if(tokenArr[0] != 'Bearer'){
        return res.status(401).send({status:false,message:'Not a valid token type',data:null});
     }
     var token = tokenArr.pop();
  
      jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
        if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.',err,token });
        else{
          var {_id} = decoded;
          req.userId = _id; 
        	next();
        }
    });
        
}




const upload = (req,res,next)=>{
    var files = req.files;
          var file = req.file;
          var body = req.body;
          return  res.json({status:true,message:`upload`,data:[files,body,file]});
   //return app.upload();
}


 

module.exports = {checkAuth}