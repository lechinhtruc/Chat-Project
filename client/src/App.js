
import './App.css';
import Header from './components/Chat/Header/Header';
import Send from './components/Chat/MsgBox/Send';
import Recived from './components/Chat/MsgBox/Recived';
import ActiveUser from './components/Chat/ActiveUser/ActiveUser';
import AlertBox from './components/Chat/Alert/Alert';
import ScrollToBottom from 'react-scroll-to-bottom'
import io from "socket.io-client"
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { JSEncrypt } from "jsencrypt";


function App() {

  const ref = useRef();

  const socketRef = useRef();

  const userRef = useRef();

  const [userChat, setUserChat] = useState({});

  const [message, lsMessage] = useState([]);

  const [text, setText] = useState('');

  const [alert, showAlert] = useState({});

  const handleSetText = (e) => {
    setText(e)
  }

  useEffect(() => {
    var crypt = new JSEncrypt({ default_key_size: 2048 });
    var PublicPrivateKey = {
      PublicKey: crypt.getPublicKey(),
      PrivateKey: crypt.getPrivateKey()
    };
    localStorage.setItem("PrivateKey", PublicPrivateKey.PrivateKey)
    localStorage.setItem("PublicKey", PublicPrivateKey.PublicKey)
    //  console.log(PublicPrivateKey);
  }, [])


  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3200")
    socketRef.current.on("connect", () => {
      socketRef.current.emit("user-connected", {
        name: socketRef.current.id,
        PublicKey: localStorage.getItem("PublicKey")
      })
    })

    socketRef.current.on("userList", (data) => {
      userRef.current.AddUser(data)
    })

    socketRef.current.on("new-msg", (data) => {
      lsMessage(prevState => ([...prevState, {
        msg: DecryptData(localStorage.getItem('PrivateKey'), data.msg), from: data.from
      }]))
    })
  }, [])


  function EncryptData(key, data) {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(key);
    const encrypted = encrypt.encrypt(data)
    return encrypted;
    //console.log("Encrypted: " + encrypted)
  }

  function DecryptData(key, data) {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(key);
    const decrypted = decrypt.decrypt(data)
    return decrypted;
    // console.log("Dencrypted: " + decrypted)
  }

  function sendMsg() {
    if (text !== '' && text !== null && userChat.name !== '' && text.length < 255) {
      socketRef.current.emit("send-msg", {
        msg: EncryptData(userChat.key, text),
        from: socketRef.current.id,
        to: userChat.name
      })
      lsMessage([...message, {
        msg: text, from: socketRef.current.id
      }
      ])
    } else {
      showAlert({
        show: true,
        title: 'Alert',
        content: 'Invalid message!'
      })
      //  alert("Invalid message!")
    }
    setText('')
    ref.current.focus()
  }

  return (
    <div className="App">
      <div className='root'>
        {alert.show ? <AlertBox
          title={alert.title}
          content={alert.content}
          hideAlert={() => {
            showAlert({ show: false, title: '', content: '' })
          }} /> : null
        }
        <ActiveUser ref={userRef} startChatUser={(e) => { setUserChat(e) }} />
        {
          userChat.name ? <div className='main'>
            <Header name={userChat.name} onBack={() => { setUserChat({}) }} />
            <ScrollToBottom className='body-chat'>
              {
                message.map((item, index) => {
                  if (item.from === userChat.name && item.from !== socketRef.current.id) {
                    return <Recived key={index} msg={item.msg} />
                  } if (item.from === socketRef.current.id) {
                    return <Send key={index} msg={item.msg} />
                  }
                })
              }
            </ScrollToBottom>
            <div className='footer-chat'>
              <div className='chat-input'>
                <input autoComplete='off' type="text" id="msg" placeholder='Your Message...' onChange={(e) => {
                  handleSetText(e.target.value)
                }} value={text} ref={ref} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMsg()
                  }
                }} />
              </div>
              <button className='send-btn' onClick={(e) => { sendMsg() }} >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div> : null
        }
      </div>
    </div>
  );
}

export default App;
