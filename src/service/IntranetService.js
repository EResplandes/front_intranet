import API_URL from './Config.js';

const token = localStorage.getItem('token');

export default class IntranetService {

    async informacoes() {
        return await fetch(`${API_URL}/intranet/infomacoes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => response.json());
    }

}
