const Chat = require("../models/Chats")
const User = require("../models/User")
const axios = require("axios")

const crypto = require("crypto")

const algorithm = 'aes-256-cbc';
const key = Buffer.from('a3f4c1e8d3b1a5f6c8e9b7d2c5a4e7f9a3c5d1e7f2b4a9c8e1d3b5a7f4c6e8d1', 'hex');
const iv = crypto.randomBytes(16); 

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
}

function decrypt(encrypted) {
    if(encrypted.iv==="" && encrypted.encryptedData===""){
        return ""
    }
    const iv = Buffer.from(encrypted.iv, 'hex');
    const encryptedText = Buffer.from(encrypted.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


async function generateUniqueCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const existingChat = await Chat.findOne({ chatId: result }).exec();
    if (existingChat) {
      return generateUniqueCode(length);
    }
    return result;
}

exports.createChat = async (req, res) => {
    const code = await generateUniqueCode(10);
    const {uid , isDoc , isVdo} = req.body ;
    let title ="";
    let summary = "";
    let notes = "";
    let quiz = [];
    const instance = axios.create({
        timeout: 300000
    });
    if(isDoc===true  ){
        const {pdfUrl} = req.body;
        const data = {"pdfUrl":pdfUrl , "assignmentCode" : code}
        const MLResponse = await instance.post("http://35.202.78.159/pdfText" , data )
        title = MLResponse.data.title;
        summary = MLResponse.data.summary ;
        notes = MLResponse.data.notes;
        quiz = MLResponse.data.mcq; 
    }
    if(isVdo===true){
        const {vdoUrl} = req.body ;
        const data = {"ytUrl":vdoUrl , "assignmentCode" : code}
        const MLResponse = await instance.post("http://35.202.78.159/ytTranscript" , data )
        title = MLResponse.data.title;
        summary = MLResponse.data.summary ;
        notes = MLResponse.data.notes;     
        quiz = MLResponse.data.mcq; 
    }
    if(!isVdo && !isDoc) title = "AI chat"
    const encryptedTitle = encrypt(title);
    const chat = new Chat({
        ...req.body,
        title: {
            encryptedData: encryptedTitle.encryptedData,
            iv: encryptedTitle.iv
        },
        chatId: code ,
    });
    try {
        const doc = await chat.save();
        const myuser = await User.findOne({uid:uid});
        myuser.chats.push({ chatId: code, lastUpdatedAt: doc.lastUpdatedAt })
        await myuser.save(); 
        await addSummary(code , summary);
        await addQuiz(code , quiz)
        await addNote(code , notes);
        res.status(201).json({message: "Chat created successfully" ,code:code});
    } catch (err) {
        res.status(400).send(err);
    }
} 

exports.fetchChats = async(req,res)=>{
    const {uid} = req.params ;
    try {
        const myuser = await User.findOne({uid:uid});
        if (!myuser) {
            return res.status(404).json({ message: "User not found" });
        }
        const chatDetails = await Chat.find({ chatId: { $in: myuser.chats.map(c => c.chatId) } }).sort({ lastUpdatedAt: -1 }).select('chatId title lastUpdatedAt');
        const decryptedChatDetails = chatDetails.map(chat => {
            const title= chat.title 
            const decryptedTitle = decrypt(title);
            return {
                chatId: chat.chatId,
                title: decryptedTitle,
                lastUpdatedAt: chat.lastUpdatedAt
            };
        });
        res.status(200).json({ chats: decryptedChatDetails });
    } catch (error) {
        res.status(400).send(error.message);
    }
}


exports.fetchChat = async (req, res) => {
    const { chatId, uid } = req.params;
    try {
      const mychat = await Chat.findOne({ chatId: chatId, uid: uid });
      if (!mychat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      const result = {};
      result["title"] = await decrypt(mychat.title); 
      result["aiPrompts"] = mychat.aiPrompts.map(prompt => ({
        user: decrypt(prompt.user), 
        ai: decrypt(prompt.ai) 
      }));
      result["isDoc"] = mychat.isDoc;
  
      if (mychat.isDoc) {
        result["pdfUrl"] = mychat.pdfUrl;
  
        if (mychat.quiz && mychat.quiz.length > 0) {
            const decryptedQuiz = await Promise.all(mychat.quiz.map(async (quiz) => {
                const decryptedQuestion = await decrypt(quiz.question); // Await decryption of question
                const decryptedOptions = await Promise.all(quiz.options.map(async (option) => {
                    const decryptedOptionText = await decrypt(option.optionText); // Await decryption of optionText
                    return { 
                        optionText: decryptedOptionText,
                        isCorrect: option.isCorrect 
                    };
                }));
                return { question: decryptedQuestion, options: decryptedOptions };
            }));
            result["quiz"] = decryptedQuiz;
        }
        
          
        if (mychat.notes && mychat.notes.length > 0) {
            const decryptedNotes = await Promise.all(mychat.notes.map(async (note) => ({
                note:  decrypt(note.note) 
            })));
            console.log("Decrypted Notes:", decryptedNotes);
            result["notes"] = decryptedNotes;
        }
  
        if (mychat.summary) {
          result["summary"] = decrypt(mychat.summary); 
        }
      }
  
      result["isVdo"] = mychat.isVdo;
      if (mychat.isVdo) {
        result["vdoUrl"] = mychat.vdoUrl;
        if (mychat.quiz && mychat.quiz.length > 0) {
          const decryptedQuiz = await Promise.all(mychat.quiz.map(async (quiz) => {
              const decryptedQuestion = await decrypt(quiz.question); // Await decryption of question
              const decryptedOptions = await Promise.all(quiz.options.map(async (option) => {
                  const decryptedOptionText = await decrypt(option.optionText); // Await decryption of optionText
                  return { 
                      optionText: decryptedOptionText,
                      isCorrect: option.isCorrect 
                  };
              }));
              return { question: decryptedQuestion, options: decryptedOptions };
          }));
          result["quiz"] = decryptedQuiz;
      }
      if (mychat.notes && mychat.notes.length > 0) {
          const decryptedNotes = await Promise.all(mychat.notes.map(async (note) => ({
              note:  decrypt(note.note) 
          })));
          result["notes"] = decryptedNotes;
      }

      if (mychat.summary) {
        result["summary"] = decrypt(mychat.summary); 
      }               
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  


  exports.fetchMessages = async (req, res) => {
    const { chatId, uid } = req.params;
    try {
      const mychat = await Chat.findOne({ chatId: chatId, uid: uid });
      if (!mychat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      const result = {};
      result["title"] = await decrypt(mychat.title); 
      result["aiPrompts"] = mychat.aiPrompts.map(prompt => ({
        user: decrypt(prompt.user), 
        ai: decrypt(prompt.ai) 
      }));
      result["isDoc"] = mychat.isDoc;
      result["isVdo"] = mychat.isVdo;
      res.status(200).json(result);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  


exports.delChat = async(req,res) =>{
    const {chatId,uid} = req.body ;
    try {
        const mychat = await Chat.findOneAndDelete({chatId:chatId , uid:uid});
        if (!mychat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        const myuser = await User.findOne({ uid: uid });
        if (myuser) {
            myuser.chats = myuser.chats.filter(chat => chat.chatId !== chatId);
            await myuser.save();
        }
        res.status(200).json({message:"deleted Chat Successfully"})
    } catch (error) {
        res.status(400).send(err);
    }
}

exports.addPrompt = async (req , res ) =>{
    const { id } = req.params;
    const { user, ai  } = req.body; 
    try {
        const mychat = await Chat.findOne({ chatId: id });
        if (!mychat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        const userencrypted = await encrypt(user);
        const aiencrypted = await encrypt(ai);
        mychat.aiPrompts.push({
            user: {encryptedData: aiencrypted.encryptedData, iv : aiencrypted.iv},
            ai: {encryptedData: userencrypted.encryptedData, iv : userencrypted.iv},
        });
        mychat.lastUpdatedAt = Date.now();
        mychat.save();
        const myuser = await User.findOne({ uid: mychat.uid });
        const chatIndex = myuser.chats.findIndex(chat => chat.chatId === id);
        if (chatIndex !== -1) {
            myuser.chats[chatIndex].lastUpdatedAt = mychat.lastUpdatedAt;
            await myuser.save();
        }
        res.status(200).json({ message: "AI prompt added successfully", chat: mychat })
    } catch (error) {
        res.status(400).send(err);
    }
}

const encryptOptions = async (options) => {
    const encryptedOptions = [];
    for (const [optionText, isCorrect] of Object.entries(options)) {
      const encryptedOptionText = await encrypt(optionText);
      encryptedOptions.push({
        optionText: {
          encryptedData: encryptedOptionText.encryptedData,
          iv: encryptedOptionText.iv
        },
        isCorrect: isCorrect
      });
    }
    return encryptedOptions;
  };
  
  const addQuiz = async (id, mcq) => {
    try {
      const mychat = await Chat.findOne({ chatId: id });
      if (!mychat) {
        return -1;
      }  
      for (const item of mcq) {
        const encryptedQuestion = await encrypt(item.question);
        const encryptedOptions = await encryptOptions(item.options);
        
        mychat.quiz.push({
          question: {
            encryptedData: encryptedQuestion.encryptedData,
            iv: encryptedQuestion.iv
          },
          options: encryptedOptions
        });
      }
  
      mychat.lastUpdatedAt = Date.now();
      await mychat.save();
  
      const myuser = await User.findOne({ uid: mychat.uid });
      const chatIndex = myuser.chats.findIndex(chat => chat.chatId === id);
      if (chatIndex !== -1) {
        myuser.chats[chatIndex].lastUpdatedAt = mychat.lastUpdatedAt;
        await myuser.save();
      }
      return mychat;
    } catch (error) {
      console.error(`Error adding quiz: ${error.message}`);
      return -1;
    }
  }
  

  
const addNote = async (id, notes) => {
    try {
        const mychat = await Chat.findOne({ chatId: id });
        if (!mychat) {
            console.log("Chat not found");
            return -1;
        }
        const encryptedNote = encrypt(notes);
        mychat.notes.push({
            note: { encryptedData: encryptedNote.encryptedData, iv: encryptedNote.iv }
        });
        await mychat.save();
        const myuser = await User.findOne({ uid: mychat.uid });
        const chatIndex = myuser.chats.findIndex(chat => chat.chatId === id);
        if (chatIndex !== -1) {
            myuser.chats[chatIndex].lastUpdatedAt = mychat.lastUpdatedAt;
            await myuser.save();
        }
        return mychat;
    } catch (error) {
        console.error("Error adding note:", error);
        return -1;
    }
}



const addSummary= async (id , summary) =>{
    try {
        const mychat = await Chat.findOne({ chatId: id });
        if (!mychat) {
            return -1;
        }
        if(mychat.isDoc === false && mychat.isVdo===false){
            return -1;
        }
        try {
            const encryptedSummary = await encrypt(summary)
            mychat.summary={encryptedData:encryptedSummary.encryptedData , iv:encryptedSummary.iv};
            await mychat.save();
            const myuser = await User.findOne({ uid: mychat.uid });
            const chatIndex = myuser.chats.findIndex(chat => chat.chatId === id);
            if (chatIndex !== -1) {
                myuser.chats[chatIndex].lastUpdatedAt = mychat.lastUpdatedAt;
                await myuser.save();
            }
            return mychat;
        } catch (error) {
            return -1
        }
    } catch (error) {
        return -1 ;
    }
}


exports.updateChatTitle = async (req, res) => {
  const { id } = req.params;
  const { title, uid } = req.body;
  try {
      const user = await User.findOne({ uid });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      const chatIndex = user.chats.findIndex(chat => chat.chatId === id);
      if (chatIndex === -1) {
          return res.status(404).json({ message: "Chat not found" });
      }
      const chatId = user.chats[chatIndex].chatId;
      const mychat = await Chat.findOne({ chatId });
      if (!mychat) {
          return res.status(404).json({ message: "Chat not found in Chat collection" });
      }
      const encryptedTitle = encrypt(title);
      mychat.title = encryptedTitle;
      mychat.lastUpdatedAt = Date.now();
      await mychat.save();

      const decryptedChat = {
          chatId: mychat.chatId,
          title: decrypt(mychat.title),
          lastUpdatedAt: mychat.lastUpdatedAt
      };
      console.log(decryptedChat);

      res.status(200).json({ message: "Chat title updated successfully", chat: decryptedChat });
  } catch (error) {
      res.status(400).json({ message: "Error updating chat title", error });
  }
};