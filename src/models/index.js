const mongoose = require("mongoose");
const config = require("../config");
const path = require("path");
const fs = require("fs");

const basename = path.basename(__filename);
const db = {};
db.config = config;


const options = {
    autoIndex: true,
    useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
}


db.connect = ()=>{
  return mongoose
    .connect(config.dbUri, options)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
    console.log("db error", error);
      process.exit(1);
    });

}


fs.readdirSync(__dirname)
  .filter((file) => {
     return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))
    
     var nm = file.split('.');
      nm = nm[0];
      db[nm] = model;
  });




module.exports = db;
