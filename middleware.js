const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '')
  console.log(token);
  if (!token) {
    res.status(401).send({ message: 'token not present' })
  }

  jwt.verify(token, 'token_test123', (err, _) => {
    if (err) {
      res.status(401).send({ message: 'Invalid token' })
    }
  })
  next();
}

const checkLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).send({ message: 'Invalid username or password' })
  }
  next();
}

module.exports = { checkLogin, verifyToken }