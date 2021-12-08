const $saveAccBtn = document.getElementById("saveAccBtn");
const $deleteAccBtn = document.getElementById("deleteAccBtn");
const $discardBtn = document.getElementById("discardBtn");
const $updateBtn = document.getElementById("updateBtn");

const $usernameText = document.getElementById("username");
const $pswText = document.getElementById("psw");
const $repeatPswText = document.getElementById("psw-repeat");

const handleUpdateAccount = async() => {
    let psw = $pswText.value;
    let repeatPsw = $repeatPswText.value;

    let username = $usernameText.value;

    if (psw == "" || username == "") {
        alert("All fields are required");
    } else {
        if (psw === repeatPsw) {
            const result = await apis.app_user.update({ user: { username: username, password: psw } })
        } else {
            alert("Password doesn't match");
        }
    }

}

const handleOpenUpdateMode = () => {
    $usernameText.removeAttribute("readonly");
    $pswText.removeAttribute("readonly");
    $repeatPswText.removeAttribute("readonly");

    $discardBtn.classList.remove("display-none");
    $saveAccBtn.classList.remove("display-none");
    $updateBtn.classList.add("display-none");
}

const handleCloseUpdateMode = () => {

    $usernameText.setAttribute("readonly", "readonly");
    $pswText.setAttribute("readonly", "readonly");
    $repeatPswText.setAttribute("readonly", "readonly");

    $discardBtn.classList.add("display-none");
    $saveAccBtn.classList.add("display-none");
    $updateBtn.classList.remove("display-none");
}


const handleDeleteAccount = async() => {
    const result = await apis.app_user.delete();
}

$deleteAccBtn.onclick = handleDeleteAccount;
$saveAccBtn.onclick = handleUpdateAccount;
$discardBtn.onclick = handleCloseUpdateMode;
$updateBtn.onclick = handleOpenUpdateMode;