import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Reflect user input back without sanitization (which is vulnerable)
router.post('/reflect', authMiddleware, (req, res) => {
    const { input } = req.body;
  
    const responseHTML = `
      <html>
        <body style="font-family: sans-serif; padding: 2rem;">
          <h2>You entered:</h2>
          <div style="border: 1px solid #ccc; padding: 1rem; margin-top: 1rem;">
            ${input}
          </div>
        </body>
      </html>
    `;
  
    res.send(responseHTML);
  });

export default router;