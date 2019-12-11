import axios, { AxiosPromise, AxiosRequestConfig} from 'axios';

class Tool {
    constructor(){

    }

    /**
     * ajax 请求接口
     * @param options
     * @return {Promise<any>}
     */
    request(options: AxiosRequestConfig): AxiosPromise {
        return new Promise((resolve, reject) => {
            axios(options).then((response) => {
                resolve(response);
            }).catch(err => {
                reject({ type: 'ajax请求', msg: err });
            });
        });
    }
}