import { useContext } from "react";

import { AuthContext } from "../contexts/AuthContext";

import { Layout } from "../components/common/Layout";
import { LoginPage } from "./LoginPage";

export function ErrorPage() {

    const { auth } = useContext(AuthContext);

    return (
        <>
            {auth ?
                <Layout>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Error 404 - Página no encontrada.</h2>
                    </div>
                </Layout> :
                <LoginPage />
            }
        </>
    )
}