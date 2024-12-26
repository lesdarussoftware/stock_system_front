/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";

import { MessageContext } from "../contexts/MessageContext";

import { useForm } from "./useForm";
import { useQuery } from "./useQuery";

import { ShowFormType, Product } from "../utils/types";
import { getProductSalePrice } from "../utils/helpers";
import { STATUS_CODES } from "../utils/statusCodes";
import { PRODUCT_URL } from "../utils/urls";

export function useProducts() {

    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();
    const productFormData = useForm({
        defaultData: {
            id: '',
            name: '',
            sku: '',
            bar_code: '',
            description: '',
            buy_price: 0.01,
            earn: 0,
            sale_price: 0,
            min_stock: 0,
            is_active: true,
            category_id: '',
            supplier_id: '',
            store_id: ''
        },
        rules: {
            name: { required: true, maxLength: 55 },
            sku: { required: true, maxLength: 55 },
            bar_code: { maxLength: 55 },
            description: { maxLength: 55 },
            category_id: { required: true },
            supplier_id: { required: true }
        }
    })

    const [loandingProducts, setLoadingProducts] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState<ShowFormType>(null);
    const [filter, setFilter] = useState<{
        page: number;
        offset: number;
        name?: string;
        sku?: string;
    }>({ page: 0, offset: 50, name: '', sku: '' });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function getProducts(params?: string | undefined) {
        const { status, data } = await handleQuery({ url: `${PRODUCT_URL}${params ? `${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            setProducts(data[0]);
            setTotalRows(data[1]);
        }
        setLoadingProducts(false)
    }

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { formData, validate, reset, setDisabled } = productFormData;
        if (validate()) {
            const { status, data } = await handleQuery({
                url: showForm === 'NEW' ? PRODUCT_URL : showForm === 'EDIT' ? `${PRODUCT_URL}/${formData.id}` : '',
                method: showForm === 'NEW' ? 'POST' : showForm === 'EDIT' ? 'PUT' : 'GET',
                body: JSON.stringify({
                    ...formData,
                    supplier_id: +formData.supplier_id,
                    category_id: +formData.category_id,
                    store_id: formData.store_id ? +formData.store_id : undefined
                })
            })
            if (status === STATUS_CODES.CREATED) {
                setProducts([data, ...products]);
                setTotalRows(totalRows + 1)
                setBodyMessage('Producto registrado correctamente.')
            } else if (status === STATUS_CODES.OK) {
                setProducts([
                    data,
                    ...products.filter(item => item.id !== data.id)
                ]);
                setBodyMessage('Producto editado correctamente.')
            } else {
                setBodyMessage(data.message)
                setSeverity('ERROR')
                setDisabled(false)
            }
            if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
                setSeverity('SUCCESS')
                reset(setShowForm)
            }
            setHeaderMessage(formData.name);
            setOpenMessage(true)
        }
    }

    async function deleteProduct() {
        const { status, data } = await handleQuery({
            url: `${PRODUCT_URL}/${productFormData.formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setProducts([...products.filter(item => item.id !== data.id)]);
            setTotalRows(totalRows - 1)
            setSeverity('SUCCESS')
            setBodyMessage('Producto eliminado correctamente.')
            productFormData.reset(setShowForm)
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setBodyMessage(data.message)
            setSeverity('ERROR')
            productFormData.setDisabled(false)
        }
        handleClose();
        setHeaderMessage(productFormData.formData.name);
        setOpenMessage(true)
    }

    function handleClose() {
        productFormData.reset(setShowForm);
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
            id: 'sku',
            label: 'SKU',
            sortable: true,
            accessor: 'sku'
        },
        {
            id: 'bar_code',
            label: 'Cód. barra',
            accessor: 'bar_code'
        },
        {
            id: 'sale_price',
            label: 'P. venta',
            accessor: (row: Product) => `$${getProductSalePrice(row)}`
        },
        {
            id: 'stock',
            label: 'Stock',
            accessor: 'stock'
        },
        {
            id: 'min_stock',
            label: 'Stock mín.',
            accessor: 'min_stock'
        },
        {
            id: 'category',
            label: 'Categoría',
            accessor: (row: Product) => row.category?.name
        },
        {
            id: 'supplier',
            label: 'Proveedor',
            accessor: (row: Product) => row.supplier?.name
        },
        {
            id: 'store',
            label: 'Depósito',
            accessor: (row: Product) => row.store?.name
        },
        {
            id: 'is_active',
            label: 'Activo',
            accessor: (row: Product) => row.is_active ? 'Sí' : 'No'
        },
    ], [])

    return {
        products,
        setProducts,
        getProducts,
        loandingProducts,
        columns,
        productFormData,
        showForm,
        setShowForm,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteProduct
    }
}