import { apis } from "./apis.js";

const $usernameText = document.getElementById("username");
const $pswText = document.getElementById("psw");
const $repeatPswText = document.getElementById("repeatPsw");
const $registerBtn = document.getElementById("registerBtn");

const handleRegiter = async () => {
    let psw = $pswText.value;
    let repeatPsw = $repeatPswText.value;
    let username = $usernameText.value;

    if (psw == "" || username == "") {
        alert("All fields are required");
    } else if (psw === repeatPsw) {
        const response = await apis.user.register({ username: username, password: psw });
        if (response.code == 1) {
            alert("register success");
        } else {
            alert(response.message);
        }
    } else {
        alert("Password doesn't match");
    }
};

$registerBtn.onclick = handleRegiter;
