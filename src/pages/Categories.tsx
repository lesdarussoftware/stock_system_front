import { useContext, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { AuthContext } from "../contexts/AuthContext";
import { useCategories } from "../hooks/useCategories";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { CategoryForm } from "../components/entities/CategoryForm";
import { AddIcon } from "../components/svg/AddIcon";
import { LoginPage } from "./LoginPage";

export function Categories() {

    const { auth } = useContext(AuthContext);

    const {
        categories,
        setCategories,
        getCategories,
        columns,
        showForm,
        setShowForm,
        categoryFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteCategory
    } = useCategories();
    const { formData, setFormData } = categoryFormData;

    useEffect(() => {
        const { page, offset } = filter;
        getCategories(page, offset);
    }, [filter]);

    return (
        <>
            {auth ?
                <Layout>
                    {showForm === 'NEW' || showForm === 'EDIT' ?
                        <>
                            <h2>{showForm === 'NEW' ? 'Nueva categoría' : `Editar categoría #${formData.id}`}</h2>
                            <CategoryForm
                                categoryFormData={categoryFormData}
                                setShowForm={setShowForm}
                                handleSubmit={handleSubmit}
                            />
                        </> :
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h2>Categorías</h2>
                                <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                                    <AddIcon />
                                </button>
                            </div>
                            <TableComponent
                                columns={columns}
                                rows={categories}
                                setRows={setCategories}
                                filter={filter}
                                setFilter={setFilter}
                                totalRows={totalRows}
                                setFormData={setFormData}
                                setShowForm={setShowForm}
                                actions
                                showEditAction
                                showDeleteAction
                            />
                            <Modal show={showForm === 'DELETE'} onHide={handleClose} backdrop="static" keyboard={false}        >
                                <Modal.Header closeButton>
                                    <Modal.Title>{`Borrar categoría ${formData.name}`}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Los datos no podrán ser recuperados.
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="danger" onClick={deleteCategory}>Confirmar</Button>
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