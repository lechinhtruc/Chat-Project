import '../Alert/Alert.css'

export default function AlertBox(props) {
    return (
        <div className="root-alert">
            <div className='background-alert' onClick={()=>{props.hideAlert()}}></div>
            <div className="main-alert">
                <h2>{props.title}</h2>
                <div className='content-alert'>
                    <p>{props.content}</p>
                </div>
            </div>
        </div>
    )
}