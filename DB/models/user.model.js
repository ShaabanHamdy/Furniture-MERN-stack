import bc from 'bcryptjs'
import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required'],
        min: [2, 'minimum length 2 character'],
        max: [20, 'maximum length 20 character'],
    },
    lastName: {
        type: String,
        required: [true, 'lastName required'],
        min: [2, 'minimum length 2 character'],
        max: [20, 'maximum length 20 character'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique'],
    },

    password: {
        type: String,
        required: [true, 'password is  required'],
    },
    phone: String,
    role: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    },
    status: {
        type: String,
        default: "offline",
        enum: ["offline", "online"]
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],


    DOB: String,
    forgetCode: {
        type: Number,
        default: null
    },
    changePasswordTime: {
        type: Date
    },
    image: Object,
    gender: {
        type: String,
        default: "male",
        enum: ["male", "female"]
    }

}, {
    timestamps: true
})

//       this hook for     hash password
userSchema.pre("save", function (next, doc) {
    this.password = bc.hashSync(this.password, +process.env.SALT_ROUNDS)
    next()
})


const userModel = mongoose.models.User || model("User", userSchema)

export default userModel