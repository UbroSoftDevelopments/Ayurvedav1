const jwt = require('jsonwebtoken');
const roles_list = require('../config/roles_list');

const checkStudentAuth = (req, res, next) => {
  var { authorization } = req.headers;


  if (!authorization) {
    authorization = req.query.Authorization;

    if (!authorization) {
      authorization = req.body.Authorization;

      if (!authorization)
        return res.status(200).send({ status: false, message: 'Unauthorized Access', data: req.query });
    }
  }
  var tokenArr = authorization.split(' ');

  if (tokenArr[0] != 'Bearer') {
    return res.status(200).send({ status: false, message: 'Not a valid token type', data: null });
  }
  var token = tokenArr.pop();

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) return res.status(200).send({ status: false, message: 'Failed to authenticate token.', err, token });
    else {
      if (decoded.role != roles_list.Student) {
        return res.status(200).send({ status: false, message: 'Access denied!', err, token });
      }

      var { _id } = decoded;
      req.userId = _id;
      next();
    }
  });

}



const checkAdminAuth = (req, res, next) => {
  var { authorization } = req.headers;
  if (!authorization) {
    authorization = req.query.Authorization;

    if (!authorization) {
      authorization = req.body.Authorization;

      if (!authorization)
        return res.status(200).send({ status: false, message: 'Unauthorized Access', data: req.query });
    }
  }
  var tokenArr = authorization.split(' ');
  if (tokenArr[0] != 'Bearer') {
    return res.status(200).send({ status: false, message: 'Not a valid token type', data: null });
  }
  var token = tokenArr.pop();

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) return res.status(200).send({ status: false, message: 'Failed to authenticate token.', err, token });
    else {
      if (decoded.role != roles_list.Admin) {
        return res.status(200).send({ status: false, message: 'Access denied!', err, token });
      }
      var { _id } = decoded;
      req.userId = _id;
      next();
    }
  });

}



module.exports = { checkStudentAuth, checkAdminAuth }