import mongoose from "mongoose";
import { PasswordManager } from "../services/password";

// An interface that describes the properties that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties that a USER MODEL has
// The angled brackes is a generics syntax for TS
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a USER DOCUMENT has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            // select: false,
        },
    },
    {
        toJSON: {
            // A transform function to apply to the resulting document before returning
            transform(doc, ret) {
                // we either can set the versionKey (_id) to false or add to transform method
                ret.id = ret._id;
                delete ret._id;

                delete ret.password; //removes the password property on response
                delete ret.__v;
            },
        },
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashed = await PasswordManager.toHash(this.get("password"));
        this.set("password", hashed);
    }
    next();
});

// Static function
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// const user = User.build({
//     email: 'xpto@xpto.com',
//     password: 'adkasdsd'
// })
export { User };
