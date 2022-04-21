const User = require('../../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async (args) => {
        const userInfo = await User.findOne({ email: args.userInput.email });
        if (userInfo) {
            throw new Error('User exists already.');
        }
        try {
            const hashPass = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashPass,
            });

            const result = await user.save();
            result._doc.password = null;

            return result._doc;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User does not exist!');
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
            expiresIn: '1h',
        });
        return { userId: user.id, token, tokenExpiration: 1 };
    },
};
