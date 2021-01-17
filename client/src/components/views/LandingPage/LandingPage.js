import React,{ useEffect } from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';


function LandingPage(props) {
    useEffect(() => {
        axios.get('/api/hello')
        .then(response => console.log(response.data))
    }, [])

    // 로그아웃을 위한 함수 
    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                console.log(1) // 데이터가 애초에 여기까지만 들어옴 ㅠ
                if (response.data.success) {
                    console.log(response.data) // data 찍히는것도 확인함! 
                    if (response.data.success) {
                        props.history.push('/login')
                    } else {
                        alert('로그아웃에 실패하였습니다.')
                    }
                }
            })
    }


    return (
        <div style={{ display:'flex', justifyContent:'center', alignItems: 'center'
        , width: '100%', height:'100vh'
        }}>
            <h2>시작페이지</h2>

            <button onClick={onClickHandler}>
                LOGOUT
            </button>

        </div>
    )
}
export default withRouter(LandingPage)