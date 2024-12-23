/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ShowFormType } from '../../utils/types';

type UserFormProps = {
    userFormData: any;
    setShowForm: (value: ShowFormType) => void;
    handleSubmit: (e: any) => void;
    forAuth?: boolean;
}

export function UserForm({ userFormData, setShowForm, handleSubmit, forAuth }: UserFormProps) {

    const { errors, handleChange, reset, formData } = userFormData;

    return (
        <Form className='mt-4' onChange={handleChange} onSubmit={e => handleSubmit(e)}>
            <Form.Group controlId="username" className='mb-3'>
                <Form.Label>Nombre de usuario *</Form.Label>
                <Form.Control name='username' value={formData.username} />
                {errors.username?.type === 'required' &&
                    <Form.Text className="text-danger d-block">
                        * El nombre de usuario es requerido.
                    </Form.Text>
                }
                {errors.username?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * El nombre de usuario es demasiado largo.
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Contraseña *</Form.Label>
                <Form.Control name='password' type='password' value={formData.password} />
                {errors.password?.type === 'required' &&
                    <Form.Text className="text-danger d-block">
                        * La contraseña es requerida.
                    </Form.Text>
                }
                {errors.password?.type === 'minLength' &&
                    <Form.Text className="text-danger d-block">
                        * La contraseña es demasiado corta.
                    </Form.Text>
                }
                {errors.password?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * La contraseña es demasiado larga.
                    </Form.Text>
                }
            </Form.Group>
            {forAuth ?
                <div className='mt-5 d-flex justify-content-center'>
                    <Button variant="primary" type="submit" className='w-75'>
                        Entrar
                    </Button>
                </div> :
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
            }
        </Form>
    );
}