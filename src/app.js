const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const { port } = require('./config')
const os = require('os')
const fs = require('fs')
const db = require('./models')
    


var ccavReqHandler = require('./ccavRequestHandler.js');
var ccavResHandler = require('./ccavResponseHandler.js');




app.post('/ccavRequestHandler', function (request, response){
	ccavReqHandler.postReq(request, response);
});


app.post('/ccavResponseHandler', function (request, response){
        ccavResHandler.postRes(request, response);
});




app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(express.bodyParser({limit: '25mb'}));
app.use(express.json());


const config = require("./config");
app.use('/upload', express.static(config.uploadFolder));

app.use('/api', routes);


app.listen(port, function () {
  db.connect();
  console.log(`server listening on port ${port}`)
})
