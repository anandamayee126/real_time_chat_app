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
    const getMsg= await axios.get('http://localhost:3000/user/all-messages',{headers:{Authorization:token}});
        console.log("Get messages",getMsg);
        getMsg.data.messages.forEach((ele)=>{
            const msg_p= document.createElement("p");
            msg_p.textContent =ele.user.name+" : "+ele.msg;
            joinee.appendChild(msg_p);
        })

    setTimeout(()=>{
        allUsers();
    },1000)
    
}

const chat= document.getElementById("input");
chat.addEventListener("submit",addMessage);

async function addMessage(e){
    e.preventDefault();
    window.location="chat.html"
    const message=e.target.chat.value;
    console.log(message);
    const sendMsg= await axios.post('http://localhost:3000/user/chat',{message:message},{headers:{Authorization:token}});
    console.log("Sent message",sendMsg);
    
}