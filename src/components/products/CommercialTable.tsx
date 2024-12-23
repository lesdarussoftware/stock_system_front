/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import { DeleteIcon } from '../svg/DeleteIcon';
import { Autocomplete } from '../common/Autocomplete';

import { getItemSalePrice } from '../../utils/helpers';
import { Item, ShowFormType, Product } from '../../utils/types';

type CommercialTableProps = {
    showForm: ShowFormType,
    products: Product[];
    items: any;
    setItems: (value: any) => void;
    idsToDelete: number[];
    setIdsToDelete: any;
    type: 'SALE' | 'PURCHASE'
}

export function CommercialTable({
    showForm,
    products,
    items,
    setItems,
    idsToDelete,
    setIdsToDelete,
    type
}: CommercialTableProps) {

    const handleAdd = (pId: number) => {
        setItems([
            ...items.filter((i: any) => i.product_id !== pId),
            {
                product_id: pId,
                product_buy_price: products.find(p => p.id === pId)?.buy_price,
                product_earn: products.find(p => p.id === pId)?.earn,
                product_sale_price: products.find(p => p.id === pId)?.sale_price,
                amount: 1
            }
        ].sort((a: any, b: any) => a.product_id - b.product_id));
    }

    const handleChangeAmount = (amount: number, pId: number) => {
        setItems([
            ...items.filter((i: any) => i.product_id !== pId),
            {
                ...items.find((i: any) => i.product_id === pId),
                amount
            }
        ].sort((a: any, b: any) => a.product_id - b.product_id));
    }

    const handleDelete = (id: number) => {
        if (showForm === 'NEW') {
            setItems(items.filter((i: any) => i.product_id !== id));
        } else {
            setItems(items.filter((i: any) => i.id !== id));
        }
        setIdsToDelete([id, ...idsToDelete]);
    }

    return (
        <>
            <h3 className='mt-4'>Artículos</h3>
            <div className='mb-2'>
                {(showForm === 'NEW' || showForm === 'EDIT') &&
                    <Autocomplete
                        options={products
                            .filter(p => !items.map((i: Item) => i.product_id).includes(p.id))
                            .map(p => ({ id: p.id, label: p.name }))}
                        placeholder='Ingrese nombre o sku del producto...'
                        onChange={value => handleAdd(+value)}
                    />
                }
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Stock</th>
                        <th>Cantidad</th>
                        <th>Total det.</th>
                        {(showForm === 'NEW' || showForm === 'EDIT') && <th />}
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ?
                        <tr>
                            <td colSpan={5} className='text-center'>
                                No hay registros para mostrar.
                            </td>
                        </tr> :
                        items.map((item: any, idx: number) => {
                            const product: any = products.find(p => +p.id === +item.product_id)!;
                            return (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <Form.Control
                                            type='number'
                                            min={1}
                                            step={1}
                                            name='amount'
                                            value={+item.amount}
                                            disabled={showForm === 'VIEW'}
                                            onChange={(e: any) => handleChangeAmount(e.target.value, product.id)}
                                        />
                                    </td>
                                    <td>
                                        {type === 'PURCHASE' ?
                                            `$${(+item.product_buy_price * +item.amount).toFixed(2)}` :
                                            `$${(getItemSalePrice(item) * +item.amount).toFixed(2)}`}
                                    </td>
                                    {(showForm === 'NEW' || showForm === 'EDIT') &&
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm d-flex align-items-center"
                                                onClick={() => handleDelete(showForm === 'NEW' ? product.id : item.id)}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </td>
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </>
    );
}
