const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const [type, token] = req.headers.authorization?.split(' ') || [];

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = {
      userId: decodedToken.userId,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
