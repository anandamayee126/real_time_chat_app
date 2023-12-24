const token= localStorage.getItem("token");
document.addEventListener('DOMContentLoaded',allUsers);
const joinee= document.getElementById("joined");
async function allUsers(e){
    e.preventDefault();
    const users= await axios.get('http://localhost:3000/user/all-users',{headers:{Authorization:token}});
    console.log("users",users);
    users.data.users.forEach(element => {
        const p_name= document.createElement("p");
        p_name.textContent=element.name+" joined";
        joinee.appendChild(p_name);
    });
    
}

const chat= document.getElementById("input");
chat.addEventListener("submit",addMessage);

async function addMessage(e){
    e.preventDefault();
    const message=e.target.chat.value;
    console.log(message);
    const sendMsg= await axios.post('http://localhost:3000/user/chat',{message:message},{headers:{Authorization:token}});
    console.log("Sent message",sendMsg);
    console.log(sendMsg.data.message.msg);
    console.log(sendMsg.data.name);

    if(sendMsg.data.success){
        const msg_p= document.createElement("p");
        msg_p.textContent =sendMsg.data.name+" : "+sendMsg.data.message.msg;
        joinee.appendChild(msg_p);

    }
}