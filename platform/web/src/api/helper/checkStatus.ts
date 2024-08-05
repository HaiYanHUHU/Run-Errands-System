import { message } from 'antd';

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number, alertMes: string | null): void => {
  switch (status) {
    case 400:
      message.error(alertMes || 'fail！Please try again later');
      break;
    case 401:
      message.error('expire！Please log in again');
      setTimeout(() => {
        window.location.pathname = '/login';
      }, 4000);
      break;
    case 403:
      message.error('forbidden！');
      break;
    case 404:
      message.error(alertMes || 'not find！');
      break;
    case 405:
      message.error('method error！Please try again later');
      break;
    case 408:
      message.error('timeout！Please try again later');
      break;
    case 500:
      message.error('service error！');
      break;
    case 502:
      message.error('gateway error！');
      break;
    case 503:
      message.error('service unavaliable！');
      break;
    case 504:
      message.error('gateway timeout！');
      break;
    default:
      message.error('request fail！');
  }
};
