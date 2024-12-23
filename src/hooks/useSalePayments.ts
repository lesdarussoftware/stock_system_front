/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, SalePayment } from "../utils/types";
import { SALE_PAYMENT_URL } from "../utils/urls";
import { STATUS_CODES } from "../utils/statusCodes";

export function useSalePayments() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const salePaymentFormData = useForm({
        defaultData: {
            id: '',
            sale_order_id: '',
            method: 'EFECTIVO',
            amount: '',
            date: new Date(Date.now()),
            observations: ''
        },
        rules: { amount: { required: true }, observations: { maxLength: 55 } }
    });

    const [salePayments, setSalePayments] = useState<SalePayment[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset, setDisabled } = salePaymentFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? SALE_PAYMENT_URL : showForm === 'EDIT' ? `${SALE_PAYMENT_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setSalePayments([data, ...salePayments]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Pago registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setSalePayments([
                    data,
                    ...salePayments.filter(item => item.id !== data.id)
                ]);
                setBodyMessage('Pago editado correctamente.')
            } else {
                setHeaderMessage('Error');
                setBodyMessage(data.message)
                setSeverity('ERROR')
                setDisabled(false)
            }
            if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
                setHeaderMessage('Éxito');
                setSeverity('SUCCESS')
                reset()
            }
            setOpenMessage(true)
        }
    }

    async function deleteSalePayment() {
        const { status, data } = await handleQuery({
            url: `${SALE_PAYMENT_URL}/${salePaymentFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setSalePayments([...salePayments.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setSeverity('SUCCESS')
            setHeaderMessage('Éxito');
            setBodyMessage('Pago eliminado correctamente.')
            salePaymentFormData.reset()
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setHeaderMessage('Error');
            setBodyMessage(data.message)
            setSeverity('ERROR')
            salePaymentFormData.setDisabled(false)
        }
        handleClose();
        setOpenMessage(true)
    }

    function handleClose() {
        salePaymentFormData.reset();
        setShowForm(null);
    }

    const columns = useMemo(() => [
        {
            id: 'id',
            label: '#',
            sortable: true,
            accessor: 'id'
        },
        {
            id: 'date',
            label: 'Fecha',
            sortable: true,
            accessor: (row: SalePayment) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'amount',
            label: 'Monto',
            sortable: true,
            accessor: (row: SalePayment) => `$${row.amount}`
        },
        {
            id: 'method',
            label: 'Método de pago',
            sortable: true,
            accessor: 'method'
        },
        {
            id: 'observations',
            label: 'Observaciones',
            accessor: 'observations'
        }
    ], [])

    return {
        salePayments,
        setSalePayments,
        columns,
        salePaymentFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteSalePayment,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}