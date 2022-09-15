
import '../Header/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons'




export default function Header(props) {
    return (
        <div className='header-chat'>
            <div className='back-btn' onClick={() => { props.onBack() }}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <div className='avatar'>
                <FontAwesomeIcon icon={faUser} />
                <div className='user'>
                    <h4>{props.name}</h4>
                    <small>Đang hoạt động</small>
                </div>
            </div>
        </div>
    )
}