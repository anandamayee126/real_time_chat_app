const login= document.getElementById('login')
login.addEventListener('submit', checkUser);



async function checkUser(e){
    e.preventDefault()
    const name= e.target.name.value;
    const email= e.target.email.value;
    const phone= e.target.phone.value;
    const password= e.target.password.value;

    const user={
        name,email,phone,password
    }

    
    const login= await axios.post('http://52.91.197.184:3000/user/login',user)
    
    console.log("login",login);
    if(login.data.success===true){
        window.location="chat.html"
        console.log("login",login);
        localStorage.setItem("token",login.data.token);
    }
}