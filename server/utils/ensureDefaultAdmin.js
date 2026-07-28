import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function ensureDefaultAdmin() {
  try {
    const adminEmail = 'admin@jesambeauty.com';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        name: 'Jesam Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '+234 809 333 7529',
        loyaltyPoints: 9999,
        coupons: ['WELCOME10', 'JESAMVIP', 'FREECARE'],
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('🛡️ Successfully created default admin credentials: admin@jesambeauty.com / admin123');
    }
  } catch (error) {
    console.error('❌ Error checking/creating default admin user:', error);
  }
}
