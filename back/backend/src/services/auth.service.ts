import { User, IUser } from '../models/User';
import { signToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput): Promise<{ user: IUser; token: string }> {
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      throw ApiError.conflict('An account with this email already exists', 'EMAIL_ALREADY_EXISTS');
    }

    const user = await User.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      phone: input.phone,
      password: input.password,
      role: 'USER',
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });
    return { user, token };
  },

  async login(input: LoginInput): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('This account has been deactivated', 'ACCOUNT_DEACTIVATED');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });
    return { user, token };
  },
};
