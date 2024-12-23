import { useContext, useEffect } from "react";

import { AuthContext } from "../contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { UserForm } from "../components/entities/UserForm";
import { AddIcon } from "../components/svg/AddIcon";
import { LoginPage } from "./LoginPage";

export function Users() {

    const { auth } = useContext(AuthContext);

    const {
        users,
        setUsers,
        getUsers,
        columns,
        showForm,
        setShowForm,
        userFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows
    } = useUsers();
    const { setFormData } = userFormData;

    useEffect(() => {
        const { page, offset } = filter;
        getUsers(page, offset);
    }, [filter]);

    return (
        <>
            {auth ?
                <Layout>
                    {showForm === 'NEW' ?
                        <>
                            <h2>Nuevo usuario</h2>
                            <UserForm
                                userFormData={userFormData}
                                setShowForm={setShowForm}
                                handleSubmit={handleSubmit}
                            />
                        </> :
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h2>Usuarios</h2>
                                <button className="btn btn-primary d-flex align-items-center btn-lg" onClick={() => setShowForm('NEW')}>
                                    <AddIcon />
                                </button>
                            </div>
                            <TableComponent
                                columns={columns}
                                rows={users}
                                setRows={setUsers}
                                filter={filter}
                                setFilter={setFilter}
                                totalRows={totalRows}
                                setFormData={setFormData}
                                setShowForm={setShowForm}
                            />
                        </>
                    }
                </Layout> :
                <LoginPage />
            }
        </>
    )
}