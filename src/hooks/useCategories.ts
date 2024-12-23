/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, Category } from "../utils/types";
import { STATUS_CODES } from "../utils/statusCodes";
import { CATEGORY_URL } from "../utils/urls";

export function useCategories() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const categoryFormData = useForm({
        defaultData: { id: '', name: '', description: '' },
        rules: { name: { required: true, maxLength: 55 }, description: { maxLength: 55 } }
    })

    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getCategories(params: string | undefined) {
        const { status, data } = await handleQuery({ url: `${CATEGORY_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setCategories(data[0]);
            setTotalRows(data[1]);
        }
        setLoadingCategories(false)
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { formData, validate, reset, setDisabled } = categoryFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? CATEGORY_URL : showForm === 'EDIT' ? `${CATEGORY_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify(formData)
            })
            if (status === STATUS_CODES.CREATED) {
                setCategories([data, ...categories]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Categoría registrada correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setCategories([
                    data,
                    ...categories.filter(item => item.id !== data.id)
                ].sort((a, b) => a.name - b.name));
                setBodyMessage('Categoría editada correctamente.')
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

    async function deleteCategory() {
        const { status, data } = await handleQuery({
            url: `${CATEGORY_URL}/${categoryFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setCategories([...categories.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setSeverity('SUCCESS')
            setBodyMessage('Categoría eliminada correctamente.')
            categoryFormData.reset()
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setBodyMessage(data.message)
            setSeverity('ERROR')
            categoryFormData.setDisabled(false)
        }
        handleClose();
        setHeaderMessage(categoryFormData.formData.name);
        setOpenMessage(true)
    }

    function handleClose() {
        categoryFormData.reset();
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
            id: 'description',
            label: 'Descripción',
            accessor: 'description'
        }
    ], [])

    return {
        categories,
        setCategories,
        getCategories,
        loadingCategories,
        columns,
        categoryFormData,
        showForm,
        setShowForm,
        handleSubmit,
        deleteCategory,
        filter,
        setFilter,
        totalRows,
        handleClose
    }
}