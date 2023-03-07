import { useDispatch, useSelector } from 'react-redux';

import { calendarApi } from '../api';
import { onChecking, onLogin, onLogout, onLogoutCalendar, onResetErrorMessage } from '../store';

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

    const startRegister = async ({ name, email, password }) => {
        dispatch(onChecking());

        try {
            const { data } = await calendarApi.post('/api/auth/new', {
                name,
                email,
                password,
            });
            dispatch(onLogin({ uid: data.uid, name: data.name }));

            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
        } catch (err) {
            dispatch(onLogout(err.response.data?.message));

            setTimeout(() => {
                dispatch(onResetErrorMessage());
            }, 10);
        }
    }

    const startCheckToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await calendarApi.get('/api/auth/renew');
            dispatch(onLogin({ uid: data.uid, name: data.name }));

            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
        } catch (err) {
            localStorage.removeItem('token');
            dispatch(onLogout());
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
        dispatch(onLogoutCalendar());
    }

    return {
        status,
        user,
        errorMessage,
        startLogin,
        startRegister,
        startCheckToken,
        startLogout
    }
}