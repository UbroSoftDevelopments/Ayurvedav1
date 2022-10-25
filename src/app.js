const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const {port} = require('./config')
const os = require('os')
const fs = require('fs')
app.use('/img',express.static('html/uploads')); 
const db = require('./models')
app.use(express.urlencoded({extended:false})); 
app.use(cors()); 
app.use(express.json()); 



app.use('/api', routes);
 
app.listen(port, function () {
  db.connect();
  console.log(`server listening on port ${port}`)
})

