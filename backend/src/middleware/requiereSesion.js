// Corta la petición si el usuario no inició sesión.
function requiereSesion(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Tenés que iniciar sesión." });
  }
  next();
}

module.exports = requiereSesion;
