/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useMovements } from "../../hooks/useMovements";

import { TableComponent } from "../common/TableComponent";
import { MovementForm } from "../entities/MovementForm";
import { AddIcon } from "../svg/AddIcon";

import { ShowFormType, Product } from "../../utils/types";

type MovementsListProps = {
    product: Product;
    setProductShowForm: (value: ShowFormType) => void;
    products: Product[];
    setProducts: any;
}

export function MovementsList({ product, setProductShowForm, products, setProducts }: MovementsListProps) {

    const {
        movements,
        setMovements,
        getMovements,
        columns,
        filter,
        setFilter,
        totalRows,
        showForm,
        setShowForm,
        movementFormData,
        handleSubmit,
        handleClose,
        deleteMovement
    } = useMovements();
    const { formData, setFormData } = movementFormData;

    useEffect(() => {
        getMovements(+product.id);
    }, []);

    useEffect(() => {
        if (showForm === 'NEW') setFormData({ ...formData, product_id: product.id });
    }, [showForm])

    return (
        <>
            {showForm === 'NEW' || showForm === 'EDIT' ?
                <>
                    <h2>
                        {showForm === 'NEW' ? `Nuevo movimiento para el artículo ${product.sku}` :
                            `Editar movimiento #${formData.id} del artículo ${product.sku}`}
                    </h2>
                    <MovementForm
                        movementFormData={movementFormData}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                        products={products}
                        setProducts={setProducts}
                    />
                </> :
                <>
                    <div className='d-flex justify-content-between align-items-start'>
                        <h2>{`Movimientos del artículo ${product.sku}`}</h2>
                        <div className="d-flex gap-2 align-items-center mb-2">
                            <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                                <AddIcon />
                            </button>
                            <Button variant="secondary" type="button" onClick={() => setProductShowForm(null)}>
                                Volver a lista de artículos
                            </Button>
                        </div>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={movements}
                        setRows={setMovements}
                        filter={filter}
                        setFilter={setFilter}
                        totalRows={totalRows}
                        setFormData={setFormData}
                        setShowForm={setShowForm}
                        actions
                        showEditAction
                        showDeleteAction
                    />
                    <Modal show={showForm === 'DELETE'} onHide={handleClose} backdrop="static" keyboard={false}        >
                        <Modal.Header closeButton>
                            <Modal.Title>{`Borrar movimiento #${formData.id} del artículo ${product.sku}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Los datos no podrán ser recuperados.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={deleteMovement}>Confirmar</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
        </>
    )
}