//conxión con la base de datos:
module.exports = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: '127.0.0.1',
  database: process.env.DATABASE,
  port: Number(process.env.PORT),
  options: {
      trustServerCertificate: true,
      enableArithAbort: true,
  }
};