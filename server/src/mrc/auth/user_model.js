import mongoose from "mongoose";

const emailValidator = {
  validator: (value) => {
    const re =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;
    return re.test(value);
  },
  message: "Please enter a valid email",
};
const nameValidator = {
  validator: (value) => {
    const re = /^[A-Za-z\s]+$/;
    return re.test(value);
  },
  message: "Name must only contain letters and spaces",
};
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: emailValidator,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      validate: nameValidator,
      minLength: 3,
      maxLength: 30,
    },

    password: {
      trim: true,
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
