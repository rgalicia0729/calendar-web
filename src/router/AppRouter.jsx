import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../auth';
import { CalendarPage } from '../calendar';
import { useAuthStore } from '../hooks';

export const AppRouter = () => {
    const { status, startCheckToken } = useAuthStore();

    useEffect(() => {
        startCheckToken();
    }, []);

    if (status === 'checking') {
        return <h1>Cargando...</h1>;
    }


    return (
        <Routes>
            {
                (status === 'not-authenticated')
                    ? (
                        <>
                            <Route path='/auth/login' element={<LoginPage />} />
                            <Route path='/*' element={<Navigate to="/auth/login" />} />
                        </>
                    )
                    : (
                        <>
                            <Route path='/' element={<CalendarPage />} />
                            <Route path='/*' element={<Navigate to="/" />} />
                        </>
                    )
            }


        </Routes>
    );
}