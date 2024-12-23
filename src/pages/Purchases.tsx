import { useContext, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { AuthContext } from "../contexts/AuthContext";
import { usePurchases } from "../hooks/usePurchases";
import { useSuppliers } from "../hooks/useSuppliers";
import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { PurchaseForm } from "../components/entities/PurchaseForm";
import { AddIcon } from "../components/svg/AddIcon";
import { BuyPaymentsList } from "../components/payments/BuyPaymentsList";
import { LoginPage } from "./LoginPage";

export function Purchases() {

    const { auth } = useContext(AuthContext);

    const {
        purchases,
        setPurchases,
        getPurchases,
        columns,
        showForm,
        setShowForm,
        purchaseFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deletePurchase,
        items,
        setItems,
        idsToDelete,
        setIdsToDelete
    } = usePurchases();
    const { formData, setFormData } = purchaseFormData;
    const { suppliers, getSuppliers } = useSuppliers();
    const { products, getProducts } = useProducts();

    useEffect(() => {
        getSuppliers();
        getProducts();
    }, [])

    useEffect(() => {
        const { page, offset, from, to } = filter;
        getPurchases(page, offset, from?.toString(), to?.toString());
    }, [filter]);

    useEffect(() => {
        if (showForm === 'EDIT' || showForm === 'VIEW' || showForm === 'DELETE') setItems(formData.buy_products);
    }, [formData, showForm]);

    return (
        <>
            {auth ?
                <Layout>
                    {showForm === 'NEW' || showForm === 'EDIT' || showForm === 'VIEW' ?
                        <>
                            <h2>
                                {showForm === 'NEW' ? 'Nueva compra' :
                                    showForm === 'EDIT' ? `Editar compra #${formData.id}` :
                                        `Compra #${formData.id}`
                                }
                            </h2>
                            <PurchaseForm
                                showForm={showForm}
                                purchaseFormData={purchaseFormData}
                                setShowForm={setShowForm}
                                handleSubmit={handleSubmit}
                                suppliers={suppliers}
                                items={items}
                                setItems={setItems}
                                products={products}
                                idsToDelete={idsToDelete}
                                setIdsToDelete={setIdsToDelete}
                            />
                        </> :
                        showForm === 'ADJUST' ?
                            <BuyPaymentsList buyOrder={formData} setBuyOrderShowForm={setShowForm} /> :
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex gap-3 align-items-center">
                                        <h2>Compras</h2>
                                        <Form.Group controlId="from">
                                            <Form.Label className="mb-0">Desde</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={filter.from}
                                                onChange={e => setFilter({ ...filter, from: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="to">
                                            <Form.Label className="mb-0">Hasta</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={filter.to}
                                                onChange={e => setFilter({ ...filter, to: e.target.value })}
                                            />
                                        </Form.Group>
                                    </div>
                                    <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                                        <AddIcon />
                                    </button>
                                </div>
                                <TableComponent
                                    columns={columns}
                                    rows={purchases}
                                    setRows={setPurchases}
                                    filter={filter}
                                    setFilter={setFilter}
                                    totalRows={totalRows}
                                    setFormData={setFormData}
                                    setShowForm={setShowForm}
                                    actions
                                    showViewAction
                                    showEditAction
                                    showDeleteAction
                                    showAdjustAction
                                />
                                <Modal show={showForm === 'DELETE'} onHide={handleClose} backdrop="static" keyboard={false}        >
                                    <Modal.Header closeButton>
                                        <Modal.Title>{`Borrar compra #${formData.id}`}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Los datos no podrán ser recuperados.
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Cancelar
                                        </Button>
                                        <Button variant="danger" onClick={deletePurchase}>Confirmar</Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                    }
                </Layout> :
                <LoginPage />
            }
        </>
    )
}