const db = require('../models');

class AdminController{

	login(req,res){
		var {username,password} = req.body;
		if(!username || !password)
			return res.json({status:false,message:'username and password are required!',data:null});

		db.Admin.findOne({username}).lean().then(async doc=>{
               if(!doc)
               	return res.json({status:false,message:`Authentication fail`,data:[]});


				 var st =  await app.checkPassword(password,doc.password);
		 	if(st){
		 		doc.token = app.token({username:doc.username,_id:doc._id});
				return res.json({status:true,message:'login successs',data:doc});
		 	}else{
		 		return res.json({status:false,message:`Not a valid authentication`,data:null});
		 	}
		}).catch(err=>{
			return res.json({status:false,message:`${err}`,data:err});
		})

	}

	async signup(req,res){
		var {name,username,password} = req.body;
		if(!name || !username || !password)
			return res.json({status:false,message:'name, username and password are required!',data:null});

		var pass = await db.config.setPassword(password);

		var admin = new db.Admin;
		admin.name = name;
		admin.username = username;
		admin.password = pass;
		try{
			admin.save(err=>{
				return res.json({status:true,message:'New admin created',data:admin});
			});
		}catch(err){
			return res.json({status:false,message:`${err}`,data:err});
		}
		
	}

	async updateProfile(req,res){
		var {_id, name,username,password} = req.body;
		if(!_id)
			return res.json({status:false,message:'_id required!',data:null});

	

		var admin = await db.Admin.findOne({_id});
		if(password)
			admin.password = await db.config.setPassword(password);
		if(name)
			admin.name = name;
		if(username)
			admin.username = username;

			admin.save(err=>{
				if(!err)
					return res.json({status:true,message:'Profile updated',data:admin});
			    else
					return res.json({status:false,message:`$err`,data:err});
	        	});
		
	}

	async updatePassword(req,res){
		var {_id,password,password_confirm} = req.body;
		if(!_id || !password || !password_confirm)
			return res.json({status:false,message:'_id, password and password_confirm are required!',data:req.body});

		if(password_confirm != password)
			return res.json({status:false,message:'password and confirm password did not match!',data:null});

		var admin = await db.Admin.findOne({_id});
		if(password)
			admin.password = await db.config.setPassword(password);
		

			admin.save(err=>{
				if(!err)
					return res.json({status:true,message:'Profile updated',data:admin});
			    else
					return res.json({status:false,message:`${err}`,data:err});
	        	});
		
	}

	//add state
	addState(req,res){
		var {name,title} = req.body;
		if(!name)
			return res.json({status:false,message:'key name required for state',data:null});
		
		try{
			var state = new db.State;
			state.name = name;
			if(title)
				state.title = title;
			
			state.save(err=>{
				if(!err)
				 	return res.json({status:true,message:'new state added',data:state});
				else
					return res.json({status:false,message:`${err}`,data:err});
			});
			
		}catch(err){
			return res.json({status:false,message:`${err}`,data:err});
		}

		
	}

	addCategory(req,res){
		var {name,title} = req.body;
		if(!name)
			return res.json({status:false,message:'key name required for category',data:null});
		
		try{
			var category = new db.Category;
			category.name = name;
			if(title)
				category.title = title;

			category.save(err=>{
				if(!err)
				 	return res.json({status:true,message:'new category added',data:category});
				else
					return res.json({status:false,message:`${err}`,data:err});
			});
			
		}catch(err){
			return res.json({status:false,message:`${err}`,data:err});
		}

		
	}


	async getCategory(req,res){

	   try{
		const category = await db.Category.find() 	
		return res.status(200).json({status:true,message:`category list`,data:category});
		}catch(err){
		return res.state(403).json({status:false,message:'somthing worng',data:`${err}`});
		}

		
	}


	// update category
	async updateCategory(req,res){
		var {_id,name,title} = req.body;
		if(!name || !_id)
			return res.json({status:false,message:'key _id,name required for category',data:req.body});
		
		try{
			var category = await db.Category.findOne({_id});
			category.name = name;
			if(title)
				category.title = title;

			category.save(err=>{
				if(!err)
				 	return res.json({status:true,message:'Category updated',data:category});
				else
					return res.json({status:false,message:`${err}`,data:err});
			});
			
		}catch(err){
			return res.json({status:false,message:`${err}`,data:err});
		}

		
	}


	// delete category
	async deleteCategory(req,res){
		var {_id,name,title} = req.body;
		if(!_id)
			return res.json({status:false,message:'key _id required for category',data:req.body});
		
		try{
			var category = await db.Category.findOne({_id});
			
			category.remove(err=>{
				if(!err)
				 	return res.json({status:true,message:'Category deleteed',data:category});
				else
					return res.json({status:false,message:`${err}`,data:err});
			});
			
		}catch(err){
			return res.json({status:false,message:`${err}`,data:err});
		}

		
	}


//
 async addBranch(req,res){
	var {categoryId, name, title} = req.body;
	if(!name)
		return res.json({status:false,message:'key (categoryId, name) required for branches',data:null});
	
	try{
		var branch = new db.Branch;
		branch.categoryId = categoryId
		branch.name = name;
		if(title)
		branch.title = title;

		branch.save(err=>{
			if(!err)
				 return res.json({status:true,message:'new branch added',data:branch});
			else
				return res.json({status:false,message:`${err}`,data:err});
		});
		
	}catch(err){
		return res.json({status:false,message:`${err}`,data:err});
	}

	
}

async getBranch(req,res){
   var {categoryId} = req.query
   if(!categoryId){
	return res.status(401).json({status:false,message:'categoryId is required ',data:[]});
   }
	try{
	 const branch = await db.Branch.find({categoryId}) 	
	 return res.status(200).json({status:true,message:`category wise branch list`,data:branch});
	 }catch(err){
	 return res.status(403).json({status:false,message:'somthing worng',data:`${err}`});
	 }

	 
	}

	async addDemoCourse(req,res){
		var {categoryId, branchId, url , title , poster} = req.body;
	if(!categoryId || !branchId || !url || !title )
		return res.json({status:false,message:'categoryId ,branchId ,url ,title required ',data:null});
	
	try{
		var demo = new db.DemoCourse;
		demo.categoryId = categoryId
        demo.branchId = branchId
        demo.url = url
        demo.title = title
      
		if(poster)
		demo.poster = poster;

		demo.save(err=>{
			if(!err)
				 return res.status(200).json({status:true,message:'new demo course added',data:demo});
			else
				return res.status(403).json({status:false,message:'something wrong',data:`${err}`});
		});
		
	}catch(err){
		return res.status(403).json({status:false,message:`something wrong`, data:`${err}`});
	}


	}

	async getDemoCourse(req,res){
		try{
			const demoCourse = await db.DemoCourse.find() 	
			return res.status(200).json({status:true,message:`all courses `,data:demoCourse});
			}catch(err){
			return res.status(403).json({status:false,message:'somthing worng',data:`${err}`});
			}
		
	}
}

module.exports = AdminController;