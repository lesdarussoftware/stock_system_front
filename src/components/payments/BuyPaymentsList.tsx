import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useBuyPayments } from "../../hooks/useBuyPayments";

import { TableComponent } from "../common/TableComponent";
import { PaymentForm } from "../entities/PaymentForm";
import { AddIcon } from "../svg/AddIcon";

import { ShowFormType, BuyOrder } from "../../utils/types";

type BuyPaymentsListProps = {
    buyOrder: BuyOrder;
    setBuyOrderShowForm: (value: ShowFormType) => void;
}

export function BuyPaymentsList({ buyOrder, setBuyOrderShowForm }: BuyPaymentsListProps) {

    const {
        buyPayments,
        buyPaymentFormData,
        showForm,
        setShowForm,
        handleSubmit,
        columns,
        setBuyPayments,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteBuyPayment
    } = useBuyPayments();
    const { formData, setFormData } = buyPaymentFormData;

    return (
        <>
            {showForm === 'NEW' || showForm === 'EDIT' ?
                <>
                    <h2>
                        {showForm === 'NEW' ? `Nuevo pago para la compra #${buyOrder.id}` :
                            `Editar pago #${formData.id} de la compra #${buyOrder.id}`}
                    </h2>
                    <PaymentForm
                        paymentFormData={buyPaymentFormData}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                    />
                </> :
                <>
                    <div className='d-flex justify-content-between align-items-start'>
                        <h2>{`Pagos de la compra #${buyOrder.id}`}</h2>
                        <div className="d-flex gap-2 align-items-center mb-2">
                            <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                                <AddIcon />
                            </button>
                            <Button variant="secondary" type="button" onClick={() => setBuyOrderShowForm(null)}>
                                Volver a lista de compras
                            </Button>
                        </div>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={buyPayments}
                        setRows={setBuyPayments}
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
                            <Modal.Title>{`Borrar pago #${formData.id} de la compra #${buyOrder.id}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Los datos no podrán ser recuperados.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={deleteBuyPayment}>Confirmar</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
        </>
    )
}