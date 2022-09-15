import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../ActiveUser/ActiveUser.css'

export default function User(props) {

    let userName = props.name;
    let key = props.publicKey;
   //let socketID = props.socketid;

    return (
        <div className="user" onClick={()=> props.clickUser({name: userName, key:key})}>
            <div className="avatar-user">
                <FontAwesomeIcon icon={faUser} />
                <div className='circle'>
                    <div className='online-circle'></div>
                </div>
            </div>
            <div className="name">
                <h5>{props.name}</h5>
            </div>
        </div>
    )
}