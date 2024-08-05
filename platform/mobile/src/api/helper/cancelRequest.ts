import axios, { AxiosRequestConfig, Canceler } from "axios";
import { isFunction } from "../utils/is/index";
import { stringify } from "../utils/index";

// * Declare a Map to store the identification and cancellation functions for each request
let pendingMap = new Map<string, Canceler>();

// * Serialization parameter
export const getPendingUrl = (config: AxiosRequestConfig) =>
  [
    config.method,
    config.url,
    stringify(config.data),
    stringify(config.params),
  ].join("&");

export class AxiosCanceler {
  /**
   * @description: add a request
   * @param {Object} config
   */
  addPending(config: AxiosRequestConfig) {
    // * Check for cancellation of previous requests before the request starts
    this.removePending(config);
    const url = getPendingUrl(config);
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          // If the current request does not exist in pending, it is add
          pendingMap.set(url, cancel);
        }
      });
  }

  /**
   * @description: Removal Pending
   * @param {Object} config
   */
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);

    if (pendingMap.has(url)) {
      // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
      const cancel = pendingMap.get(url);
      cancel && cancel();
      pendingMap.delete(url);
    }
  }

  /**
   * @description: 清空所有pending
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel();
    });
    pendingMap.clear();
  }

  /**
   * @description: reset
   */
  reset(): void {
    pendingMap = new Map<string, Canceler>();
  }
}
