import axios from 'axios';
axios.defaults.baseURL = '/api';

class APIService{
    constructor() {
    }

    comments(method, data) {
        let config = {
            method,
            url: '/comments',
        }
    }
}

let apiService = new APIService();

export default apiService