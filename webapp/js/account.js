const $updateAccBtn = document.getElementById("updateAccBtn");
const $deleteAccBtn = document.getElementById("deleteAccBtn");
const $discardBtn = document.getElementById("discardBtn");


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

const handleDeleteAccount = async() => {
    const result = await apis.app_user.delete();
}

$deleteAccBtn.onclick = handleDeleteAccount;
$updateAccBtn.onclick = handleUpdateAccount;