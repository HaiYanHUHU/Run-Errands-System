import NProgress from '@/config/nprogress';
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/config/serviceLoading';
import { ResultData } from '@/api/interface';
import { checkStatus } from './helper/checkStatus';
import { AxiosCanceler } from './helper/cancelRequest';
import { message } from 'antd';
import { stringify } from '@/utils';

const axiosCanceler = new AxiosCanceler();
const config = {
  // TODO 默认地址请求地址，可在 .env 开头文件中修改
  baseURL: '/api',
  // 设置超时时间（60s）
  timeout: 60000,
  // 跨域时候允许携带凭证
  withCredentials: true,
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到zustand/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        NProgress.start();
        // * 将当前请求添加到 pending 中
        config.headers!.Progress && axiosCanceler.addPending(config);
        config.headers!.fullLoading && showFullScreenLoading();
        let token = localStorage.getItem('token') || '';
        console.log(token, "===token")
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: token,
          },
        };
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response;
        NProgress.done();
        // * 在请求结束后，移除本次请求(关闭loading)
        axiosCanceler.removePending(config);
        tryHideFullScreenLoading();
        // * 全局错误信息拦截
        if (data.code !== '200' && !(config as any).handleError) {
          message.error(data.message);
          return data;
        }
        data.success = true;
        // * 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        const data: unknown = response?.data;
        NProgress.done();
        tryHideFullScreenLoading();
        // 请求超时单独判断，请求超时没有 response
        if (error.message.indexOf('timeout') !== -1) message.error('request timed out. Please try again later');
        // 根据响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status, (data as any)?.message);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
        // if (!window.navigator.onLine) window.location.pathname = '/500';
        // return Promise.reject(error);
        return response?.data;
      },
    );
  }

  // * 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(`${url}?${stringify(params as any)}`, { ..._object });
  }
  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object });
  }
}

export default new RequestHttp(config);
