import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password should be at least 6 characters long'],
    select: false,
  },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  zipCode: { type: String, required: true },
  role: { type: String, default: 'seller' },
  avatar: {
    type: String,
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  },
  description: { type: String },
  withdrawMethod: {
    type: Object,
    default: null,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  transections: [
    {
      _id: String,
      amount: Number,
      updatedAt: Date,
      status: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  passwordChangedAt: Date,
  resetPasswordToken: { type: String, select: false },
  resetPasswordTime: { type: Date, select: false },
});

shopSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (!this.isNew) this.passwordChangedAt = new Date();
  if (this.$locals.passwordIsHashed) return;
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(12));
});

shopSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordTime;
    return ret;
  },
});

shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Shop', shopSchema);
