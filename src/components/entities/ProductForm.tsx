/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ShowFormType, Category, Store, Supplier } from '../../utils/types';

type ProductFormProps = {
    productFormData: any;
    showForm: ShowFormType;
    setShowForm: (value: ShowFormType) => void;
    handleSubmit: (e: any) => void;
    categories: Category[];
    suppliers: Supplier[];
    stores: Store[];
}

export function ProductForm({
    productFormData,
    showForm,
    setShowForm,
    handleSubmit,
    categories,
    suppliers,
    stores
}: ProductFormProps) {

    const { errors, handleChange, reset, formData } = productFormData;

    return (
        <Form className='mt-4' onChange={handleChange} onSubmit={e => handleSubmit(e)}>
            <div className='d-flex align-items-end justify-content-between mb-3 gap-5'>
                <Form.Group controlId="name" className={showForm === 'EDIT' ? 'w-75' : 'w-100'}>
                    <Form.Label>Nombre *</Form.Label>
                    <Form.Control name='name' value={formData.name} disabled={showForm === 'VIEW'} />
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
                {(showForm === 'VIEW' || showForm === 'EDIT') &&
                    <Form.Group controlId="is_active" className='w-25'>
                        <Form.Check type="checkbox" label="Activo" checked={formData.is_active} disabled={showForm === 'VIEW'} />
                    </Form.Group>
                }
            </div>
            <div className='d-flex justify-content-between mb-3 gap-5'>
                <Form.Group controlId="sku" className='w-50'>
                    <Form.Label>SKU *</Form.Label>
                    <Form.Control name='sku' value={formData.sku} disabled={showForm === 'VIEW'} />
                    {errors.sku?.type === 'required' &&
                        <Form.Text className="text-danger d-block">
                            * El sku es requerido.
                        </Form.Text>
                    }
                    {errors.sku?.type === 'maxLength' &&
                        <Form.Text className="text-danger d-block">
                            * El sku es demasiado largo.
                        </Form.Text>
                    }
                </Form.Group>
                <Form.Group controlId="bar_code" className='w-50'>
                    <Form.Label>Cód. barras</Form.Label>
                    <Form.Control name='bar_code' value={formData.bar_code} disabled={showForm === 'VIEW'} />
                    {errors.bar_code?.type === 'maxLength' &&
                        <Form.Text className="text-danger d-block">
                            * El código de barras es demasiado largo.
                        </Form.Text>
                    }
                </Form.Group>
            </div>
            <Form.Group className="mb-3" controlId="description">
                <Form.Label>Descripción</Form.Label>
                <Form.Control name='description' value={formData.description} disabled={showForm === 'VIEW'} />
                {errors.description?.type === 'maxLength' &&
                    <Form.Text className="text-danger d-block">
                        * La descripción es demasiado larga.
                    </Form.Text>
                }
            </Form.Group>
            <div className='d-flex justify-content-between mb-3 gap-5'>
                <Form.Group controlId="buy_price" className='w-25'>
                    <Form.Label>Precio compra</Form.Label>
                    <Form.Control type='number' min={0} step="0.01" name='buy_price' value={formData.buy_price} disabled={showForm === 'VIEW'} />
                </Form.Group>
                <Form.Group controlId="earn" className='w-25'>
                    <Form.Label>% Ganancia</Form.Label>
                    <Form.Control type='number' min={0} max={100} name='earn' value={formData.earn} disabled={showForm === 'VIEW'} />
                </Form.Group>
                <Form.Group controlId="sale_price" className='w-25'>
                    <Form.Label>Precio venta</Form.Label>
                    <Form.Control type='number' min={0} step="0.01" name='sale_price' value={formData.sale_price} disabled={showForm === 'VIEW'} />
                </Form.Group>
                <Form.Group controlId="min_stock" className='w-25'>
                    <Form.Label>Stock mínimo</Form.Label>
                    <Form.Control type='number' min={0} step="1" name='min_stock' value={formData.min_stock} disabled={showForm === 'VIEW'} />
                </Form.Group>
            </div>
            <div className='d-flex justify-content-between mb-3'>
                <Form.Group controlId="category_id" className='w-25'>
                    <Form.Label>Categoría *</Form.Label>
                    <Form.Select name='category_id' value={formData.category_id} disabled={showForm === 'VIEW'}>
                        <option value="">Seleccione</option>
                        {categories.map((cat: Category) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </Form.Select>
                    {errors.category_id?.type === 'required' &&
                        <Form.Text className="text-danger d-block">
                            * La categoría es requerida.
                        </Form.Text>
                    }
                </Form.Group>
                <Form.Group controlId="supplier_id" className='w-25'>
                    <Form.Label>Proveedor *</Form.Label>
                    <Form.Select name='supplier_id' value={formData.supplier_id} disabled={showForm === 'VIEW'}>
                        <option value="">Seleccione</option>
                        {suppliers.map((sup: Supplier) => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                    </Form.Select>
                    {errors.supplier_id?.type === 'required' &&
                        <Form.Text className="text-danger d-block">
                            * El proveedor es requerido.
                        </Form.Text>
                    }
                </Form.Group>
                <Form.Group controlId="store_id" className='w-25'>
                    <Form.Label>Depósito</Form.Label>
                    <Form.Select name='store_id' value={formData.store_id} disabled={showForm === 'VIEW'}>
                        <option value="">Seleccione</option>
                        {stores.map((s: Store) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Form.Select>
                </Form.Group>
            </div>
            <div className='mt-5 d-flex justify-content-center gap-3'>
                <Button variant="secondary" type="button" className='w-25' onClick={() => {
                    setShowForm(null);
                    reset(setShowForm);
                }}>
                    {showForm === 'VIEW' ? 'Volver' : 'Cancelar'}
                </Button>
                {(showForm === 'NEW' || showForm === 'EDIT') &&
                    <Button variant="primary" type="submit" className='w-25' disabled={parseFloat(formData.buy_price) <= 0}>
                        Guardar
                    </Button>
                }
            </div>
        </Form>
    );
}