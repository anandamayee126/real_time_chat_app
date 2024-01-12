
// 
// var options = {
//     rememberUpgrade:true,
//     transports: ['websocket'],
//     secure:true, 
//     rejectUnauthorized: false
// }
// var socket = io.connect('http://localhost:3000', options);
// let room=null;

const messages = document.getElementById('groupMessages')
let group = null;
let userId = null;
var currentGroup = null

document.addEventListener('DOMContentLoaded', getData);
async function getData(e) {
    e.preventDefault();
    const loggedUser = await axios.get('http://localhost:3000/user/showId', {
        headers: {
            'Authorization': localStorage.getItem('token'),
            "Access-Control-Allow-Origin": "*"
        }
    });
    const userWelcome = document.getElementById('userWelcome');
    console.log("abcdfr", loggedUser);
    userWelcome.textContent = `Hi ${loggedUser.data.user.name} !`
    renderGroup();
}

async function renderGroup() {
    const groups = await axios.get("http://localhost:3000/group/getGroups", {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    });
    console.log("groups are: ", groups);
    const myGroups = document.getElementById('myGroups');
    myGroups.classList.remove("hide");
    groups.data.groups.forEach((grp) => {

        const hName = document.createElement('h4');
        hName.classList.add = "renderGroup";
        hName.textContent = grp.name;
        const chatBtn = document.createElement('button');
        chatBtn.textContent = "chat";
        chatBtn.classList.add = "chatBtn";
        hName.appendChild(chatBtn);
        myGroups.appendChild(hName);

        chatBtn.onclick = async () => {
            console.log("currentGroup Id", grp.id);
            currentGroup = grp
            const currentGroupId = await axios.post('http://localhost:3000/group/currentGroup', { groupId: grp.id }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("current Group", currentGroupId.data.currentGroup.id);
            // room=curr_grp.data.Current_Group.id;
            // socket.emit('join-room' , room , ()=>
            // {
            //     console.log('room joined')
            // })
            // console.log("current room: ",room);
            const ifAdmin = await axios.get('http://localhost:3000/group/ifAdmin', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
            if (ifAdmin.data.success) {
                const addUser = document.getElementById('addUser');
                addUser.classList.remove("hide");
                // const close= document.getElementById('close');
                // close.classList.remove("hide");
                // close.onclick=() =>{
                //     // add_user.classList.add("hide");

                // }
                addUser.onclick = async () => {
                    const getUsers = await axios.post('http://localhost:3000/group/getUsers', {groupId: currentGroupId.data.currentGroup.id}, {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                    console.log("Remaining Users are: ", getUsers);
                    const otherUsers = document.getElementById('otherUsers');
                    otherUsers.classList.remove("hide");

                    getUsers.data.remainingUsers.forEach((user) => {
                        const pName = document.createElement('p');
                        pName.textContent = user.name + "   ";
                        const addUser = document.createElement('button');
                        addUser.textContent = "Add";
                        addUser.onclick = async () => {
                            console.log("current",currentGroup);
                            const obj = {
                                groupId: currentGroup.id,
                                userId: user.id
                            }
                            console.log("obj", obj);
                            const add = await axios.post('http://localhost:3000/group/addUser', obj, {
                                headers: {
                                    'Authorization': localStorage.getItem('token')
                                }
                            });
                            if (add.data.success) {
                                window.location = "chat.html";
                            }
                        }
                        pName.appendChild(addUser);
                        otherUsers.appendChild(pName);
                    })
                }
            }
            console.log("ifdmin", ifAdmin);
            const groupName = document.getElementById("groupsH3");
            groupName.classList.remove("hide");
            groupName.textContent = "Group " + grp.name;
            const groupMember = document.getElementById('groupUser');
            groupMember.classList.remove('hide');
            groupMember.onclick = () => {
                renderUser(grp.id, userId)
            }
            renderMessages(grp.id);
            //for the new msg
            document.getElementById('toggleInput').addEventListener('click', (e) => {
                console.log("checked:");
                const message = document.getElementById('inputTextMessage');
                // console.log(document.querySelector('#messages'))
                const file = document.getElementById('files');
                if (e.target.checked) {
                    message.classList.add('hide')
                    file.classList.remove('hide')
                } else {
                    file.classList.add('hide')
                    message.classList.remove('hide')

                }
            })
            const inputMessage = document.getElementById("inputTextMessage");
            // input_text.classList.remove("hide");
            inputMessage.addEventListener('submit', addMessage);
            async function addMessage(e) {     // your sendMessage === My addMessage 
                e.preventDefault();
                const msg = e.target.chat.value;
                const obj = {
                    message: msg,
                    groupId: grp.id
                }
                group = grp;
                const addMessage = await axios.post('http://localhost:3000/message/addMessage', obj, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                })
                console.log("Messages added: ", addMessage);


                const groupMessage = document.getElementById("groupMessages");
                groupMessage.classList.remove('hide');
                const div = document.createElement('div')
                div.className = 'u-message'
                div.textContent = "You: " + addMessage.data.msg
                groupMessage.appendChild(div)
                e.target.chat.value = ''
                // const newMsg= addMessage.data.msg
                // console.log("room",room)                //working
                // socket.emit('NewMessageAdded',newMsg,room);
                // socket.on("MessageRecieved", newMsg => {
                //     // renderMessages(grp.id);
                //     console.log('before message')
                //     alert(`new meesage added- ${newMsg} in the room ${room}`);
                // })
            }
        }
    })
}
document.getElementById('files').addEventListener('submit', async (e) => {
    try {
        // const group = curr_group
        e.preventDefault()
        console.log('clicked')
        // console.log(e.target.file.files) 
        const formData = new FormData(document.getElementById('files'))
        // alert('before')
        const res = await axios.post(`http://localhost:3000/message/uploadFile/${currentGroup.id}`, formData, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        // alert('after')
        const div = document.createElement('div')
        div.textContent = 'You:'
        const img = document.createElement('img')
        img.src = res.data.msg
        div.appendChild(img)
        messages.appendChild(div)

        console.log("file sharing res", res)
    } catch (e) {
        alert('error')
        console.log(e)
    }
})
async function renderMessages(groupId) {
    try {

        // let final_messages = JSON.parse(localStorage.getItem(`message-${group_id}`) ) || []
        // let final_users = JSON.parse(localStorage.getItem(`user-${group_id}`)) || []
        // let mId=0
        // let uId =0 
        // if(final_messages.length > 0)
        //     mId = final_messages[final_messages.length -1].id
        // if(final_users.length>0)
        //      uId = final_users[final_users.length -1].id
        const res = await axios.get(`http://localhost:3000/message/getMessages/${groupId}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        const res2 = await axios.get(`http://localhost:3000/group/allUsers/${groupId}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        console.log("res", res)
        console.log("res2", res2)
        messages.innerHTML = ``
        // final_messages = [...final_messages , ...res.data.messages]
        // // document.querySelector('.group-message h2').textContent = group.name
        // final_users = [...final_users , ...res2.data]
        res.data.messages.forEach(message => {
            // console.log(res.data.id)
            // console.log(final_users)

            if (message.type == 'text')
                showMessage(message, res.data.id, res2.data)
            else
                showFiles(message, res2.data)

        })
        // users.innerHTML = ``


        // final_users.forEach(user =>{
        //     showUser(user)
        // })
        // localStorage.setItem(`message-${group_id}` , JSON.stringify(final_messages))
        // localStorage.setItem(`user-${group_id}`,JSON.stringify(final_users))

    } catch (e) {
        console.log(e)
    }
}
function showFiles(data, users) {
    const id = currentGroup.member.id
    console.log(id)
    console.log(data)
    // const users = localStorage.getItem(`user-${curr_group.id}`)
    const div = document.createElement('div')
    console.log(typeof users)
    if (id == data.memberId) {
        div.className = 'u-message u-multi'
        div.textContent = "You: "
    } else {
        const user = users.find(user => data.memberId == user.member.id)
        console.log(user)
        if (user) {
            div.className = 'o-message o-multi'
            div.textContent = user.name+": "

        } else {
            return;
        }


    }
    if (data.type.startsWith('image')) {
        const img = document.createElement('img')
        img.src = data.msg
        div.appendChild(img)
    } else if (data.type.startsWith('video')) {
        const video = document.createElement('video')
        const source = document.createElement('source')
        source.src = data.msg
        video.appendChild(source)
        video.controls = true
        div.appendChild(video)
    }

    messages.appendChild(div)
}

async function renderUser(groupId) {
    const users = await axios.get(`http://localhost:3000/group/allUsers/${groupId}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    });
    console.log("users are: ", users);
    const groupMembers = document.getElementById("groupMembers");
    groupMembers.classList.remove("hide");

    users.data.forEach(async (user) => {
        console.log("user is", user);
        const p = document.createElement('p')
        p.textContent = user.name + "   "
        p.className = 'userOfGroup'
        if (user.member.admin) {
            const span = document.createElement('span')
            span.textContent = 'admin'
            p.appendChild(span)

        }
        else {
            const ifAdmin = await axios.get('http://localhost:3000/group/ifAdmin', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
            if (ifAdmin.data.success) {
                const removeButton = document.createElement('button');
                removeButton.textContent = "X";
                removeButton.classList.add = "btn";
                removeButton.onclick = async () => {
                    const removeUser = await axios.post('http://localhost:3000/group/removeUser', { userId: user.id, groupId: groupId }, {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                    console.log("remove user", removeUser);
                    if (removeUser.data.success) {
                        groupMembers.removeChild(p);
                    }
                }
                p.appendChild(removeButton);
            }
        }
        groupMembers.appendChild(p)
    })
}


function showMessage(data, id, users) {
    const div = document.createElement('div')
    // console.log(typeof users)
    // console.log(id + " : " + data.memberId)
    // console.log(data.msg)
    // console.log()
  
        if (id == data.memberId) {
            div.className = 'u-message'
            div.textContent = "You: " + data.msg
        } else {
            div.className = 'o-message'
            const user = users.find(user => data.memberId == user.member.id)
            if (user) {
                div.textContent = user.name + ": " + data.msg
            }   /// ?????



        }

    messages.appendChild(div)
}
const token = localStorage.getItem("token");
var groupId = null;

const makeGroup = document.getElementById('makeGroup');
makeGroup.addEventListener('click', createGroup);

const showGroup = document.getElementById('showGroup');
showGroup.addEventListener('click', showAllGroup);

function createGroup(e) {
    e.preventDefault();
    const createGroup = document.getElementById('createGroup');
    createGroup.classList.remove("hide");
    console.log("done");
}
const groupForm = document.getElementById('createGroupForm');
groupForm.addEventListener('submit', createGroupForm);
async function createGroupForm(e) {
    e.preventDefault();
    const name = e.target.groupName.value;
    const create = await axios.post('http://localhost:3000/group/create', { name }, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })

    groupId = create.data.group.id;
    console.log("group created", create);
    window.location = "chat.html"
}

//     const joinee= document.getElementById('all-joinee');  
//     joinee.classList.remove("hide");

//     const members= await axios.get('http://localhost:3000/group/suggested_members',{headers : {
//         'Authorization':localStorage.getItem('token')
//     }})
//     console.log("suggested_members",members);
//     members.data.users.forEach((user)=>{
//         const p_name= document.createElement('p');
//         p_name.textContent= user.name+"  ";
//         const select_btn= document.createElement('button');
//         select_btn.textContent="select";
//         p_name.appendChild(select_btn);
//         joinee.appendChild(p_name);

//         console.log(group_id);
//         select_btn.onclick=async()=>{
//             const add_user= await axios.post('http://localhost:3000/group/join_group',{group_id},{
//                 headers : {
//                     'Authorization':localStorage.getItem('token')
//                 }
//             })
//             console.log("Added Users are:",add_user);
//         }
//     })
//     const add_btn= document.createElement('button');
//     add_btn.textContent="Done";
//     joinee.appendChild(add_btn);
//     add_btn.onclick = ()=>{
//         
//     }
// } 


async function showAllGroup(e) {
    e.preventDefault();
    const allGroups = await axios.get(`http://localhost:3000/group/showAllGroup`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    console.log("All groups are: ", allGroups);

    const groups = document.getElementById('allGroups');
    groups.classList.remove('hide');
    const form = document.createElement('form');
    form.classList.add('allGroup');
    allGroups.data.groups.forEach(group => {
        const pName = document.createElement('p');
        pName.textContent = group.name + "   ";
        const addButton = document.createElement('button');
        addButton.textContent = "Join Group";
        addButton.onclick = async (e) => {
            e.preventDefault();
            // window.location="chat.html";
            console.log(group.id);
            const addGrp = await axios.post('http://localhost:3000/group/joinGroup', { group_id: group.id }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })

            console.log(addGrp);

        }
        pName.appendChild(addButton);
        form.appendChild(pName);
        groups.appendChild(form);
    })
}





