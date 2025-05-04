// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'clave-secreta-super-importante'; // usa process.env en producción

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Falta el token de autorización' });
  }

  const token = authHeader.split(' ')[1]; // formato: Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // ahora req.usuario tendrá matricula, rol, etc.
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
}


module.exports = {verificarToken, permitirRoles};
