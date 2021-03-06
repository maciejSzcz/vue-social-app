import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: String,
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    friendsRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  session: false,
});
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(aggregatePaginate);

export default mongoose.model('User', UserSchema);
