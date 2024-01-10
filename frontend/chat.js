
// 
// var options = {
//     rememberUpgrade:true,
//     transports: ['websocket'],
//     secure:true, 
//     rejectUnauthorized: false
// }
// var socket = io.connect('http://localhost:3000', options);
// let room=null;

const messages = document.getElementById('group_messages')
let group = null;
let userId = null;
var curr_group = null

document.addEventListener('DOMContentLoaded', getData);
async function getData(e) {
    e.preventDefault();
    const logged_user = await axios.get('http://localhost:3000/user/showId', {
        headers: {
            'Authorization': localStorage.getItem('token'),
            "Access-Control-Allow-Origin": "*"
        }
    });
    const user_welcome = document.getElementById('user-welcome');
    console.log("abcdfr", logged_user);
    user_welcome.textContent = `Hi ${logged_user.data.user.name} !`
    renderGroup();
}

async function renderGroup() {
    const groups = await axios.get("http://localhost:3000/group/get-groups", {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    });
    console.log("groups are: ", groups);
    const my_groups = document.getElementById('my_groups');
    my_groups.classList.remove("hide");
    groups.data.groups.forEach((grp) => {

        const h_name = document.createElement('h4');
        h_name.classList.add = "render_group";
        h_name.textContent = grp.name;
        const chat_btn = document.createElement('button');
        chat_btn.textContent = "chat";
        chat_btn.classList.add = "chat_btn";
        h_name.appendChild(chat_btn);
        my_groups.appendChild(h_name);

        chat_btn.onclick = async () => {
            console.log("current_group_id", grp.id);
            curr_group = grp
            const curr_grp = await axios.post('http://localhost:3000/group/curr_grp', { groupId: grp.id }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("current Group", curr_grp.data.Current_Group.id);
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
                const add_user = document.getElementById('add-user');
                add_user.classList.remove("hide");
                // const close= document.getElementById('close');
                // close.classList.remove("hide");
                // close.onclick=() =>{
                //     // add_user.classList.add("hide");

                // }
                add_user.onclick = async () => {
                    const getUsers = await axios.post('http://localhost:3000/group/get-users', { groupId: curr_grp.data.Current_Group.id }, {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                    console.log("Remaining Users are: ", getUsers);
                    const other_users = document.getElementById('other_users');
                    other_users.classList.remove("hide");

                    getUsers.data.remaining_users.forEach((user) => {
                        const p_name = document.createElement('p');
                        p_name.textContent = user.name + "   ";
                        const add_user = document.createElement('button');
                        add_user.textContent = "Add";
                        add_user.onclick = async () => {
                            const obj = {
                                groupId: curr_grp.data.Current_Group.id,
                                userId: user.id
                            }
                            console.log("obj", obj);
                            const add = await axios.post('http://localhost:3000/group/add_user', obj, {
                                headers: {
                                    'Authorization': localStorage.getItem('token')
                                }
                            });
                            if (add.data.success) {
                                window.location = "chat.html";
                            }
                        }
                        p_name.appendChild(add_user);
                        other_users.appendChild(p_name);
                    })
                }
            }
            console.log("ifdmin", ifAdmin);
            const group_name = document.getElementById("groups_h3");
            group_name.classList.remove("hide");
            group_name.textContent = "Group " + grp.name;
            const group_member = document.getElementById('group-user');
            group_member.classList.remove('hide');
            group_member.onclick = () => {
                renderUser(grp.id, userId)
            }
            renderMessages(grp.id);
            //for the new msg
            document.getElementById('toggleInput').addEventListener('click', (e) => {
                console.log("checked:");
                const message = document.getElementById('input-text-message');
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
            const input_text = document.getElementById("input-text-message");
            // input_text.classList.remove("hide");
            input_text.addEventListener('submit', addMessage);
            async function addMessage(e) {     // your sendMessage === My addMessage 
                e.preventDefault();
                const msg = e.target.chat.value;
                const obj = {
                    message: msg,
                    groupId: grp.id
                }
                group = grp;
                const addMessage = await axios.post('http://localhost:3000/message/add-message', obj, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                })
                console.log("Messages added: ", addMessage);


                const group_message = document.getElementById("group_messages");
                group_message.classList.remove('hide');
                const div = document.createElement('div')
                div.className = 'u-message'
                div.textContent = "You: " + addMessage.data.msg
                group_message.appendChild(div)
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
        const res = await axios.post(`http://localhost:3000/message/uploadFile/${curr_group.id}`, formData, {
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
async function renderMessages(group_id) {
    try {

        // let final_messages = JSON.parse(localStorage.getItem(`message-${group_id}`) ) || []
        // let final_users = JSON.parse(localStorage.getItem(`user-${group_id}`)) || []
        // let mId=0
        // let uId =0 
        // if(final_messages.length > 0)
        //     mId = final_messages[final_messages.length -1].id
        // if(final_users.length>0)
        //      uId = final_users[final_users.length -1].id
        const res = await axios.get(`http://localhost:3000/message/get-messages/${group_id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        const res2 = await axios.get(`http://localhost:3000/group/all-users/${group_id}`, {
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
    const id = curr_group.member.id
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

async function renderUser(group_id) {
    const users = await axios.get(`http://localhost:3000/group/all-users/${group_id}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    });
    console.log("users are: ", users);
    const group_members = document.getElementById("group_members");
    group_members.classList.remove("hide");

    users.data.forEach(async (user) => {
        console.log("user is", user);
        const p = document.createElement('p')
        p.textContent = user.name + "   "
        p.className = 'user_of_grp'
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
                const remove_button = document.createElement('button');
                remove_button.textContent = "X";
                remove_button.classList.add = "btn";
                remove_button.onclick = async () => {
                    const remove_user = await axios.post('http://localhost:3000/group/remove_user', { user_id: user.id, group_id: group_id }, {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                    console.log("remove_user", remove_user);
                    if (remove_user.data.success) {
                        group_members.removeChild(p);
                    }
                }
                p.appendChild(remove_button);
            }
        }
        group_members.appendChild(p)
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
var group_id = null;

const make_group = document.getElementById('make_group');
make_group.addEventListener('click', createGroup);

const show_group = document.getElementById('show_group');
show_group.addEventListener('click', showAllGroup);

function createGroup(e) {
    e.preventDefault();
    const create_group = document.getElementById('create_group');
    create_group.classList.remove("hide");
}
const form_create_group = document.getElementById('create_group_form');
form_create_group.addEventListener('submit', create_Group);
async function create_Group(e) {
    e.preventDefault();
    const name = e.target.group_name.value;
    const create = await axios.post('http://localhost:3000/group/create', { name }, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })

    group_id = create.data.group.id;
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
    const all_groups = await axios.get(`http://localhost:3000/group/showAllGroup`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    console.log("All groups are: ", all_groups);

    const groups = document.getElementById('all_groups');
    groups.classList.remove('hide');
    const form = document.createElement('form');
    form.classList.add('all_group');
    all_groups.data.groups.forEach(group => {
        const p_name = document.createElement('p');
        p_name.textContent = group.name + "   ";
        const add_button = document.createElement('button');
        add_button.textContent = "Join Group";
        add_button.onclick = async (e) => {
            e.preventDefault();
            // window.location="chat.html";
            console.log(group.id);
            const add_grp = await axios.post('http://localhost:3000/group/join_group', { group_id: group.id }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })

            console.log(add_grp);

        }
        p_name.appendChild(add_button);
        form.appendChild(p_name);
        groups.appendChild(form);
    })
}





