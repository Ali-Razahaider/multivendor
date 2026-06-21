import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const shopSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: {
            type: String, required: true,
            minlength: [6, "Password should be at least 6 characters long"],
            select: false
        },
        address: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        zipCode: { type: String, required: true },
        role: { type: String, default: "seller" },
        avatar: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        },
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
        resetPasswordToken: String,
        resetPasswordTime: Date,
    });

shopSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});

shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });
};

shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Shop", shopSchema);
