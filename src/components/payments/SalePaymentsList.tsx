import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useSalePayments } from "../../hooks/useSalePayments";

import { TableComponent } from "../common/TableComponent";
import { PaymentForm } from "../entities/PaymentForm";
import { AddIcon } from "../svg/AddIcon";

import { ShowFormType, SaleOrder } from "../../utils/types";

type SalePaymentsListProps = {
    saleOrder: SaleOrder;
    setSaleOrderShowForm: (value: ShowFormType) => void;
}

export function SalePaymentsList({ saleOrder, setSaleOrderShowForm }: SalePaymentsListProps) {

    const {
        salePayments,
        salePaymentFormData,
        showForm,
        setShowForm,
        handleSubmit,
        columns,
        setSalePayments,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteSalePayment
    } = useSalePayments();
    const { formData, setFormData } = salePaymentFormData;

    return (
        <>
            {showForm === 'NEW' || showForm === 'EDIT' ?
                <>
                    <h2>
                        {showForm === 'NEW' ? `Nuevo pago para la venta #${saleOrder.id}` :
                            `Editar pago #${formData.id} de la venta #${saleOrder.id}`}
                    </h2>
                    <PaymentForm
                        paymentFormData={salePaymentFormData}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                    />
                </> :
                <>
                    <div className='d-flex justify-content-between align-items-start'>
                        <h2>{`Pagos de la venta #${saleOrder.id}`}</h2>
                        <div className="d-flex gap-2 align-items-center mb-2">
                            <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                                <AddIcon />
                            </button>
                            <Button variant="secondary" type="button" onClick={() => setSaleOrderShowForm(null)}>
                                Volver a lista de ventas
                            </Button>
                        </div>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={salePayments}
                        setRows={setSalePayments}
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
                            <Modal.Title>{`Borrar pago #${formData.id} de la venta #${saleOrder.id}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Los datos no podrán ser recuperados.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={deleteSalePayment}>Confirmar</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
        </>
    )
}