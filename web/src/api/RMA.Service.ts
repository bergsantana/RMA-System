import axios from "axios"
import { User } from "../context/auth"


export const APIConfig = {
    url: process.env.REACT_APP_RMA_API_URL
}

export interface loginDTO {
    email: string
    password: string
}

export interface Token {
    access_token: string
    token_type: string
    me: User
}

export class RmaApiService {
    static async login(data: loginDTO) {
        console.log('login no serivce', APIConfig.url)
        console.log(process.env)
        
        const req = await axios.post('/users/token', data, {
            baseURL: APIConfig.url
        })

        return req.data as Token
    }

    static async getAllRmaFromEmployee(){
        return
    }

    static async getAllRmaFromPeriod(data: { 
        "start_date": string
        "end_date": string,
        
    }, token: string) {
        return await axios.post('/rmas/find-by-period', data, {
            baseURL: APIConfig.url, headers: {
                'Authorization': 'bearer ' + token
            }
        })
    }
}