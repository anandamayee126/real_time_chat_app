const form= document.getElementById('myForm')
form.addEventListener('submit', addUser);

// import axios from 'axios';

function addUser(e){
    e.preventDefault();
    const name= e.target.name.value;
    const email= e.target.email.value;
    const phone= e.target.phone.value;
    const password= e.target.password.value;

    const user={
        name,email,phone,password
    }

    const post= axios.post('http://localhost:3000/user/signup',user).then((response)=>{
        console.log(response);
        console.log("hii");
        window.location="login.html";
    }).catch(err => {
        console.log(err);
    })
} 

