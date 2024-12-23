/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";
import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, User } from "../utils/types";
import { STATUS_CODES } from "../utils/statusCodes";
import { USER_URL } from "../utils/urls";

export function useUsers() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const userFormData = useForm({
        defaultData: {
            id: '',
            username: '',
            password: ''
        },
        rules: {
            username: { required: true, maxLength: 55 },
            password: { required: true, minLength: 8, maxLength: 55 }
        }
    });

    const [laodingUsers, setLoadingUsers] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getUsers(params?: string | undefined) {
        const { status, data } = await handleQuery({ url: `${USER_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setUsers(data[0]);
            setTotalRows(data[1]);
        }
        setLoadingUsers(false)
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { formData, validate, reset, setDisabled } = userFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? USER_URL : showForm === 'EDIT' ? `${USER_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setUsers([data, ...users]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Usuario registrado correctamente.')
                setSeverity('SUCCESS')
                reset()
            } else {
                setBodyMessage(data.message)
                setSeverity('ERROR')
                setDisabled(false)
            }
            setHeaderMessage(formData.username);
            setOpenMessage(true)
        }
    }

    function handleClose() {
        userFormData.reset();
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
            id: 'username',
            label: 'Nombre usuario',
            sortable: true,
            accessor: 'username'
        }
    ], [])

    return {
        userFormData,
        users,
        setUsers,
        getUsers,
        laodingUsers,
        columns,
        showForm,
        setShowForm,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose
    };
}
