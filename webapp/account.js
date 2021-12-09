import { apis } from "./apis.js";

const $saveAccBtn = document.getElementById("saveAccBtn");
const $deleteAccBtn = document.getElementById("deleteAccBtn");
const $discardBtn = document.getElementById("discardBtn");
const $updateBtn = document.getElementById("updateBtn");

const $usernameText = document.getElementById("username");
const $pswText = document.getElementById("psw");
const $repeatPswText = document.getElementById("psw-repeat");

const handleOpenUpdateMode = () => {
    $usernameText.removeAttribute("readonly");
    $pswText.removeAttribute("readonly");
    $repeatPswText.removeAttribute("readonly");

    $discardBtn.classList.remove("display-none");
    $saveAccBtn.classList.remove("display-none");
    $updateBtn.classList.add("display-none");
};

const handleCloseUpdateMode = () => {
    $usernameText.setAttribute("readonly", "readonly");
    $pswText.setAttribute("readonly", "readonly");
    $repeatPswText.setAttribute("readonly", "readonly");

    $discardBtn.classList.add("display-none");
    $saveAccBtn.classList.add("display-none");
    $updateBtn.classList.remove("display-none");
};

const handleUpdateAccount = async () => {
    let psw = $pswText.value;
    let repeatPsw = $repeatPswText.value;
    let username = $usernameText.value;
    if (psw == "" || username == "") {
        alert("All fields are required");
    } else {
        if (psw === repeatPsw) {
            const response = await apis.user.update({ username: username, password: psw });
            if (response.code == 1) {
                alert("update success");
                window.location.href = "/login.html";
            } else {
                alert(response.message);
            }
        } else {
            alert("Password doesn't match");
        }
    }
};

const handleDeleteAccount = async () => {
    const response = await apis.user.delete();
    if (response.code == 1) {
        window.location.href = "/login.html";
    } else {
        alert(response.message);
    }
};

$deleteAccBtn.onclick = handleDeleteAccount;
$saveAccBtn.onclick = handleUpdateAccount;
$discardBtn.onclick = handleCloseUpdateMode;
$updateBtn.onclick = handleOpenUpdateMode;
