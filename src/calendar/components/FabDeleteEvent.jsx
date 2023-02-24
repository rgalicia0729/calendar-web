import { useCalendarStore } from '../../hooks';

export const FabDeleteEvent = () => {
    const { startDelitingEvent } = useCalendarStore();

    const onClick = () => {
        startDelitingEvent();
    }

    return (
        <button
            className="btn btn-danger fab-danger"
            onClick={onClick}
        >
            <i className="fas fa-trash-alt"></i>
        </button>
    );
}