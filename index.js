const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const morgan = require('morgan-body');

const { validateLogin, registerUser, getUserData } = require('./queries')
const { checkLogin, verifyToken } = require('./middleware')
const PORT = 3000;



const app = express();
morgan(app);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {

  const params = req.params
  const url = req.url

  console.log(`*** Request received to ${url} with params: ${JSON.stringify(params)}`)
  next();

});

app.post('/login', checkLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    await validateLogin(email, password);
    const token = jwt.sign({ email }, 'token_test123');
    res.send({ token })

  } catch (error) {
    res.status(500).send(error);
  }
});


app.get('/usuarios', verifyToken, async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '')
  const { email } = jwt.decode(token)
  const user = await getUserData(email)

  res.status(200).json(user);


});


app.post('/usuarios', async (req, res) => {
  try {
    const user = req.body;
    await registerUser(user);
    res.send('User created');
  } catch (error) {
    res.status(500).send(error);
  }
});








app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
