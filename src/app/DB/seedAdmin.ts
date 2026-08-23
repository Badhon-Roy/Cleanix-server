import { User } from '../modules/user/user.model';
import { Admin } from '../modules/admin/admin.model';

export const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.role = 'ADMIN';
      user.status = 'APPROVED';
      user.isApproved = true;
      user.password = '123456';
      await user.save();
    } else {
      user = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: '123456',
        phone: '01700000000',
        role: 'ADMIN',
        status: 'APPROVED',
        isApproved: true,
      });
    }

    const adminProfile = await Admin.findOne({ user: user._id });
    if (!adminProfile) {
      await Admin.create({
        user: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '01700000000',
      });
    }

    console.log('👑 Admin account (admin@gmail.com) created/updated successfully!');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};
