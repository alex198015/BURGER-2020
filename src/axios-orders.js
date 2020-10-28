import axios from 'axios'


const instance = axios.create({
    baseURL: 'https://my-burger-project-99f6a.firebaseio.com/'
});

export default instance;