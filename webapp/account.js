import { apis } from "./apis.js";

const $logoutBtn = document.getElementById("logoutBtn");
const $updateBtn = document.getElementById("updateBtn");
const $updateAppBtn = document.getElementById("updateAppBtn");
const $deleteAccBtn = document.getElementById("deleteAccBtn");
const $installBtn = document.getElementById("installBtn");
const $uninstallBtn = document.getElementById("uninstallBtn");

const $usernameText = document.getElementById("username");
const $pswText = document.getElementById("psw");
const $repeatPswText = document.getElementById("psw-repeat");

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
                apis.confirmRedirect.login();
            } else {
                alert(response.message);
            }
        } else {
            alert("Password doesn't match");
        }
    }
};

const handleDeleteAccount = async () => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
        const response = await apis.user.delete();
        if (response.code == 1) {
            alert("delete success");
            apis.confirmRedirect.login();
        } else {
            alert(response.message);
        }
    }
};

const handleLogout = () => {
    apis.user.logout();
    alert("logout success");
    apis.confirmRedirect.login();
};

const handleInstall = () => {
    const onSuccess = () => {
        alert("install success");
        apis.app.update();
    };
    const onError = () => {
        alert("install failed");
    };
    apis.app.install(onSuccess, onError);
};

const handlerUpdateApp = () => {
    const onSuccess = () => {
        alert("update success");
    };
    const onError = (err) => {
        alert("update error " + err.message);
    };
    apis.app.update(onSuccess, onError);
};

const handleUninstall = () => {
    const confirmation = confirm("Do you want to uninstall?");
    if (confirmation) {
        apis.app.uninstall();
        alert("uninstall success");
        apis.confirmRedirect.reload();
    }
};

$logoutBtn.onclick = handleLogout;
$updateBtn.onclick = handleUpdateAccount;
$updateAppBtn.onclick = handlerUpdateApp;
$deleteAccBtn.onclick = handleDeleteAccount;
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
