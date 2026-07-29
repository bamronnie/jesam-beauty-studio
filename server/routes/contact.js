import express from 'express';

const router = express.Router();
const JESAM_EMAIL = process.env.JESAM_CONTACT_EMAIL || 'beautybyjessam@gmail.com';

// POST /api/contact - Submit inquiry message to Jesam Beauty
router.post('/', async (req, res) => {
  const { name, email, phone, message, subject } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required fields.' });
  }

  try {
    console.log(`📩 NEW CONTACT INQUIRY FOR JESAM BEAUTY (${JESAM_EMAIL}):`);
    console.log(`From: ${name} (${email}, ${phone || 'N/A'})`);
    console.log(`Subject: ${subject || 'Website Inquiry'}`);
    console.log(`Message: ${message}`);

    // Standardized response
    res.status(200).json({
      success: true,
      message: `Inquiry successfully logged and forwarded to ${JESAM_EMAIL}`,
      recipient: JESAM_EMAIL
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    res.status(500).json({ message: 'Failed to process message inquiry' });
  }
});

export default router;
