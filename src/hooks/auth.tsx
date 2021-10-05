import React, { createContext, ReactNode, useContext, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import { CDN_IMAGE, CLIENT_ID, REDIRECT_URI, RESPONSE_TYPE, SCOPE } from '../configs';
import { api } from '../services/api';

type User = {
    id: string;
    username: string;
    firstName: string;
    avatar: string;
    email: string;
    token: string;
}

type AuthContextData = {
    user: User;
    signIn: () => Promise<void>;
    loading: boolean;
}

type AuthProviderProps = {
    children: ReactNode;
}

type AuthorizationResponse = AuthSession.AuthSessionResult & {
    params: {
        access_token: string;
    }
}
export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User);
    const [loading, setLoading] = useState(false);

    async function signIn() {
        try {
            setLoading(true);

            const authUrl = `${api.defaults.baseURL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
            const { type, params } = await AuthSession
                .startAsync({ authUrl }) as AuthorizationResponse;

            if (type === 'success') {
                if (api.defaults.headers) {
                    api.defaults.headers.authorization = `Bearer ${params.access_token}`;
                } else {
                    api.defaults.headers = {
                        authorization: `Bearer ${params.access_token}`
                    };
                }


                const userInfo = await api.get('/users/@me');
                const firstName = userInfo.data.username.split(' ')[0];
                userInfo.data.avatar = `${CDN_IMAGE}/avatars/${userInfo.data.id}/${userInfo.data.avatar}.png`;
                setUser({
                    ...userInfo.data,
                    firstName,
                    token: params.access_token
                });
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            throw new Error('Não foi possível autenticar.');
        }
    }

    return (
        <AuthContext.Provider value={{ user, signIn, loading }} >
            {children}
        </ AuthContext.Provider>
    )
}

function useAuth() {
    return useContext(AuthContext);
}

export {
    AuthProvider,
    useAuth
}