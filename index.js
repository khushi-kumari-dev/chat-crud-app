const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const expressError = require("./expressError");

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

// index route
app.get("/chats", async (req, res) => {
  try {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
  } catch (err) {
    next(err);
  }
});
app.get("/", (req, res) => {
  res.send("root is working");
});

// new route
app.get("/chats/new", (req, res) => {
  // throw new expressError(404,"PAGE NOT FOUND");
  res.render("new.ejs");
});

// create route
app.post("/chats", asyncWrap(async (req, res, next) => {
  
    let { from, to, msg } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      msg: msg,
      created_at: new Date(),
    });
    await newChat.save();
    res.redirect("/chats");
  } )
);

// edit route
app.get("/chats/:id/edit", asyncWrap(async (req, res) => {
  
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  } 
));

function asyncWrap(fn){
  return function(req,res,next){
    fn(req,res,next).catch((err)=>next(err)); 
  };  
}

//show route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
  try {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      next(new expressError(404, "CHAT NOT FOUND"));
    }
    res.render("edit.ejs", { chat });
  } catch (err) {
    next(err);
  }
}));

//  update route
app.put("/chats/:id", asyncWrap(async (req, res) => {
  
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { msg: newMsg },
      { runValidators: true, new: true }
    );
    console.log(updatedChat);
    res.redirect("/chats");
  } 
));

// delete route
app.delete("/chats/:id", asyncWrap(async (req, res) => {
  
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log("chat deleted");
    res.redirect("/chats");
  } 
));

app.use((err,req,res,next)=>{
  console.log(err.name);
  if(err.name=== "CastError"){
    console.log("This is a validation error. Please follow rules");
  }
  next(err);
})

//error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "SOME ERROR OCCURED" } = err;
  res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("sever is lstenin to port 8080");
});
