const chat= document.getElementById("message");
chat.addEventListener("submit",addMessage);

const token= localStorage.getItem("token");
async function addMessage(e){
    e.preventDefault();
    const message=e.target.msg.value;
    console.log(message);
    const sendMsg= await axios.post('http://localhost:3000/user/chat',{message:message},{headers:{Authorization:token}});
    console.log("Sent message",sendMsg);
    if(sendMsg.data.success){
        const chatbox= document.getElementById("chat-box");
        chatbox.classList.remove("hide");
         
        const name_input= document.createElement("input");
        const msg_input= document.createElement("input");
        name_input.type="text";
        msg_input.type="text";
    }
}