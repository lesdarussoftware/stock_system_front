/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, Store } from "../utils/types";
import { STATUS_CODES } from "../utils/statusCodes";
import { STORE_URL } from "../utils/urls";

export function useStores() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const storeFormData = useForm({
        defaultData: {
            id: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            city: ''
        },
        rules: {
            name: { required: true, maxLength: 55 },
            phone: { maxLength: 55 },
            email: { maxLength: 55 },
            address: { maxLength: 55 },
            city: { maxLength: 55 }
        }
    });

    const [loadingStores, setLoadingStores] = useState<boolean>(true);
    const [stores, setStores] = useState<Store[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getStores(params?: string | undefined) {
        const { status, data } = await handleQuery({ url: `${STORE_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setStores(data[0]);
            setTotalRows(data[1]);
        }
        setLoadingStores(false)
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { formData, validate, reset, setDisabled } = storeFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? STORE_URL : showForm === 'EDIT' ? `${STORE_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setStores([data, ...stores]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Depósito registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setStores([
                    data,
                    ...stores.filter(item => item.id !== data.id)
                ].sort((a, b) => a.name - b.name));
                setBodyMessage('Depósito editado correctamente.')
            } else {
                setBodyMessage(data.message)
                setSeverity('ERROR')
                setDisabled(false)
            }
            if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
                setSeverity('SUCCESS')
                reset()
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true)
        }
    }

    async function deleteStore() {
        const { status, data } = await handleQuery({
            url: `${STORE_URL}/${storeFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setStores([...stores.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setSeverity('SUCCESS')
            setBodyMessage('Depósito eliminado correctamente.')
            storeFormData.reset()
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setBodyMessage(data.message)
            setSeverity('ERROR')
            storeFormData.setDisabled(false)
        }
        handleClose();
        setHeaderMessage(storeFormData.formData.name);
        setOpenMessage(true)
    }

    function handleClose() {
        storeFormData.reset();
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
            id: 'name',
            label: 'Nombre',
            sortable: true,
            accessor: 'name'
        },
        {
            id: 'phone',
            label: 'Teléfono',
            accessor: 'phone'
        },
        {
            id: 'email',
            label: 'Email',
            accessor: 'email'
        },
        {
            id: 'address',
            label: 'Dirección',
            accessor: 'address'
        },
        {
            id: 'city',
            label: 'Ciudad',
            accessor: 'city'
        }
    ], [])

    return {
        stores,
        setStores,
        getStores,
        loadingStores,
        columns,
        storeFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteStore,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}