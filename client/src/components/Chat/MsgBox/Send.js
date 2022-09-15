import '../MsgBox/MsgBox.css';

export default function Send(props) {
    return (
        <div className='msg-box-send'>
            <p>{props.msg}</p>
        </div>
    )
}