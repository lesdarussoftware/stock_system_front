/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ShowFormType } from '../../utils/types';

type CategoryFormProps = {
    categoryFormData: any;
    setShowForm: (value: ShowFormType) => void;
    handleSubmit: (e: any) => void;
}

export function CategoryForm({ categoryFormData, setShowForm, handleSubmit }: CategoryFormProps) {

    const { errors, handleChange, reset, formData } = categoryFormData;

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
            <Form.Group className="my-3" controlId="description">
                <Form.Label>Descripción</Form.Label>
                <Form.Control name='description' value={formData.description} />
                {errors.description?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * La descripción es demasiado larga.
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