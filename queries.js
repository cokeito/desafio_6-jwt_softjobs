const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'amazzon.pg',
  port: 5432,
  database: 'softjobs',
  allowExitOnIdle: true
})

const validateLogin = async (email, password) => {

  const values = [email]
  const sql = "SELECT * FROM usuarios WHERE email = $1"

  const { rows: [user], rowCount } = await pool.query(sql, values);

  const { password: passwordCrypted } = user

  const isMatch = bcrypt.compareSync(password, passwordCrypted)


  if (!isMatch || rowCount === 0) {
    throw {
      code: 401,
      message: 'Invalid username or password'
    }
  }

}


const registerUser = async (user) => {
  let { email, password, rol, lenguage } = user
  const cryptedPass = bcrypt.hashSync(password, 10)

  const values = [email, cryptedPass, rol, lenguage]

  const sql = "INSERT INTO usuarios (id,  email, password, rol, lenguage) VALUES (DEFAULT, $1, $2, $3, $4)"
  pool.query(sql, values)

}

const getUserData = async (email) => {
  const values = [email]
  const sql = "SELECT * FROM usuarios WHERE email = $1"

  const { rows: [user], rowCount } = await pool.query(sql, values);

  if (rowCount === 0) {
    throw {
      code: 404,
      response: 'User not found'
    }
  }

  delete user.password
  return [user]

}

module.exports = { validateLogin, registerUser, getUserData }