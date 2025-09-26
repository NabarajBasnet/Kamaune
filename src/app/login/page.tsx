import LoginComponent from "@/components/Login/login";
import React from "react";

export async function generateMetadata() {
    return ({
        title: "Login - Kamaune | Affiliate Dashboard",
        description: "Login to your account",
    })
};

export default function LoginPage() {
    return (
        <main>
            <LoginComponent />
        </main>
    );
}