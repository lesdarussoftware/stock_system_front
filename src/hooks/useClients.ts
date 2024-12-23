/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, Client } from "../utils/types";
import { CLIENT_URL } from "../utils/urls";
import { STATUS_CODES } from "../utils/statusCodes";

export function useClients() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const clientFormData = useForm({
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
    })

    const [LoadingClients, setLoadingClients] = useState<boolean>(true);
    const [clients, setClients] = useState<Client[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{
        page: number;
        offset: number;
        name?: string;
    }>({ page: 1, offset: 50, name: '' });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getClients(params?: string | undefined) {
        const { status, data } = await handleQuery({ url: `${CLIENT_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setClients(data[0]);
            setTotalRows(data[1]);
        }
        setLoadingClients(false)
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { formData, validate, reset, setDisabled } = clientFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? CLIENT_URL : showForm === 'EDIT' ? `${CLIENT_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setClients([data, ...clients]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Cliente registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setClients([
                    data,
                    ...clients.filter(item => item.id !== data.id)
                ].sort((a, b) => a.name - b.name));
                setBodyMessage('Cliente editado correctamente.')
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

    async function deleteClient() {
        const { status, data } = await handleQuery({
            url: `${CLIENT_URL}/${clientFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setClients([...clients.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setSeverity('SUCCESS')
            setBodyMessage('Cliente eliminado correctamente.')
            clientFormData.reset()
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setBodyMessage(data.message)
            setSeverity('ERROR')
            clientFormData.setDisabled(false)
        }
        handleClose();
        setHeaderMessage(clientFormData.formData.name);
        setOpenMessage(true)
    }

    function handleClose() {
        clientFormData.reset();
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
        clients,
        setClients,
        getClients,
        LoadingClients,
        columns,
        clientFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteClient,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}