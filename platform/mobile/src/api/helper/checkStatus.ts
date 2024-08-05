import { Toast } from "antd-mobile";

/**
 * @description: Verify the network request status code
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number, alertMes: string | null): void => {
  switch (status) {
    case 400:
      Toast.show({
        icon: "fail",
        content: alertMes || "Request failed! Please try again later",
      });
      break;
    case 401:
      Toast.show({
        icon: "fail",
        content: alertMes || "Request failed! Please try again later",
      });
      setTimeout(() => {
        window.location.pathname = "/login";
      }, 4000);
      break;
    case 403:
      Toast.show({
        icon: "fail",
        content: "The current account has no access permission！",
      });
      break;
    case 404:
      Toast.show({
        icon: "fail",
        content: alertMes || "The resource you are looking for does not exist！",
      });
      break;
    case 405:
      Toast.show({
        icon: "fail",
        content: "Incorrect request mode! Please try again later",
      });
      break;
    case 408:
      Toast.show({
        icon: "fail",
        content: "Request timed out! Please try again later",
      });
      break;
    case 500:
      Toast.show({
        icon: "fail",
        content: "exception service routine！",
      });
      break;
    case 502:
      Toast.show({
        icon: "fail",
        content: "Internal Error！",
      });
      break;
    case 503:
      Toast.show({
        icon: "fail",
        content: "Service unavailable！",
      });
      break;
    case 504:
      Toast.show({
        icon: "fail",
        content: "Internal time out！",
      });
      break;
    default:
      Toast.show({
        icon: "fail",
        content: "request failed！",
      });
  }
};
