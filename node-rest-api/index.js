const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const cors= require('cors');
const multer = require('multer');
const path = require('path');
// const upload = multer({dest:'public/'});

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true,
    useUnifiedTopology: true,})
    .then(()=>console.log("Connected to MongoDB!!"))
    .catch((err)=>console.log(err));

    
app.use(express.urlencoded({extended: false})); 
app.use("/images",express.static(path.join(__dirname,"public/images")));

//middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: 'public/images/',
    filename : (req,file,cb)=>{
        console.log(file.originalname);
        cb(null,req.body.name);
    },
});

const upload = multer({storage:storage});
app.post("/api/uploads",
    upload.single('file'),(req,res)=>{
    try {
        return res.status(200).json("File uploaded successfully!");
    } catch (error) {
        console.log(error);
    }
});


app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
// app.use("/profile/posts",postRoute);

app.listen(8080,()=>{
    console.log("Backend server running!");
})