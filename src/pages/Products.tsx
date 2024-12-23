import { useContext, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { AuthContext } from "../contexts/AuthContext";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useSuppliers } from "../hooks/useSuppliers";
import { useStores } from "../hooks/useStores";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { ProductForm } from "../components/entities/ProductForm";
import { MovementsList } from "../components/products/MovementsList";
import { AddIcon } from "../components/svg/AddIcon";
import { LoginPage } from "./LoginPage";

export function Products() {

    const { auth } = useContext(AuthContext);

    const { categories, getCategories } = useCategories();
    const { suppliers, getSuppliers } = useSuppliers();
    const { stores, getStores } = useStores();
    const {
        products,
        setProducts,
        getProducts,
        columns,
        showForm,
        setShowForm,
        productFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteProduct
    } = useProducts();
    const { formData, setFormData } = productFormData;

    useEffect(() => {
        getCategories();
        getSuppliers();
        getStores();
    }, []);

    useEffect(() => {
        const { page, offset, name, sku } = filter;
        getProducts(page, offset, name, sku);
    }, [filter]);

    return (
        <>
            {auth ?
                <Layout>
                    {showForm === 'NEW' || showForm === 'VIEW' || showForm === 'EDIT' ?
                        <>
                            <h2>
                                {showForm === 'NEW' ? 'Nuevo artículo' :
                                    showForm === 'VIEW' ? formData.sku :
                                        `Editar artículo #${formData.sku}`}
                            </h2>
                            <ProductForm
                                productFormData={productFormData}
                                showForm={showForm}
                                setShowForm={setShowForm}
                                handleSubmit={handleSubmit}
                                categories={categories}
                                suppliers={suppliers}
                                stores={stores}
                            />
                        </> :
                        showForm === 'ADJUST' ?
                            <MovementsList
                                product={formData}
                                setProductShowForm={setShowForm}
                                products={products}
                                setProducts={setProducts}
                            /> :
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex gap-2">
                                        <h2>Artículos</h2>
                                        <Form.Control
                                            placeholder="Buscar por nombre..."
                                            value={filter.name}
                                            onChange={e => setFilter({ ...filter, name: e.target.value })}
                                        />
                                        <Form.Control
                                            placeholder="Buscar por SKU..."
                                            value={filter.sku}
                                            onChange={e => setFilter({ ...filter, sku: e.target.value })}
                                        />
                                    </div>
                                    <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                                        <AddIcon />
                                    </button>
                                </div>
                                <TableComponent
                                    columns={columns}
                                    rows={products}
                                    setRows={setProducts}
                                    filter={filter}
                                    setFilter={setFilter}
                                    totalRows={totalRows}
                                    setFormData={setFormData}
                                    setShowForm={setShowForm}
                                    actions
                                    showViewAction
                                    showEditAction
                                    showDeleteAction
                                    showAdjustAction
                                />
                                <Modal show={showForm === 'DELETE'} onHide={handleClose} backdrop="static" keyboard={false}        >
                                    <Modal.Header closeButton>
                                        <Modal.Title>{`Borrar artículo ${formData.sku}`}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Los datos no podrán ser recuperados.
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Cancelar
                                        </Button>
                                        <Button variant="danger" onClick={deleteProduct}>Confirmar</Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                    }
                </Layout> :
                <LoginPage />
            }
        </>
    )
}