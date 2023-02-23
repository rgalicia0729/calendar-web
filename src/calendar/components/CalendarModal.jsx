import { useMemo, useState } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import Modal from 'react-modal';

import "react-datepicker/dist/react-datepicker.css";
import { useUiStore } from '../../hooks';

registerLocale('es', es);

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {
    const { isDateModalOpen, closeDateModal } = useUiStore();
    const [formSubmited, setFormSubmited] = useState(false);
    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2),
    });

    const invalidDatesClass = useMemo(() => {
        if (!formSubmited) return '';

        const difference = differenceInSeconds(formValues.end, formValues.start);

        return (formSubmited && (isNaN(difference) || difference < 0))
            ? 'is-invalid'
            : '';

    }, [formSubmited, formValues.start, formValues.end])

    const invalidTitleClass = useMemo(() => {
        if (!formSubmited) return '';

        return (!formValues.title)
            ? 'is-invalid'
            : '';

    }, [onsubmit, formValues.title]);

    const onChangeValues = ({ target }) => {
        const { name, value } = target;

        setFormValues({
            ...formValues,
            [name]: value
        });
    }

    const onChangeDate = (changing, event) => {
        setFormValues({
            ...formValues,
            [changing]: event
        });
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setFormSubmited(true);

        const difference = differenceInSeconds(formValues.end, formValues.start);

        if (isNaN(difference) || difference < 0) {
            return
        }

        if (!formValues.title) {
            return
        }

        console.log(formValues);

    }

    const onCloseModal = () => {
        closeDateModal();
    }

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={onCloseModal}
            style={customStyles}
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={onSubmit}>

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    <DatePicker
                        className={`form-control ${invalidDatesClass}`}
                        selected={formValues.start}
                        onChange={(event) => onChangeDate('start', event)}
                        dateFormat="Pp"
                        locale="es"
                        timeCaption="Hora"
                        showTimeSelect
                    />
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    <DatePicker
                        className={`form-control ${invalidDatesClass}`}
                        minDate={formValues.start}
                        selected={formValues.end}
                        onChange={(event) => onChangeDate('end', event)}
                        dateFormat="Pp"
                        locale="es"
                        timeCaption="Hora"
                        showTimeSelect
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${invalidTitleClass}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onChangeValues}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onChangeValues}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    );
}