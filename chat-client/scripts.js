

$(document).ready(() => {
    let sendTo = '';
    let publicKeySend = ''
    const socket = io("localhost:3000");


    socket.on("connect", () => {
        userLogin()
    })

    socket.on("connect_error", () => {
        $('.root').html('')
        $('.root').append(`<h2 style="text-align:center;">Can't connect to server! <br> Auto refresh in 5 second</h2>`)
        setInterval(function () {
            location.reload()
        }, 5000);
    });

    /* socket.on("user-connect", (data) => {
        if (data != socket.id) {
            $('.list-user').append(`<div class="user" socketid=${data}><div class="avatar-user"><i class="fa-solid fa-user fa-fw"></i></div><div class="name"><h5>Guest</h5></div></div>`)
            for (let i = 0; i < $(".user").length; i++) {
                $(`.list-user .user:eq(${i})`).on("click", () => {
                    sendTo = $(`.list-user .user:eq(${i})`).attr('socketid')
                    $('.avatar .user h4').text($(`.user:eq(${i}) .name h5`).text())
                    //alert($(`.user:eq(${i}) .name h5`).text())
                });
            }
        }
    }) */

    socket.on("new-msg", (data) => {
        if (sendTo == data.from) {
            $('.body-chat').append(`<div class="msg-box-recived"><p>${data.msg}</p></div>`)
            $(".body-chat").animate({ scrollTop: $('.body-chat').prop("scrollHeight") }, 1000);
        }
    })

    socket.on("userList", (data) => {
        appendData(data)
    })

    socket.on("disconnect", () => {
        console.log(socket.id); // undefined
    });

    /* const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048, //for secure hashing length of a hashfunction
    })

    function encryptData(data, key) {
        const encryptMe = crypto.publicEncrypt({
            key: key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        }, Buffer.from(data));
        return encryptMe
    }

    function dencryptData(data) {
        const decryptData = crypto.privateDecrypt({
            key: localStorage.getItem('privateKey'),
            padding: Crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        }, data);
        return decryptData
    }

    function getLocalStorage() {
        if (localStorage.getItem('privateKey') == undefined) {
            localStorage.setItem('privateKey', privateKey)
        } else {
            localStorage.clear()
            localStorage.setItem('privateKey', privateKey)
        }
    } */


    function userLogin() {
        let popup = prompt("Please enter your name:", "Guest");
        if (popup == null || popup == "") {
            userLogin()
        } else {
            socket.emit("user-connected", { name: popup })
            alert("Welcome: " + popup)
            // getLocalStorage()
        }
    }

    function appendData(data) {
        $('.list-user').html('')
        data.forEach(item => {
            if (item.socket != socket.id) {
                $('.list-user').append(`<div class="user" socketid=${item.socket}><div class="avatar-user"><i class="fa-solid fa-user fa-fw"></i></div><div class="name"><h5>${item.name}</h5></div></div>`)
                for (let i = 0; i < $(".user").length; i++) {
                    $(`.list-user .user:eq(${i})`).on("click", () => {
                        sendTo = $(`.list-user .user:eq(${i})`).attr('socketid')
                        $('.avatar .user h4').text($(`.user:eq(${i}) .name h5`).text())
                        //alert($(`.user:eq(${i}) .name h5`).text())
                    });
                }
            }
        });
    }

    function sendMsg(msg) {
        if (msg != '') {
            socket.emit("send-msg", { to: sendTo, from: socket.id, msg: msg })
            $('.body-chat').append(`<div class="msg-box-send"><p>${msg}</p></div>`)
            $('#msg').val('')
            $(".body-chat").animate({ scrollTop: $('.body-chat').prop("scrollHeight") }, 1000);
        } else {
            $('#msg').focus()
        }
    }

    $('#msg').keypress((event) => {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            sendMsg($('#msg').val())
        }
    })

    $('.send-btn').click(() => {
        sendMsg($('#msg').val())
    })

    $(".body-chat").animate({ scrollTop: $('.body-chat').prop("scrollHeight") }, 1000);
})