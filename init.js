const mongoose = require("mongoose");
const Chat= require("./models/chat.js");

main().then((res)=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}
Chat.insertMany([
    {
    from:"neha",
    to:"priya",
    msg:"send me your exam sheets",
    created_at: new Date(),
    },
    {
    from:"khushi",
    to:"deep",
    msg:"hey i have to borrow some books!",
    created_at: new Date(),
    },
    {
    from:"reha",
    to:"poha",
    msg:"hey poha! your name is so funny",
    created_at: new Date(),
    },
    {
    from:"adam",
    to:"leo",
    msg:"have you watched the raj shamani podcast?",
    created_at: new Date(),
    }, 
]);

