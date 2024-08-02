const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const EncryptedStringSchema = new Schema({
  encryptedData: { type: String, required: true },
  iv: { type: String, required: true }
});

const EncryptedOptionSchema = new Schema({
  optionText: { type: EncryptedStringSchema, required: true },
  isCorrect: { type: Boolean, required: true }
});

const EncryptedQuizSchema = new Schema({
  question: { type: EncryptedStringSchema, required: true },
  options: { type: [EncryptedOptionSchema], required: true }
});

const ChatSchema = new Schema({
  title: {
    encryptedData:{type: String},
    iv: {type: String}
  }  
  ,
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  uid:{
    type:String,
    required:true
  },
  aiPrompts: {
    type: [{
      user: {
        encryptedData:{type: String},
        iv: {type: String}
      },
      ai: {
        encryptedData:{type: String},
        iv: {type: String}
      },
    }],
    default: [],
  },
  isDoc: {
    type: Boolean,
    required: true,
  },
  isVdo: {
    type: Boolean,
    required: true,
  },
  vdoUrl: {
    type: String,
    required: function () {
      return this.isVdo;
    },
  },
  pdfUrl: {
    type: String,
    required: function () {
      return this.isDoc;
    },
  },
  summary:{
    encryptedData:{type: String , default :""},
    iv: {type: String, default:""}
  },
  notes: {
    type: [{
      note: {
        encryptedData: { type: String },
        iv: { type: String }
      }
    }],
    default: []
  },
  quiz: {
    type: [EncryptedQuizSchema],
    default: []
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
});

ChatSchema.pre('save', function (next) {
  this.lastUpdatedAt = Date.now();
  if (this.isVdo) {
    if (!this.summary ) {
      this.summary.encryptedData = ""; 
      this.summary.iv = ""; 
    }
    if (!this.quiz) {
      this.quiz = []; 
    }
    if (!this.summary) {
      this.summary.encryptedData = ""; 
      this.summary.iv = ""; 
    }
  } 
  else if(this.isDoc){
    if (!this.notes) {
      this.notes = []; 
    }
    if (!this.quiz) {
      this.quiz = []; 
    }
    if (!this.summary) {
      this.summary.encryptedData = ""; 
      this.summary.iv = ""; 
    }
  }
  else {
    this.vdoUrl = undefined;
    this.pdfUrl = undefined;
    this.summary = undefined;
    this.notes = undefined;
    this.quiz = undefined;
  }
  next();
});


module.exports = mongoose.model("Chat", ChatSchema);