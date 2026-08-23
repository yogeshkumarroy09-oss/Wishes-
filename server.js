import express from "express";
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";
dotenv.config();
const app=express();
const port=process.env.PORT||3000;
const dir=path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:"20kb"}));
app.use(express.static(path.join(dir,"public")));

app.post("/api/wish",async(req,res)=>{
 try{
  const {fromName,message}=req.body||{};
  if(!fromName?.trim()||!message?.trim()) return res.status(400).json({ok:false,error:"Name and wish are required"});
  const keys=["EMAILJS_PUBLIC_KEY","EMAILJS_PRIVATE_KEY","EMAILJS_SERVICE_ID","EMAILJS_TEMPLATE_ID","RECIPIENT_EMAIL"];
  if(keys.some(k=>!process.env[k])) return res.status(500).json({ok:false,error:"EmailJS is not configured"});
  const r=await fetch("https://api.emailjs.com/api/v1.0/email/send",{
   method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({
    service_id:process.env.EMAILJS_SERVICE_ID,
    template_id:process.env.EMAILJS_TEMPLATE_ID,
    user_id:process.env.EMAILJS_PUBLIC_KEY,
    accessToken:process.env.EMAILJS_PRIVATE_KEY,
    template_params:{
     to_email:process.env.RECIPIENT_EMAIL,
     from_name:fromName.trim(),
     message:message.trim(),
     birthday_person:"Yogesh",
     submitted_at:new Date().toISOString()
    }
   })
  });
  if(!r.ok) return res.status(502).json({ok:false,error:"Email could not be sent"});
  res.json({ok:true});
 }catch(e){console.error(e);res.status(500).json({ok:false,error:"Server error"});}
});
app.listen(port,()=>console.log("Birthday site: http://localhost:"+port));