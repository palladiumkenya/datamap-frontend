import {API_URL} from "../../constants";
import {useMutation} from "@tanstack/react-query";

const userLogin = async (user) => {
    const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    if(!res.ok){
        const error = await res.json()
        throw Error(error.detail || 'Login Failed')
    }
    return await res.json()
}

const userRegistration = async (body) => {
    const res = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    if(!res.ok){
        const error = await res.json()
        throw Error(error.detail || 'Registration Failed')
    }
    return await res.json()
}

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/user/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({ refresh_token: refreshToken })
        });
        const resp = await response.json()
        const newAccessToken = await resp.access_token;

        // Save the new access token
        localStorage.setItem('access_token', newAccessToken);

        return newAccessToken;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        // Optionally handle logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
    }
};


export const useUserLogin = () => {
    return useMutation({
        mutationFn: userLogin
    })
};

export const useUserRegistration = () => {
    return useMutation({
        mutationFn: userRegistration
    })
}

export const useRefreshAccessToken = async () => {
    return useMutation({
        mutationFn: refreshAccessToken
    })
}
