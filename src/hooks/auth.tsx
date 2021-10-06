import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import { CDN_IMAGE, CLIENT_ID, REDIRECT_URI, RESPONSE_TYPE, SCOPE } from '../configs';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECTION_USER } from '../configs/storage';

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
    signOut: () => Promise<void>;
    loading: boolean;
}

type AuthProviderProps = {
    children: ReactNode;
}

type AuthorizationResponse = AuthSession.AuthSessionResult & {
    params: {
        access_token?: string;
        error?: string;
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

            if (type === 'success' && !params.error) {
                setToken(params.access_token || '');

                const userInfo = await api.get<User>('/users/@me');
                const firstName = userInfo.data.username.split(' ')[0];
                userInfo.data.avatar = `${CDN_IMAGE}/avatars/${userInfo.data.id}/${userInfo.data.avatar}.png`;

                const userData = {
                    ...userInfo.data,
                    firstName,
                    token: params.access_token || ''
                };

                await AsyncStorage.setItem(COLLECTION_USER, JSON.stringify(userData));
                setUser(userData);
            }
        } catch (error) {
            throw new Error('Não foi possível autenticar.');
        } finally {
            setLoading(false);
        }
    }

    async function signOut() {
        setUser({} as User);
        await AsyncStorage.removeItem(COLLECTION_USER);
    }

    function setToken(token: string) {
        if (api.defaults.headers) {
            api.defaults.headers.authorization = `Bearer ${token}`;
        } else {
            api.defaults.headers = {
                authorization: `Bearer ${token}`
            };
        }
    }

    async function loadUserStorageData() {
        const storage = await AsyncStorage.getItem(COLLECTION_USER);

        if (storage) {
            const userLogged = JSON.parse(storage) as User;
            setToken(userLogged.token);

            setUser(userLogged);
        }
    }

    useEffect(() => {
        loadUserStorageData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading }} >
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