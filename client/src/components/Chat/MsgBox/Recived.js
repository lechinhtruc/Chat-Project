import '../MsgBox/MsgBox.css';

export default function Recived(props) {
    return (
        <div className='msg-box-recived'>
            <p>{props.msg}</p>
        </div>
    )
}