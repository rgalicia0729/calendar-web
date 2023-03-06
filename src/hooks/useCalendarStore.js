import { useDispatch, useSelector } from 'react-redux';

import calendarApi from '../api/calendarApi';
import { convertToDateEvent } from '../helpers';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store';

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
            console.log(events);
        } catch (err) {
            console.error(err);
        }
    }

    const startSavingEvent = async (calendarEvent) => {

        if (calendarEvent._id) {
            dispatch(onUpdateEvent({ ...calendarEvent }));
        } else {
            const { data } = await calendarApi.post('/api/events', calendarEvent);
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));
        }
    }

    const startDelitingEvent = async () => {
        dispatch(onDeleteEvent());
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