import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

//import { response } from 'express';

// null => 아무나 출입이 가능한 페이지
// true => 로그인한 유저만 출입이 가능한 페이지
// false => 로그인한 유저는 출입 불가능한 페이지 

// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecificComponent, option, adminRoute = null){

    function AuthenticationCheck(props){

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response)
                
                // 로그인 하지 않은 상태 
                if(!response.payload.isAuth){
                    if(option) {
                        props.history.push('/login')
                    }
                } else {
                    // 로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    } else {
                        if(option === false)
                        props.history.push('/')
                    }
                } // 이부분에서 문제점..! 로그인 한 상태에서 페이지 이동이 안된다. 특히 register 부분 ㅠㅠ 그냥 흰 창만 뜸.. 
                // logout 버튼 누른 상태에서도 register로의 이동이 안된다.. 흑흑 
      
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck

}
