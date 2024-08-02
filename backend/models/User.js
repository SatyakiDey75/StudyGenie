const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
      type:String
    },
    email:{
      type:String,
      required:true,
      unique:true
    },
    uid:{
      type:String,
      required:true
    },
    chats: [
      {
        chatId: {
          type: String,
          required: true
        },
        lastUpdatedAt: {
          type: Date,
          required: true,
          default: Date.now
        }
      }
    ],  
  });

module.exports = mongoose.model('User', UserSchema);