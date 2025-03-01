const User = require('../models/userModel'); // Assuming userModel exports the User model

// Function to update user details
const updateUser = async (req, res) => {
    const { userId, name, email, password } = req.body; // Extracting user details from request body

    try {
        // Validate input data
        if (!userId || !name || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Update user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, password }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = updateUser;
