import '../ActiveUser/ActiveUser.css'
import User from './User'
import { useState, forwardRef, useImperativeHandle } from 'react'




function ActiveUser(props, ref) {

    const [user, setUser] = useState([])

    useImperativeHandle(ref, () => ({
        AddUser(data) {
            setUser(data)
        }
    }))


    return (
        <div className='online-user'>
            <h2>Active User</h2>
            <div className='list-user'>
                {
                    user.map((item, index) => {
                        return <User key={index} name={item.name} publicKey={item.key} socketid={item.socket} clickUser={(e) => {
                            props.startChatUser(e)
                        }} />
                    })
                }
            </div>
        </div>
    )
}

export default forwardRef(ActiveUser)
