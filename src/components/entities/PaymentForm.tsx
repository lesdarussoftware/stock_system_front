/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { format } from 'date-fns';

import { ShowFormType } from '../../utils/types';

type PaymentFormProps = {
    paymentFormData: any;
    setShowForm: (value: ShowFormType) => void;
    handleSubmit: (e: any) => void
}

export function PaymentForm({ paymentFormData, setShowForm, handleSubmit }: PaymentFormProps) {

    const { errors, handleChange, reset, formData } = paymentFormData;

    return (
        <Form className='mt-4' onSubmit={e => handleSubmit(e)}>
            <Form.Group controlId="date" className='my-3'>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={e => {
                        const formatted = format(e.target.value.replace('-', '/'), 'yyyy-MM-dd');
                        const value = format(new Date(formatted + 'T00:00:00'), 'yyyy-MM-dd');
                        handleChange({ target: { name: 'date', value } });
                    }}
                />
            </Form.Group>
            <Form.Group controlId="amount">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                    type='number'
                    min={1}
                    step={1}
                    name='amount'
                    value={formData.amount}
                    onChange={e => handleChange({
                        target: {
                            name: 'amount',
                            value: +e.target.value <= 1 ? 1 : +e.target.value
                        }
                    })}
                />
            </Form.Group>
            <Form.Group controlId="method" className='my-3'>
                <Form.Label>Método de pago</Form.Label>
                <Form.Select value={formData.method} name="method" id='method'>
                    <option value="EFECTIVO">EFECTIVO</option>
                    <option value="CREDITO">CREDITO</option>
                    <option value="DEBITO">DEBITO</option>
                    <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                </Form.Select>
            </Form.Group>
            <Form.Group controlId="observations" className="mb-3">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                    name='observations'
                    value={formData.observations}
                    onChange={e => handleChange({ target: { name: 'observations', value: e.target.value } })}
                />
                {errors.observations?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * Las observaciones son demasiado largas.
                    </Form.Text>
                }
            </Form.Group>
            <div className='mt-5 d-flex justify-content-center gap-3'>
                <Button variant="secondary" type="button" className='w-25' onClick={() => {
                    setShowForm(null);
                    setShowForm(null);
                    reset();
                }}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" className='w-25'>
                    Guardar
                </Button>
            </div>
        </Form>
    );
}