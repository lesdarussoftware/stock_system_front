/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { format } from 'date-fns';

import { Autocomplete } from '../common/Autocomplete';
import { CommercialTable } from '../products/CommercialTable';

import { ShowFormType, Product, Supplier } from '../../utils/types';
import { getPurchaseTotal } from '../../utils/helpers';

type PurchaseFormProps = {
    showForm: ShowFormType;
    purchaseFormData: any;
    setShowForm: (value: ShowFormType) => void;
    handleSubmit: (e: any) => void
    suppliers: Supplier[];
    products: Product[];
    items: any;
    setItems: (value: any) => void;
    idsToDelete: number[];
    setIdsToDelete: any;
}

export function PurchaseForm({
    showForm,
    purchaseFormData,
    setShowForm,
    handleSubmit,
    suppliers,
    products,
    items,
    setItems,
    idsToDelete,
    setIdsToDelete
}: PurchaseFormProps) {

    const { errors, handleChange, reset, formData } = purchaseFormData;

    return (
        <Form className='mt-4' onSubmit={e => handleSubmit(e)}>
            <Form.Label>Proveedor</Form.Label>
            {(showForm === 'NEW' || showForm === 'EDIT') &&
                <Autocomplete
                    options={suppliers.map(s => ({ id: s.id, label: s.name }))}
                    placeholder='Ingrese el nombre del proveedor...'
                    onChange={value => handleChange({ target: { name: 'supplier_id', value } })}
                />
            }
            {errors.supplier_id?.type === 'required' &&
                <Form.Text className="text-danger d-block">
                    * El proveedor es requerido.
                </Form.Text>
            }
            <Form.Group controlId="date" className='my-3'>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                    type='date'
                    name='date'
                    value={formData.date}
                    disabled={showForm === 'VIEW'}
                    onChange={e => {
                        const formatted = format(e.target.value.replace('-', '/'), 'yyyy-MM-dd');
                        const value = format(new Date(formatted + 'T00:00:00'), 'yyyy-MM-dd');
                        handleChange({ target: { name: 'date', value } });
                    }}
                />
            </Form.Group>
            <Form.Group controlId="payments_amount" className='mb-3'>
                <Form.Label>Cantidad Pagos</Form.Label>
                <Form.Control
                    type='number'
                    min={1}
                    step={1}
                    name='payments_amount'
                    value={formData.payments_amount}
                    onChange={e => handleChange({
                        target: {
                            name: 'payments_amount',
                            value: +e.target.value <= 1 ? 1 : +e.target.value
                        }
                    })}
                />
            </Form.Group>
            <Form.Group controlId="status">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                    name='status'
                    value={formData.status}
                    disabled={showForm === 'VIEW'}
                    onChange={e => handleChange({ target: { name: 'status', value: e.target.value } })}
                >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="FINALIZADA">FINALIZADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                </Form.Select>
            </Form.Group>
            <CommercialTable
                items={items}
                setItems={setItems}
                products={products}
                idsToDelete={idsToDelete}
                setIdsToDelete={setIdsToDelete}
                showForm={showForm}
                type='PURCHASE'
            />
            <h4>Total: {`$${getPurchaseTotal(items)}`}</h4>
            <div className='mt-5 d-flex justify-content-center gap-3'>
                <Button variant="secondary" type="button" className='w-25' onClick={() => {
                    setShowForm(null);
                    setShowForm(null);
                    reset();
                }}>
                    {showForm === 'VIEW' ? 'Volver' : 'Cancelar'}
                </Button>
                {(showForm === 'NEW' || showForm === 'EDIT') &&
                    <Button variant="primary" type="submit" className='w-25' disabled={formData.disabled || items.length === 0}>
                        Guardar
                    </Button>
                }
            </div>
        </Form>
    );
}