import axios from 'axios';
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据

axios.defaults.timeout = '';
axios.defaults.baseURL = BASE_URL;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// console.log(process.env.NODE_ENV)

/**
  * get方法，对应get请求
  * @param {String} url [请求的url地址]
  * @param {Object} params [请求时携带的参数]
  */
 export function get(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)
        })
    });
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
            params: params
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((err) => {
            reject(err);
        });
	});
}

/**
   * 封装post请求
   * @param url
   * @param data
   * @returns {Promise}
   */

export function post(url, data) {
    const reqData = JSON.stringify(data)
    return axios({
        method: 'POST',
        url,
        data: reqData,
        headers: {
            'Content-type': 'application/json;charset=utf-8'
        }
    }).then(res => {
        return Promise.resolve(res)
    }).catch(err => {
        return Promise.reject(err)
    });

    // return new Promise((resolve,reject) => {
    //     service({
    //         method:'post',
    //         url,
    //         data:param,
    //         cancelToken:new CancelToken(c=>{
    //             cancel=c
    //         })
    //     }).then(response => {
    //         resolve(response.data);
    //     }).catch(err=>{
    //         console.log(err,'异常')
    //     })
    // })
}

/**
   * 封装patch请求
   * @param url
   * @param data
   * @returns {Promise}
   */

export function patch(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(url, data).then(
			(response) => {
				resolve(response.data);
			},
			(err) => {
				reject(err);
			}
		);
	});
}

/**
   * 封装put请求
   * @param url
   * @param data
   * @returns {Promise}
   */

export function put(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.put(url, data).then(
			(response) => {
				resolve(response.data);
			},
			(err) => {
				reject(err);
			}
		);
	});
}
