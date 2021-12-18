import { apis } from "./apis.js";

const $usernameText = document.getElementById("username");
const $pswText = document.getElementById("psw");
const $signInBtn = document.getElementById("signInBtn");

const handleSignIn = async () => {
    let username = $usernameText.value;
    let psw = $pswText.value;

    if (username == "" || psw == "") {
        alert("All fields are required");
    } else {
        const response = await apis.user.login({ username: username, password: psw });
        if (response.code == 1) {
            alert("login success");
        } else {
            alert(response.message);
        }
    }
};

$signInBtn.onclick = handleSignIn;
