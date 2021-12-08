import { apis } from "../apis";


const $usernameText = document.getElementById("username");
const $pswText = document.getElementById("psw");
const $repeatPswText = document.getElementById("repeatPsw");
const $registerBtn = document.getElementById("registerBtn");
const $signIn = document.getElementById("signIn");

const handleRegiter = async() => {
    let psw = $pswText.value;
    let repeatPsw = $repeatPswText.value;

    let username = $usernameText.value;

    if (psw == "" || username == "") {
        alert("All fields are required");
    } else {
        if (psw === repeatPsw) {
            const result = await apis.app_user.register({ user: { username: username, password: psw } })
        } else {
            alert("Password doesn't match");
        }
    }

}

const handleHaveAccount = () => {
    window.location.href = "/webapp/login.html"
}

$signIn.onclick = handleHaveAccount;
$registerBtn.onclick = handleRegiter;