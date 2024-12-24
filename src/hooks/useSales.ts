/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from "date-fns";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, SaleOrder } from "../utils/types";
import { STATUS_CODES } from "../utils/statusCodes";
import { SALE_ORDER_URL } from "../utils/urls";

export function useSales() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const saleFormData = useForm({
        defaultData: {
            id: '',
            client_id: '',
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            status: 'PENDIENTE',
            payments_amount: 1,
            user: ''
        },
        rules: {
            client_id: { required: true }
        }
    })

    const [loadingSales, setLoadingSales] = useState<boolean>(true);
    const [sales, setSales] = useState<SaleOrder[]>([]);
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

    async function getSales(params?: string | undefined) {
        const { status, data } = await handleQuery({ url: `${SALE_ORDER_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setSales(data[0]);
            setTotalRows(data[1]);
        }
        setLoadingSales(false)
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { formData, validate, reset, setDisabled } = saleFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? SALE_ORDER_URL : showForm === 'EDIT' ? `${SALE_ORDER_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify({ ...formData, sale_products: items, ids_to_delete: idsToDelete })
            })
            if (status === STATUS_CODES.CREATED) {
                setSales([data, ...sales]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Venta registrada correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setSales([
                    data,
                    ...sales.filter(item => item.id !== data.id)
                ]);
                setBodyMessage('Venta editada correctamente.')
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

    async function deleteSale() {
        const { status, data } = await handleQuery({
            url: `${SALE_ORDER_URL}/${saleFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setSales([...sales.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setHeaderMessage('Éxito');
            setSeverity('SUCCESS')
            setBodyMessage('Venta eliminada correctamente.')
            saleFormData.reset()
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setHeaderMessage('Error');
            setBodyMessage(data.message)
            setSeverity('ERROR')
            saleFormData.setDisabled(false)
        }
        handleClose();
        setOpenMessage(true)
    }

    function handleClose() {
        saleFormData.reset();
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
            id: 'client',
            label: 'Cliente',
            sortable: true,
            accessor: 'client'
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
        sales,
        setSales,
        getSales,
        loadingSales,
        columns,
        saleFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteSale,
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