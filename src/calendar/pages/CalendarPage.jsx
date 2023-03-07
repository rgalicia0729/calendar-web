import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent, Navbar, CalendarModal, FabAddNew, FabDeleteEvent } from '../';
import { localizer, getMessagesES } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';

export const CalendarPage = () => {
    const { user } = useAuthStore();
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');
    const { events, hasEventSelected, setActiveEvent, startLoadingEvent } = useCalendarStore();
    const { openDateModal } = useUiStore();

    const eventStyleGetter = (event) => {
        const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);

        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
        }

        return { style };
    }

    const onDoubleClick = (event) => {
        openDateModal();
    }

    const onSelect = (event) => {
        setActiveEvent(event);
    }

    const onViewChange = (event) => {
        localStorage.setItem('lastView', event);
        setLastView(event);
    }

    useEffect(() => {
        startLoadingEvent();
    }, []);

    return (
        <>
            <Navbar />

            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 80px)' }}
                messages={getMessagesES()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChange}
            />
            <CalendarModal />
            <FabAddNew />
            {
                (hasEventSelected) && <FabDeleteEvent />
            }
        </>
    );
}