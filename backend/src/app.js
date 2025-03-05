import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app =express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(cookieParser());

import userRoutes from './routes/user.routes.js';
import noteRoutes from './routes/notes.route.js';

app.use("/api/v1/users",userRoutes);
app.use("/api/v1/notes",noteRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,'/frontend/dist')));
}

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
})

export default app