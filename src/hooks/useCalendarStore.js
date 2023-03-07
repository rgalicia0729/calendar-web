import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import calendarApi from '../api/calendarApi';
import { convertToDateEvent } from '../helpers';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store';

export const useCalendarStore = () => {
    const { user } = useSelector(state => state.auth);
    const { events, activeEvent } = useSelector(state => state.calendar);

    const dispatch = useDispatch();

    const setActiveEvent = async (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }

    const startLoadingEvent = async () => {
        try {
            const { data } = await calendarApi.get('/api/events');
            const events = convertToDateEvent(data.events);
            dispatch(onLoadEvents(events));
        } catch (err) {
            console.error(err);
        }
    }

    const startSavingEvent = async (calendarEvent) => {
        try {
            if (calendarEvent.id) {
                await calendarApi.put(`/api/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return
            }

            const { data } = await calendarApi.post('/api/events', calendarEvent);
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));
        } catch (err) {
            Swal.fire('Error al guardar evento', err.response.data?.message, 'error');
        }
    }

    const startDelitingEvent = async () => {
        try {
            await calendarApi.delete(`/api/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
        } catch (err) {
            Swal.fire('Error al eliminar evento', err.response.data?.message, 'error');
        }
    }

    return {
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,
        setActiveEvent,
        startLoadingEvent,
        startSavingEvent,
        startDelitingEvent,
    }
}