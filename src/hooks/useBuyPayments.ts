/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, BuyPayment } from "../utils/types";
import { BUY_PAYMENT_URL } from "../utils/urls";
import { STATUS_CODES } from "../utils/statusCodes";

export function useBuyPayments() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const buyPaymentFormData = useForm({
        defaultData: {
            id: '',
            buy_order_id: '',
            method: 'EFECTIVO',
            amount: '',
            date: new Date(Date.now()),
            observations: ''
        },
        rules: { amount: { required: true }, observations: { maxLength: 55 } }
    });

    const [buyPayments, setBuyPayments] = useState<BuyPayment[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset, setDisabled } = buyPaymentFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? BUY_PAYMENT_URL : showForm === 'EDIT' ? `${BUY_PAYMENT_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setBuyPayments([data, ...buyPayments]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Pago registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setBuyPayments([
                    data,
                    ...buyPayments.filter(item => item.id !== data.id)
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

    async function deleteBuyPayment() {
        const { status, data } = await handleQuery({
            url: `${BUY_PAYMENT_URL}/${buyPaymentFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setBuyPayments([...buyPayments.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setSeverity('SUCCESS')
            setHeaderMessage('Éxito');
            setBodyMessage('Pago eliminado correctamente.')
            buyPaymentFormData.reset()
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setHeaderMessage('Error');
            setBodyMessage(data.message)
            setSeverity('ERROR')
            buyPaymentFormData.setDisabled(false)
        }
        handleClose();
        setOpenMessage(true)
    }

    function handleClose() {
        buyPaymentFormData.reset();
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
            accessor: (row: BuyPayment) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'amount',
            label: 'Monto',
            sortable: true,
            accessor: (row: BuyPayment) => `$${row.amount}`
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
        buyPayments,
        setBuyPayments,
        columns,
        buyPaymentFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteBuyPayment,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}