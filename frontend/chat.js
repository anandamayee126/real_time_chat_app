const token= localStorage.getItem("token");
document.addEventListener('DOMContentLoaded',allUsers);
async function allUsers(e){
    e.preventDefault();
    const users= await axios.get('http://localhost:3000/user/all-users',{headers:{Authorization:token}});
    console.log("users",users);
    const joinee= document.getElementById("joined");
    users.data.users.forEach(element => {
        const p_name= document.createElement("p");
        p_name.textContent=element.name+" joined";
        joinee.appendChild(p_name);
    });
    
}

// const chat= document.getElementById("message");
// chat.addEventListener("submit",addMessage);

// async function addMessage(e){
//     e.preventDefault();
//     const message=e.target.msg.value;
//     console.log(message);
//     const sendMsg= await axios.post('http://localhost:3000/user/chat',{message:message},{headers:{Authorization:token}});
//     console.log("Sent message",sendMsg);
//     if(sendMsg.data.success){
//         const chatbox= document.getElementById("chat-box");
//         chatbox.classList.remove("hide");
         
//         const name_input= document.createElement("input");
//         const msg_input= document.createElement("input");
//         name_input.type="text";
//         msg_input.type="text";
//     }
// }