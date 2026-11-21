import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email!'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [4, 'Password should be greater than 4 characters'],
    select: false,
  },
  phoneNumber: {
    type: String,
  },
  addresses: [
    {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      addressType: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    default: 'user',
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  resetPasswordToken: { type: String, select: false },
  resetPasswordTime: { type: Date, select: false },
});

//  Hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (!this.isNew) this.passwordChangedAt = new Date();
  // Activation tokens carry an already-hashed password; don't hash it twice.
  if (this.$locals.passwordIsHashed) return;
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(12));
});

// Never serialize secrets, even if a query selected them.
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordTime;
    return ret;
  },
});

// compare password (salt is stored in the hashed string so no need to save and provide salt)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
