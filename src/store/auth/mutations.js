import {API_URL} from "../../constants";
import {useMutation} from "@tanstack/react-query";

const userLogin = async ({email, password}) => {
    const res = await fetch(`${API_URL}/user/login?email=${email}&password=${password}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
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
