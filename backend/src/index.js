import dotenv  from 'dotenv';
import app from './app.js';
import connectDB from './db/index.js';

dotenv.config({path:'./.env'})

connectDB()
.then(()=>{
    app.listen(8000,()=>{
        console.log("Connected to the server successfully at port :",8000)
    });
    
})
.catch((err)=>
  console.log("Mongdb connection error",err)
)
