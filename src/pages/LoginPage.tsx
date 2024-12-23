import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";

import { UserForm } from "../components/entities/UserForm";

export function LoginPage() {

    const { setShowForm, userFormData } = useUsers();
    const { login } = useAuth();

    return (
        <div className="d-flex flex-column vh-100 justify-content-center container align-items-center">
            <h2>Inicie sesión para usar el sistema</h2>
            <UserForm
                userFormData={userFormData}
                setShowForm={setShowForm}
                handleSubmit={e => login(
                    e,
                    {
                        username: userFormData.formData.username,
                        password: userFormData.formData.password
                    },
                    userFormData.validate,
                    userFormData.reset
                )}
                forAuth
            />
        </div>
    )
}