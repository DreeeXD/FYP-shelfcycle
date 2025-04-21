
const NewsletterSubscriber = require('../models/newsletterModel');

exports.subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  try {
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ success: true, message: "You’re already subscribed!" });
    }

    await NewsletterSubscriber.create({ email });
    return res.status(201).json({ success: true, message: "Thank you for subscribing!" });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
