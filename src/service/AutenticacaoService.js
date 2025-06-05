import API_URL from './Config.js';

export default class AutenticacaoService {

    async login(request) {
        console.log(request);
        return await fetch(`${API_URL}/autenticacao/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: request.email,
                password: request.password
            })
        }).then(response => response.json());
    }

}
