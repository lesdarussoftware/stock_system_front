/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ShowFormType } from '../../utils/types';

type ClientFormProps = {
    clientFormData: any;
    setShowForm: (value: ShowFormType) => void;
    handleSubmit: (e: any) => void;
}

export function ClientForm({ clientFormData, setShowForm, handleSubmit }: ClientFormProps) {

    const { errors, handleChange, reset, formData } = clientFormData;

    return (
        <Form className='mt-4' onChange={handleChange} onSubmit={e => handleSubmit(e)}>
            <Form.Group controlId="name">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control name='name' value={formData.name} />
                {errors.name?.type === 'required' &&
                    <Form.Text className="text-danger d-block">
                        * El nombre es requerido.
                    </Form.Text>
                }
                {errors.name?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * El nombre es demasiado largo.
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group className="my-3" controlId="phone">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control name='phone' value={formData.phone} />
                {errors.phone?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * El teléfono es demasiado largo.
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control name='email' type='email' value={formData.email} />
                {errors.email?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * El email es demasiado largo.
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
                <Form.Label>Dirección</Form.Label>
                <Form.Control name='address' value={formData.address} />
                {errors.address?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * La dirección es demasiado larga.
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group className="mb-3" controlId="city">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control name='city' value={formData.city} />
                {errors.city?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * La ciudad es demasiado larga.
                    </Form.Text>
                }
            </Form.Group>
            <div className='mt-5 d-flex justify-content-center gap-3'>
                <Button variant="secondary" type="button" className='w-25' onClick={() => {
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