import { useDispatch, useSelector } from 'react-redux';

import { calendarApi } from '../api';
import { onChecking, onLogin, onLogout, onResetErrorMessage } from '../store';

export const useAuthStore = () => {
    const dispatch = useDispatch();
    const { status, user, errorMessage } = useSelector(state => state.auth);

    const startLogin = async ({ email, password }) => {
        dispatch(onChecking());

        try {
            const { data } = await calendarApi.post('/api/auth', { email, password });
            dispatch(onLogin({ uid: data.uid, name: data.name }));

            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
        } catch (err) {
            dispatch(onLogout('Credenciales invalidas'));

            setTimeout(() => {
                dispatch(onResetErrorMessage());
            }, 10);
        }
    }

    return {
        status,
        user,
        errorMessage,
        startLogin,
    }
}