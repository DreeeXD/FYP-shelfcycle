const bookModel = require('../models/bookModel');
const Notification = require('../models/notificationModel');
const NewsletterSubscriber = require('../models/newsletterModel'); 
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendNewsletterEmail = async (book) => {
  try {
    const subscribers = await NewsletterSubscriber.find({});
    
    if (subscribers.length === 0) return;

    for (const sub of subscribers) {
      const email = sub.email;
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: `📚 New Book Added: ${book.bookTitle}`,
        html: `
          <div style="font-family: sans-serif; padding: 10px;">
            <h2>📚 New Book Just Landed!</h2>
            <p><strong>${book.bookTitle}</strong> by ${book.bookAuthor}</p>
            <p>Type: <strong>${book.bookType}</strong></p>
            ${book.bookType === 'sell' ? `<p>Price: $${book.bookPrice}</p>` : `<p>Available for Exchange</p>`}
            <p><a href="${process.env.CLIENT_URL}/book-details/${book._id}" target="_blank" style="color: #007BFF;">🔍 View Book Details</a></p>
            <br/>
            <p>— ShelfCycle Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    console.log("Newsletter emails sent to all subscribers.");
  } catch (err) {
    console.error("Failed to send newsletter email:", err.message);
  }
};

const uploadBookController = async (req, res) => {
  try {
    const { bookType, bookPrice, ...rest } = req.body;

    const uploadedBy = req.user?._id;
    if (!uploadedBy) {
      return res.status(401).json({
        message: "Unauthorized. User not logged in.",
        success: false,
        error: true,
      });
    }

    const finalBookData = {
      ...rest,
      uploadedBy,
      bookType,
      bookPrice: bookType === 'sell' ? bookPrice : null,
    };

    const uploadBook = new bookModel(finalBookData);
    const savedBook = await uploadBook.save();

    // Create a notification for uploader
    await Notification.create({
      recipient: uploadedBy,
      message: `Your book "${savedBook.bookTitle}" was successfully uploaded.`,
      link: `/book-details/${savedBook._id}`,
    });

    // Send newsletter to subscribers
    await sendNewsletterEmail(savedBook);

    res.status(201).json({
      data: savedBook,
      success: true,
      error: false,
      message: "Book uploaded successfully!",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = uploadBookController;
