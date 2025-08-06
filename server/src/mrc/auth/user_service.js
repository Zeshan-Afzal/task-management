import bcryptjs from 'bcryptjs';
import ms from 'ms';
import User from './user_model.js';
import ErrorHandler from '../../utils/error_hanlder.js';
import { generateToken } from '../../utils/utils.js';

class AuthService {
  async createUser({ email, name, password }) {
    if(!name || !email || !password) throw new ErrorHandler("name , email , or password is missing")
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorHandler('User already exists with this email', 401);
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    const user = await User.create({ name, email, password: hashedPassword });
    if (!user) {
      throw new ErrorHandler('Failed to register user, please try again', 500);
    }

    const accessToken = generateToken(user);
   // const accessTokenExpiresAt = new Date(Date.now() + ms(process.env.ACCESS_TOKEN_EXPIRY));

    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      accessToken,
    };
  }

  async loginUser({ email, password }) {
    if (!email || !password) {
      throw new ErrorHandler('Email or password is missing', 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorHandler('Invalid Credentials', 400);
    }

    const checkPass = await bcryptjs.compare(password, user.password);
    if (!checkPass) {
      throw new ErrorHandler('Invalid Credentials', 400);
    }

    const accessToken = generateToken(user);
    const accessTokenExpiresAt = new Date(Date.now() + ms(process.env.ACCESS_TOKEN_EXPIRY));

    const userObj = user.toObject();
    delete userObj.password;

    return {
      message: 'Login successful',
      user: userObj,
      accessToken,
      accessTokenExpiresAt,
    };
  }

  async updatePassword({ email, oldPassword, newPassword }) {
    console.log(oldPassword);
    
    const user = await User.findOne({ email });
    if (!user) throw new ErrorHandler('User not found', 400);

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) throw new ErrorHandler('Invalid current password', 400);

    const hashedPassword = await bcryptjs.hash(newPassword, 8);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async updateEmail({ currentEmail, newEmail, password }) {
    
    
    const user = await User.findOne({ email: currentEmail });
    if (!user) throw new ErrorHandler('User not found', 400);

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) throw new ErrorHandler('Invalid password', 400);

    const existing = await User.findOne({ email: newEmail });
    if (existing) throw new ErrorHandler('Email already in use', 400);

    user.email = newEmail;
    await user.save();

    const accessToken = generateToken(user);
    const accessTokenExpiresAt = new Date(Date.now() + ms(process.env.ACCESS_TOKEN_EXPIRY));

    const userObj = user.toObject();
    delete userObj.password;

    return {
      message: 'Email updated successfully',
      user: userObj,
      accessToken,
      accessTokenExpiresAt,
    };
  }

  async logout(userId) {
    if (!userId) throw new ErrorHandler('Unauthorized request', 400);
    return { message: 'Logout successful' };
  }

  
}

export default new AuthService(); 
