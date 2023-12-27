// const token= localStorage.getItem("token");
// document.addEventListener('DOMContentLoaded',allUsers);
// const joinee= document.getElementById("joined");
// async function allUsers(e){
//     e.preventDefault();
//     const users= await axios.get('http://localhost:3000/user/all-users',{headers:{Authorization:token}});
//     console.log("users",users);
//     users.data.users.forEach(element => {
//         const p_name= document.createElement("p");
//         p_name.textContent=element.name+" joined";
//         joinee.appendChild(p_name);
//     });
//     const getMsg= await axios.get('http://localhost:3000/message/all-messages',{headers:{Authorization:token}});
//         console.log("Get messages",getMsg);
//         getMsg.data.messages.forEach((ele)=>{
//             const msg_p= document.createElement("p");
//             msg_p.textContent =ele.user.name+" : "+ele.msg;
//             joinee.appendChild(msg_p);
//         })
//         localStorage.setItem("Messages",JSON.stringify(getMsg.data.messages));
//     // setTimeout(()=>{
//     //     allUsers(e);
//     // },1000)
// }

// const chat= document.getElementById("input");
// chat.addEventListener("submit",addMessage);

// async function addMessage(e){
//     e.preventDefault();
//     window.location="chat.html"
//     const message=e.target.chat.value;
//     console.log("..",message);
//     const sendMsg= await axios.post('http://localhost:3000/message/addMessage',{message:message},{headers:{Authorization:token}});
//     console.log("Sent message",sendMsg);
    
// }


const messages = document.querySelector('.messages')
let rendered = false
const groups = document.querySelector('.show-groups')
window.addEventListener('load' , renderElemets)


async function renderElemets(){
    try{
        const res = await axios.get('http://localhost:3000/group/get-groups' ,{
            headers : {
                'Authorization' : localStorage.getItem('token')
            }
        })
        console.log(res)
        res.data.forEach(group => {
            showGroups(group)
        })
    }catch(e){
        console.log(e)
    }
}

function showGroups(group){
    const div = document.createElement('div')
    div.textContent = group.name
    div.className= 'group-items'
    div.id = group.id

    div.onclick = async()=>{
        console.log(group.id)
        try{
            const res = await axios.get(`http://localhost:3000/message/get-messages/${group.id}` , {
                headers : {
                    'Authorization':localStorage.getItem('token')
                }
            })
            const res2 = await axios.get(`http://localhost:3000/group/all-users/${group.id}` ,{
                headers : {
                    'Authorization':localStorage.getItem('token')
                }
            })
            console.log(res)
            console.log(res2)
            messages.innerHTML =``
            res.data.messages.forEach(message =>{
                showMessage(message ,res.data.id , res2.data )
            })
        }catch(e){
            console.log(e)
        }
    }

    groups.appendChild(div)
}
function showMessage(data , id, users){
    const div = document.createElement('div')
    console.log(typeof users)
    if(id == data.memberId){
        div.className = 'u-message'
        div.textContent = "You: "+ data.message
    }else{
        div.className = 'o-message'
        const user = users.find(user => data.memberId == user.member.id)
        div.textContent =  user.name+ ": "+ data.message

    }

    messages.appendChild(div)
}

document.forms[0].addEventListener('submit' , sendMessage);  ////????
async function sendMessage(e){
    try{
        e.preventDefault()
        const data = {message : e.target.message.value}
        const res = await axios.post('http://localhost:3000/message/add-message' , data , {
            headers : {
                'auth-token' : localStorage.getItem('token')
            }
        })
        console.log(res)
        showMessage(data , true)
        e.target.message.value =''
    }catch(e){
        console.log(e)
    }
    
}

document.getElementById('create-new-group').addEventListener('submit', createNewGroup)

async function createNewGroup(e){
    try{
        e.preventDefault()
        console.log(e.target.name.value)
        const group = await axios.post('http://localhost:3000/group/create' , {"name" : e.target.name.value} , {
            headers : {
                'auth-token':localStorage.getItem('token')
            }
        })
        console.log(group)
    }catch(e){
        console.log(e)
    }
}

document.getElementById('create-grp').addEventListener('click' , ()=>{
    document.querySelector('.new-group').classList.remove('hide')
})

