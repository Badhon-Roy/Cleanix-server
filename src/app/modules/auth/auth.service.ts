import mongoose, { Types } from 'mongoose';
import config from '../../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { Customer } from '../customer/customer.model';
import { Cleaner } from '../cleaner/cleaner.model';
import { Admin } from '../admin/admin.model';
import { TChangePassword, TGoogleLoginUser, TLoginUser, TRegisterUser } from './auth.interface';
import { createToken } from './auth.utils';

const registerUser = async (payload: TRegisterUser) => {
  const isUserExist = await User.isUserExistsByEmail(payload.email);
  if (isUserExist) {
    throw new AppError(400, 'User with this email already exists!');
  }

  const isCleaner = payload.role === 'CLEANER';
  const userStatus = isCleaner ? 'PENDING_APPROVAL' : 'APPROVED';
  const isApproved = !isCleaner;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Create Base User Credentials
    const newUser = await User.create(
      [
        {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          password: payload.password,
          role: payload.role || 'CUSTOMER',
          status: userStatus,
          isApproved: isApproved,
        },
      ],
      { session },
    );

    if (!newUser.length) {
      throw new AppError(500, 'Failed to create user account');
    }

    const userId = newUser[0]._id as unknown as Types.ObjectId;

    // 2. Create Decoupled Role Profile in dedicated Collection
    if (payload.role === 'CLEANER') {
      await Cleaner.create(
        [
          {
            user: userId,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            avatar: payload.avatar || undefined,
            dob: payload.dob || undefined,
            gender: payload.gender || 'Male',
            status: 'PENDING_APPROVAL',
            isApproved: false,
          },
        ],
        { session },
      );
    } else if (payload.role === 'ADMIN') {
      await Admin.create(
        [
          {
            user: userId,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            avatar: payload.avatar || undefined,
          },
        ],
        { session },
      );
    } else {
      // Default: CUSTOMER
      await Customer.create(
        [
          {
            user: userId,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            avatar: payload.avatar || undefined,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    await session.endSession();

    // 3. Issue Access Token & Refresh Token
    const jwtPayload = {
      id: userId.toString(),
      email: newUser[0].email,
      role: newUser[0].role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        _id: newUser[0]._id,
        name: newUser[0].name,
        email: newUser[0].email,
        phone: newUser[0].phone,
        role: newUser[0].role,
        status: newUser[0].status,
        isApproved: newUser[0].isApproved,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const loginUser = async (payload: TLoginUser) => {
  // 1. Check if user exists
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user || !user._id) {
    throw new AppError(404, 'No user found with this email address!');
  }

  // 2. Check if deleted or blocked
  if (user.isDeleted) {
    throw new AppError(403, 'This user account has been deleted!');
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(403, 'Your user account has been blocked by Admin!');
  }

  // 3. Verify Password
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(400, 'Invalid credentials. Password does not match!');
  }

  // 4. Fetch Role Specific Profile
  let profile = null;
  if (user.role === 'CUSTOMER') {
    profile = await Customer.findOne({ user: user._id, isDeleted: false });
  } else if (user.role === 'CLEANER') {
    profile = await Cleaner.findOne({ user: user._id, isDeleted: false });
  } else if (user.role === 'ADMIN') {
    profile = await Admin.findOne({ user: user._id, isDeleted: false });
  }

  // 5. Issue Tokens
  const jwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isApproved: user.isApproved,
      profile,
    },
  };
};

const googleLogin = async (payload: TGoogleLoginUser) => {
  let user = await User.findOne({ email: payload.email, isDeleted: false });

  const role = payload.role || 'CUSTOMER';
  const isCleaner = role === 'CLEANER';
  const userStatus = isCleaner ? 'PENDING_APPROVAL' : 'APPROVED';
  const isApproved = !isCleaner;

  if (!user) {
    // Register Google User
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const newUser = await User.create(
        [
          {
            name: payload.name || payload.email.split('@')[0],
            email: payload.email,
            phone: payload.phone || '01700000000',
            password: 'GOOGLE_AUTH_OAUTH_USER',
            role: role,
            status: userStatus,
            isApproved: isApproved,
          },
        ],
        { session },
      );

      const userId = newUser[0]._id as unknown as Types.ObjectId;

      if (role === 'CLEANER') {
        await Cleaner.create(
          [
            {
              user: userId,
              name: newUser[0].name,
              email: newUser[0].email,
              phone: newUser[0].phone,
              avatar: payload.avatar || undefined,
              status: 'PENDING_APPROVAL',
              isApproved: false,
            },
          ],
          { session },
        );
      } else if (role === 'ADMIN') {
        await Admin.create(
          [
            {
              user: userId,
              name: newUser[0].name,
              email: newUser[0].email,
              phone: newUser[0].phone,
              avatar: payload.avatar || undefined,
            },
          ],
          { session },
        );
      } else {
        await Customer.create(
          [
            {
              user: userId,
              name: newUser[0].name,
              email: newUser[0].email,
              phone: newUser[0].phone,
              avatar: payload.avatar || undefined,
            },
          ],
          { session },
        );
      }

      await session.commitTransaction();
      await session.endSession();

      user = newUser[0];
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      throw err;
    }
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(403, 'Your user account has been blocked by Admin!');
  }

  // Fetch profile
  let profile = null;
  if (user.role === 'CUSTOMER') {
    profile = await Customer.findOne({ user: user._id, isDeleted: false });
  } else if (user.role === 'CLEANER') {
    profile = await Cleaner.findOne({ user: user._id, isDeleted: false });
  } else if (user.role === 'ADMIN') {
    profile = await Admin.findOne({ user: user._id, isDeleted: false });
  }

  const jwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isApproved: user.isApproved,
      profile,
    },
  };
};

const getMe = async (userId: string, role: string) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted) {
    throw new AppError(404, 'User profile not found!');
  }

  let profile = null;
  if (role === 'CUSTOMER') {
    profile = await Customer.findOne({ user: userId, isDeleted: false });
  } else if (role === 'CLEANER') {
    profile = await Cleaner.findOne({ user: userId, isDeleted: false });
  } else if (role === 'ADMIN') {
    profile = await Admin.findOne({ user: userId, isDeleted: false });
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    isApproved: user.isApproved,
    profile,
  };
};

const changePassword = async (userId: string, payload: TChangePassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user || user.isDeleted) {
    throw new AppError(404, 'User not found!');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(400, 'Old password is incorrect!');
  }

  user.password = payload.newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  return null;
};

export const AuthService = {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  changePassword,
};
