const bcrypt = require('bcrypt');

const contraseña = '123456'; // usa una segura
bcrypt.hash(contraseña, 10).then(hash => {
  console.log('Hash:', hash);
});
