import jwt from 'jsonwebtoken';


const SECRET = process.env.JWT_SECRET;
export const jwtLogin = (req, res) => {
    const token = jwt.sign(
      { username: 'guest', role: 'user' },
      SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );
    res.json({ token });
  };
  
  export const jwtSecret = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing token' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.decode(token); // intentionally not secure btw
      console.log("Decoded token:", decoded);
  
      if (decoded?.role !== 'admin') {
        return res.status(403).json({ message: 'Insufficient privileges' });
      }
  
      res.json({ secret: "🎉 You found the secret!" });
    } catch (err) {
      console.error("JWT Decode Failed:", err);
      res.status(401).json({ message: 'Invalid token' });
    }
  };