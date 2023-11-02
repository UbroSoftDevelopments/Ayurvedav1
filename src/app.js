const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const { port } = require('./config')
const os = require('os')
const fs = require('fs')
const bodyParser = require('body-parser')
const db = require('./models')
const { checkStudentAuth } = require("./middleware");


var ccavReqHandler = require('./ccavRequestHandler.js');
var ccavResHandler = require('./ccavResponseHandler.js');




app.post('/ccavRequestHandler', checkStudentAuth,function (request, response){
	ccavReqHandler.postReq(request, response);
});


app.post('/ccavResponseHandler', function (request, response){
        ccavResHandler.postRes(request, response);
});


// app.use(bodyParser.urlencoded({
//   extended: true
// }));

app.use(cors());

app.use(bodyParser.json({ limit: '25mb' }));

// Parse URL-encoded bodies and set the size limit to 10MB
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));


app.use(express.json());


const config = require("./config");

app.use('/upload', express.static(config.uploadFolder));

app.use('/api', routes);


app.listen(port, function () {
  db.connect();
  console.log(`server listening on port ${port}`)
})
