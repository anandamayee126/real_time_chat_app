// const messages= document.getElementsBy('group_messages')
let group=null;
let userId=null;
document.addEventListener('DOMContentLoaded',getData);
async function getData(e){
    e.preventDefault();
    renderGroup();
}

async function renderGroup(){
    const groups= await axios.get("http://localhost:3000/group/get-groups",{headers : {
        'Authorization':localStorage.getItem('token')
    }});
    console.log("groups are: ",groups);
    userId= groups.data.user_id;
    console.log("userId is: ",userId);
    const my_groups= document.getElementById('my_groups');
    my_groups.classList.remove("hide");
    groups.data.groups.forEach((grp)=>{
        const h_name= document.createElement('h4');
        h_name.classList.add= "render_group";
        h_name.textContent=grp.name;
        const chat_btn= document.createElement('button');
        chat_btn.textContent="chat";
        h_name.appendChild(chat_btn);
        my_groups.appendChild(h_name);
        chat_btn.onclick= async()=>{
            //for old messages
            renderUser(grp.id,userId);
            // renderMessages(grp.id);
            //for the new msg
            const input_text= document.getElementById("input-text-message");
            input_text.classList.remove("hide");
            input_text.addEventListener('submit',addMessage);
            async function addMessage(e){     // your sendMessage === My addMessage 
                e.preventDefault();
                const msg= e.target.chat.value;
                const obj= {
                    message:msg,
                    groupId:grp.id
                }
                group=grp;
                const addMessage= await axios.post('http://localhost:3000/message/add-message',obj,{headers : {
                    'Authorization':localStorage.getItem('token')
                }})
                console.log("Messages added: ",addMessage);
                const group_message= document.getElementById("group_messages");
                group_message.classList.remove('hide');
                const div = document.createElement('div')
                div.className = 'u-message'
                div.textContent = "You: "+ addMessage.msg
                group_message.appendChild(div)
                e.target.chat.value =''

            }
    }})
}

// async function renderMessages(group_id){
//     try{
            
//         let final_messages = JSON.parse(localStorage.getItem(`message-${group_id}`) ) || []
//         let final_users = JSON.parse(localStorage.getItem(`user-${group_id}`)) || []
//         let mId=0
//         let uId =0 
//         if(final_messages.length > 0)
//             mId = final_messages[final_messages.length -1].id
//         if(final_users.length>0)
//              uId = final_users[final_users.length -1].id
//         const res = await axios.get(`http://localhost:4000/message/get-messages/${group_id}/?messageId=${mId}` , {
//             headers : {
//                 'auth-token':localStorage.getItem('token')
//             }
//         })
//         const res2 = await axios.get(`http://localhost:4000/group/all-users/${group_id}/?id=${uId}` ,{
//             headers : {
//                 'auth-token':localStorage.getItem('token')
//             }
//         })
//         console.log(res)
//         console.log(res2)
//         messages.innerHTML =``
//         final_messages = [...final_messages , ...res.data.messages]
//         document.querySelector('.group-message h2').textContent = group.name
//         final_users = [...final_users , ...res2.data]
//         final_messages.forEach(message =>{
//             showMessage(message ,res.data.id , final_users )
//         })
//         users.innerHTML = ``


//         final_users.forEach(user =>{
//             showUser(user)
//         })
//         localStorage.setItem(`message-${group.id}` , JSON.stringify(final_messages))
//         localStorage.setItem(`user-${group.id}`,JSON.stringify(final_users))
        
//     }catch(e){
//         console.log(e)
//     }
// }

async function renderUser(group_id,userId){
    const users= await axios.get(`http://localhost:3000/group/all-users/${group_id}`,{headers : {
        'Authorization':localStorage.getItem('token')
    }});
    console.log("users are: ",users);
    const group_members= document.getElementById("group_members");
    group_members.classList.remove("hide");

    users.data.forEach((user) => {
        console.log("user is",user);
        const p = document.createElement('p')
        p.textContent = user.name+"   "
        p.className='user_of_grp'
        if(user.member.admin){
            const span = document.createElement('span')
            span.textContent = 'admin'
            p.appendChild(span)
        }
        else{
            const remove_button = document.createElement('button');
            remove_button.textContent="X";
            remove_button.classList.add="btn";
            remove_button.onclick = async() =>{
                if(user.member.admin){
                    const remove_user= await axios.post('http://localhost:3000/group/remove_user',{user_id:user.id},{headers : {
                        'Authorization':localStorage.getItem('token')
                    }})
                    console.log("remove_user",remove_user);
                }
                else{
                    alert("you are not the admin... U can't remove anyone");
                }
            }
            p.appendChild(remove_button);
        }
        group_members.appendChild(p)
    })
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

const token= localStorage.getItem("token");
var group_id=null;

const make_group= document.getElementById('make_group');
make_group.addEventListener('click',createGroup);

const show_group= document.getElementById('show_group');
show_group.addEventListener('click',showAllGroup);

function createGroup(e){
    e.preventDefault();
    const create_group= document.getElementById('create_group');
    create_group.classList.remove("hide");

    const form_create_group= document.getElementById('create_group_form');
    form_create_group.addEventListener('submit',create_Group);
    async function create_Group(e){
        e.preventDefault();
        const name=e.target.group_name.value;
        const create= await axios.post('http://localhost:3000/group/create',{name},{
            headers : {
                'Authorization':localStorage.getItem('token')
            }
        })

        group_id=create.data.group.id;
        console.log("group created",create);

        const joinee= document.getElementById('all-joinee');  
        joinee.classList.remove("hide");

        const members= await axios.get('http://localhost:3000/group/suggested_members',{headers : {
            'Authorization':localStorage.getItem('token')
        }})
        console.log("suggested_members",members);
        members.data.users.forEach((user)=>{
            const p_name= document.createElement('p');
            p_name.textContent= user.name+"  ";
            const select_btn= document.createElement('button');
            select_btn.textContent="select";
            p_name.appendChild(select_btn);
            joinee.appendChild(p_name);

            console.log(group_id);
            select_btn.onclick=async()=>{
                const add_user= await axios.post('http://localhost:3000/group/join_group',{group_id},{
                    headers : {
                        'Authorization':localStorage.getItem('token')
                    }
                })
                console.log("Added Users are:",add_user);
            }
        })
        const add_btn= document.createElement('button');
        add_btn.textContent="Done";
        joinee.appendChild(add_btn);
        add_btn.onclick = ()=>{
            window.location="chat.html"
        }
    } 
}

async function showAllGroup(e)
{
    e.preventDefault();
    const all_groups = await axios.get(`http://localhost:3000/group/showAllGroup`,{headers : {
        'Authorization':localStorage.getItem('token')
    }})
    console.log("All groups are: ",all_groups);

    const groups = document.getElementById('all_groups');
    groups.classList.remove('hide');
    const form = document.createElement('form');
    form.classList.add('all_group');
    all_groups.data.groups.forEach(group =>{
        const p_name= document.createElement('p');
        p_name.textContent= group.name+"   ";
        const add_button = document.createElement('button');
        add_button.textContent="Join Group";
        add_button.onclick=async(e)=>{
            e.preventDefault();
            console.log(group.id);
            const add_grp= await axios.post('http://localhost:3000/group/join_group',{group_id:group.id},{headers : {
                'Authorization':localStorage.getItem('token')
            }})

            console.log(add_grp);

        }
        p_name.appendChild(add_button);
        form.appendChild(p_name);
        groups.appendChild(form);
    })
}





