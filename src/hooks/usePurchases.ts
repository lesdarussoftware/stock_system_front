/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, BuyOrder } from "../utils/types";
import { BUY_ORDER_URL } from "../utils/urls";
import { STATUS_CODES } from "../utils/statusCodes";

export function usePurchases() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const purchaseFormData = useForm({
        defaultData: {
            id: '',
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            status: 'PENDIENTE',
            payments_amount: 1,
            user: ''
        },
        rules: {}
    })

    const [loadingPurchases, setLoadingPurchases] = useState<boolean>(true);
    const [purchases, setPurchases] = useState<BuyOrder[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{
        page: number;
        offset: number;
        from: number | string | string[] | undefined;
        to: number | string | string[] | undefined;
    }>({
        page: 1,
        offset: 50,
        from: '',
        to: ''
    });
    const [totalRows, setTotalRows] = useState<number>(0);
    const [items, setItems] = useState<any[]>([]);
    const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

    async function getPurchases(params: string | undefined) {
        const { status, data } = await handleQuery({ url: `${BUY_ORDER_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setPurchases(data[0]);
            setTotalRows(data[1]);
        }
        setLoadingPurchases(false)
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { formData, validate, reset, setDisabled } = purchaseFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? BUY_ORDER_URL : showForm === 'EDIT' ? `${BUY_ORDER_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setPurchases([data, ...purchases]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Compra registrada correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setPurchases([
                    data,
                    ...purchases.filter(item => item.id !== data.id)
                ]);
                setBodyMessage('Compra editada correctamente.')
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

    async function deletePurchase() {
        const { status, data } = await handleQuery({
            url: `${BUY_ORDER_URL}/${purchaseFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setPurchases([...purchases.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setHeaderMessage('Éxito');
            setSeverity('SUCCESS')
            setBodyMessage('Compra eliminada correctamente.')
            purchaseFormData.reset()
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setHeaderMessage('Error');
            setBodyMessage(data.message)
            setSeverity('ERROR')
            purchaseFormData.setDisabled(false)
        }
        handleClose();
        setOpenMessage(true)
    }

    function handleClose() {
        purchaseFormData.reset();
        setShowForm(null);
        setItems([]);
        setIdsToDelete([]);
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
            accessor: 'date'
        },
        {
            id: 'status',
            label: 'Estado',
            accessor: 'status'
        },
        {
            id: 'user',
            label: 'Creada por',
            accessor: 'user'
        },
        {
            id: 'total',
            label: 'Total',
            accessor: 'total'
        }
    ], [])

    return {
        purchases,
        setPurchases,
        getPurchases,
        loadingPurchases,
        columns,
        purchaseFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deletePurchase,
        filter,
        setFilter,
        totalRows,
        handleClose,
        items,
        setItems,
        idsToDelete,
        setIdsToDelete
    }
}