import { apis } from "../apis";

const $usernameText = document.getElementById("username");
const $pswText = document.getElementById("psw");
const $signInBtn = document.getElementById("signInBtn");

const handleSignIn = async() => {
    username = $usernameText.value;
    psw = $pswText.value;

    if (username == "" || psw == "") {
        alert("All fields are required");
    } else {
        const result = await apis.app_user.login({ user: { username: username, password: psw } })
    }
}

$signInBtn.onclick = handleSignIn;