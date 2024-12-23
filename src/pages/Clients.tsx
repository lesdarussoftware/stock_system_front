import { useContext, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { AuthContext } from "../contexts/AuthContext";
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { ClientForm } from "../components/entities/ClientForm";
import { AddIcon } from "../components/svg/AddIcon";
import { LoginPage } from "./LoginPage";

export function Clients() {

    const { auth } = useContext(AuthContext);

    const {
        clients,
        setClients,
        getClients,
        columns,
        showForm,
        setShowForm,
        clientFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose,
        deleteClient
    } = useClients();
    const { formData, setFormData } = clientFormData;

    useEffect(() => {
        const { page, offset, name } = filter;
        getClients(`?page=${page}&offset=${offset}&name=${name}`);
    }, [filter]);

    return (
        <>
            {auth ?
                <Layout>
                    {showForm === 'NEW' || showForm === 'EDIT' ?
                        <>
                            <h2>{showForm === 'NEW' ? 'Nuevo cliente' : `Editar cliente #${formData.id}`}</h2>
                            <ClientForm
                                clientFormData={clientFormData}
                                setShowForm={setShowForm}
                                handleSubmit={handleSubmit}
                            />
                        </> :
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex gap-2">
                                    <h2>Clientes</h2>
                                    <Form.Control
                                        placeholder="Buscar por nombre..."
                                        value={filter.name}
                                        onChange={e => setFilter({ ...filter, name: e.target.value })}
                                    />
                                </div>
                                <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                                    <AddIcon />
                                </button>
                            </div>
                            <TableComponent
                                columns={columns}
                                rows={clients}
                                setRows={setClients}
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
                                    <Modal.Title>{`Borrar cliente ${formData.name}`}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Los datos no podrán ser recuperados.
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="danger" onClick={deleteClient}>Confirmar</Button>
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