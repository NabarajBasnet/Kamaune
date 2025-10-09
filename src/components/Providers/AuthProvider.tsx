"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/states/store/authSlice";
import { getTokensFromCookies } from "@/services/auth/auth.service";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    const { data, isLoading, error } = useQuery({
        queryKey: ["userdata"],
        queryFn: getTokensFromCookies,
    });

    useEffect(() => {
        if (data) {
            dispatch(
                setCredentials({
                    email: data?.data?.email || "unknown@user.com",
                    access: data?.data?.accessToken,
                    refresh: data?.data?.refreshToken,
                })
            );
        }
    }, [data, dispatch]);

    return (
        <AuthContext.Provider value={{ isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => useContext(AuthContext);
export default AuthProvider;
