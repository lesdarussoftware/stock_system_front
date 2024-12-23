/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, Supplier } from "../utils/types";
import { STATUS_CODES } from "../utils/statusCodes";
import { SUPPLIER_URL } from "../utils/urls";

export function useSuppliers() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const supplierFormData = useForm({
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

    const [loadingSuppliers, setLoadingSuppliers] = useState<boolean>(true);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getSuppliers(params: string | undefined) {
        const { status, data } = await handleQuery({ url: `${SUPPLIER_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setSuppliers(data[0]);
            setTotalRows(data[1]);
        }
        setLoadingSuppliers(false)
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { formData, validate, reset, setDisabled } = supplierFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? SUPPLIER_URL : showForm === 'EDIT' ? `${SUPPLIER_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setSuppliers([data, ...suppliers]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Proveedor registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setSuppliers([
                    data,
                    ...suppliers.filter(item => item.id !== data.id)
                ].sort((a, b) => a.name - b.name));
                setBodyMessage('Proveedor editado correctamente.')
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

    async function deleteSupplier() {
        const { status, data } = await handleQuery({
            url: `${SUPPLIER_URL}/${supplierFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setSuppliers([...suppliers.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setSeverity('SUCCESS')
            setBodyMessage('Proveedor eliminado correctamente.')
            supplierFormData.reset()
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setBodyMessage(data.message)
            setSeverity('ERROR')
            supplierFormData.setDisabled(false)
        }
        handleClose();
        setHeaderMessage(supplierFormData.formData.name);
        setOpenMessage(true)
    }

    function handleClose() {
        supplierFormData.reset();
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
        suppliers,
        setSuppliers,
        getSuppliers,
        loadingSuppliers,
        columns,
        supplierFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteSupplier,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}