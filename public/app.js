const form=document.getElementById("wishForm");
const reply=document.getElementById("reply");
const replyTitle=document.getElementById("replyTitle");
const replyText=document.getElementById("replyText");
const status=document.getElementById("status");

function celebrate(){
 const box=document.getElementById("confetti");
 for(let i=0;i<80;i++){
  const s=document.createElement("span");
  s.style.left=Math.random()*100+"vw";
  s.style.background=`hsl(${Math.random()*360},90%,65%)`;
  s.style.animationDuration=(2+Math.random()*2)+"s";
  box.appendChild(s);
  setTimeout(()=>s.remove(),4500);
 }
}

form.addEventListener("submit",async e=>{
 e.preventDefault();
 const name=document.getElementById("name").value.trim();
 const wish=document.getElementById("wish").value.trim();
 status.textContent="Sending your wish…";
 try{
  const r=await fetch("/api/wish",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fromName:name,message:wish})});
  const data=await r.json();
  if(!r.ok) throw new Error(data.error||"Failed");

  // This is the personalized message the visitor sees after wishing Yogesh.
  replyTitle.textContent=`Yogesh says: "I love you much much more, ${name} ❤️"`;
  replyText.textContent=`Thank you ${name} for wishing Yogesh! Your lovely birthday wish has reached him. 🎂💖`;
  reply.hidden=false;
  status.textContent="Wish sent successfully! 🎉";
  status.className="success";
  form.reset();
  celebrate();
  reply.scrollIntoView({behavior:"smooth",block:"center"});
 }catch(err){
  status.textContent="Sorry, your wish could not be sent. Please try again.";
  status.className="error";
 }
});