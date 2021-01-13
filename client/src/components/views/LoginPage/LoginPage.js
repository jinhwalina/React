import React, { useState } from 'react'

function LoginPage() {

    const [Email, setEmail] = useState("") //initialState 이건 처음 input창에서 어떻게 보이느냐의 .. 내용이다
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); // 이걸 넣어줘야 submit 했을때 새로고침되서 전송되는 데이터를 유지해 작업할 수 있다.
        console.log('Email', Email)
        console.log('Password', Password)
    }

    return (
        <div style={{ display:'flex', justifyContent:'center', alignItems: 'center'
        , width: '100%', height:'100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                
                <br/>
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage
