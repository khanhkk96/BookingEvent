const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  createUser: async (args) => {
    const userInfo = await User.findOne({ email: args.userInput.email });
    if (userInfo) {
      throw new Error("User exists already.");
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
};
