import { addHours } from 'date-fns';
import { useCalendarStore, useUiStore } from '../../hooks';

export const FabAddNew = () => {
    const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();

    const onClick = () => {
        openDateModal();

        setActiveEvent({
            title: '',
            notes: '',
            start: new Date(),
            end: addHours(new Date(), 3),
            bgColor: '#fafafa',
            user: {
                _id: '',
                name: ''
            }
        });
    }

    return (
        <button
            className="btn btn-primary fab"
            onClick={onClick}
        >
            <i className="fas fa-plus"></i>
        </button>
    );
}