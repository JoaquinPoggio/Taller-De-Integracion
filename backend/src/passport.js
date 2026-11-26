const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const prisma = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      state: true,
    },
    (accessToken, refreshToken, profile, done) => {
      // Solo recuperamos los datos básicos del perfil de Google.
      done(null, profile);
    },
  ),
);

passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    done(null, usuario || false);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
