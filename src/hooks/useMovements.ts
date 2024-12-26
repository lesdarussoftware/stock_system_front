/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { format } from 'date-fns';

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, Movement } from "../utils/types";
import { MOVEMENT_URL } from "../utils/urls";
import { STATUS_CODES } from "../utils/statusCodes";

export function useMovements() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const movementFormData = useForm({
        defaultData: {
            id: '',
            product_id: '',
            amount: 1,
            date: format(new Date(Date.now()), 'yyyy-MM-dd'),
            type: 'INGRESO',
            observations: '',
            user: ''
        },
        rules: {
            observations: { maxLength: 125 }
        }
    })

    const [loadingMovements, setLoadingMovements] = useState<boolean>(true);
    const [movements, setMovements] = useState<Movement[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 0, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getMovements(product_id: number, params?: string | undefined) {
        const { status, data } = await handleQuery({
            url: `${MOVEMENT_URL}/${product_id}${params ? `${params}` : ''}`
        })
        if (status === STATUS_CODES.OK) {
            setMovements(data[0]);
            setTotalRows(data[1]);
        }
        setLoadingMovements(false)
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { formData, validate, reset, setDisabled } = movementFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? MOVEMENT_URL : showForm === 'EDIT' ? `${MOVEMENT_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setMovements([data, ...movements]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Movimiento registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setMovements([
                    data,
                    ...movements.filter(item => item.id !== data.id)
                ]);
                setBodyMessage('Movimiento editado correctamente.')
            } else {
                setBodyMessage(data.message)
                setSeverity('ERROR')
                setDisabled(false)
            }
            if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
                setSeverity('SUCCESS')
                reset(setShowForm)
            }
            setHeaderMessage(formData.type);
            setOpenMessage(true)
        }
    }

    async function deleteMovement() {
        const { status, data } = await handleQuery({
            url: `${MOVEMENT_URL}/${movementFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setMovements([...movements.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setSeverity('SUCCESS')
            setBodyMessage('Movimiento eliminado correctamente.')
            movementFormData.reset(setShowForm)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setBodyMessage(data.message)
            setSeverity('ERROR')
            movementFormData.setDisabled(false)
        }
        handleClose();
        setHeaderMessage(movementFormData.formData.type);
        setOpenMessage(true)
    }

    function handleClose() {
        movementFormData.reset(setShowForm);
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
            accessor: 'date'
        },
        {
            id: 'type',
            label: 'Tipo',
            accessor: 'type'
        },
        {
            id: 'amount',
            label: 'Cantidad',
            sortable: true,
            accessor: 'amount'
        },
        {
            id: 'observations',
            label: 'Observaciones',
            accessor: 'observations'
        },
        {
            id: 'user',
            label: 'Creado por',
            accessor: 'user'
        }
    ], []);

    return {
        movements,
        setMovements,
        getMovements,
        loadingMovements,
        columns,
        movementFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteMovement,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}