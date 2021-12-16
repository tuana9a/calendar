import { apis } from "./apis.js";


const $deleteAccBtn = document.getElementById("deleteAccBtn");
const $updateBtn = document.getElementById("updateBtn");
const $logoutBtn = document.getElementById("logoutBtn");
const $moreBtn = document.getElementById("moreBtn");
const $installBtn = document.getElementById("installBtn");
const $uninstallBtn = document.getElementById("uninstallBtn");

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

const handleDeleteAccount = async() => {
    const confirmation = confirm("Are you sure?")
    if (confirmation) {
        const response = await apis.user.delete();
        if (response.code == 1) {
            alert("delete success");
            window.location.href = "/login.html";
        } else {
            alert(response.message);
        }
    }

};

const handleLogout = () => {
    apis.user.logout();
    alert("logout success");
    window.location.href = "/login.html";
};

const handleMoreBtn = () => {
    $moreBtn.textContent = "Hide";
    $installBtn.classList.remove("display-none");
    $uninstallBtn.classList.remove("display-none");
    $moreBtn.onclick = handleHideBtn;
}

const handleHideBtn = () => {
    $moreBtn.textContent = "More";
    $installBtn.classList.add("display-none");
    $uninstallBtn.classList.add("display-none");
    $moreBtn.onclick = handleMoreBtn;
}
const handleInstall = () => {
    apis.app.install();
    alert("install success")
}

const handleUninstall = () => {
    const confirmation = confirm("Do you want to uninstall?");
    if (confirmation) {
        apis.app.install();
        alert("uninstall success")
    }


}

$deleteAccBtn.onclick = handleDeleteAccount;
$updateBtn.onclick = handleUpdateAccount;
$logoutBtn.onclick = handleLogout;
$moreBtn.onclick = handleMoreBtn;
$installBtn.onclick = handleInstall;
$uninstallBtn.onclick = handleUninstall;

apis.user.info().then((response) => {
    if (response.code == 1) {
        let user = response.data;
        $usernameText.value = user.username;
    } else {
        alert("you're not login yet");
    }
});