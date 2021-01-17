
import {
    LOGIN_USER
} from '../_actions/types';

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return{ ...state, loginSuccess: action.payload}
            // eslint-disable-next-line no-unreachable
            break;
        default:
           return state;
    }
}

// export default function (state, action) {
//     switch (action.type) {
//         case LOGIN_USER:
//                 return{...state, loginSuccess: action.payload}
//             break;
    
//         default:
//             return state;
//     }
// }