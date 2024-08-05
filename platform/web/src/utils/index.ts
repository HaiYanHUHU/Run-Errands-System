import { message } from 'antd';
import { isFloat, isNumber } from './is';
import { MenuItem } from '@/platform/interface';
/**
 * @description 转换url参数为对象
 * @param {params} params 需要解析的字符串
 * @return string
 */
interface QueryParams {
  [key: string]:
  | string
  | number
  | boolean
  | null
  | undefined
  | QueryParams
  | Array<string | number | boolean | null | undefined | QueryParams>;
}
export function stringify(params: QueryParams | undefined): string {
  const urlSearchParams = new URLSearchParams();

  const flattenParams = (obj: QueryParams | undefined, prefix = '') => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (value !== undefined && value !== null) {
          const newKey = prefix ? `${prefix}.${key}` : key;

          if (Array.isArray(value)) {
            for (const element of value) {
              urlSearchParams.append(newKey, String(element));
            }
          } else if (typeof value === 'object') {
            flattenParams(value, newKey);
          } else {
            urlSearchParams.append(newKey, String(value));
          }
        }
      }
    }
  };

  flattenParams(params);

  return urlSearchParams.toString();
}

/**
 * @description 树结构获取menu
 * @param {React.ReactNode} label
 * @param {React.Key} key
 * @param {React.ReactNode} icon
 * @param {MenuItem[]} children
 * @param {string} type
 * @return MenuItem
 */

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

/**
 * @description 类型守卫
 * @param {T} enumObj
 * @param {any} value
 * @param {string} emptyValue
 * @return emptyValue | enumObj[keyof enumObj]
 */
export function getEnumValueOrDefault<T extends object, R>(
  enumObj: T,
  value: any,
  emptyValue: R,
): R | T[keyof T] {
  if (Object.keys(enumObj).includes(value)) {
    // 通过类型断言确保类型安全，这里假设枚举的值类型和emptyValue类型是相同的
    return enumObj[value as keyof T] as R | T[keyof T];
  } else {
    return emptyValue;
  }
}

/**
 * @description 特殊字符校验
 * @param {_} any
 * @param {string} value
 * @return Promise<void>
 */

// 正则表达式用于匹配特殊字符
const specialCharacterRegex = /[^\w\u4e00-\u9fa5]/gi;
// 自定义验证规则
export const validateSpecialCharacters = (_: any, value: any) => {
  if (specialCharacterRegex.test(value)) {
    return Promise.reject(new Error('输入内容不能包含特殊字符'));
  }
  return Promise.resolve();
};

/**
 * @description 拷贝到剪贴板
 * @param {string} text
 * @return Promise<void>
 */
export function copyTextToClipboard(text: string, messageAlert?: string) {
  if (navigator.clipboard) {
    // navigator.clipboard API 是现代浏览器中推荐的方法
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success(messageAlert || '文本已成功复制到剪贴板');
      })
      .catch((err) => {
        message.error(`无法复制文本: ${err}`);
      });
  } else {
    // 降级处理: 使用旧的 document.execCommand 方法
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? '成功' : '失败';
      message.info(`复制文本 ${msg}`);
    } catch (err) {
      message.error(`无法复制文本: ${err}`);
    }
    document.body.removeChild(textArea);
  }
}

/**
 * @description 转为2位小数或转为0
 * @param {unknown} val
 * @param {number} length
 * @return number 0
 */
export function formatFloat(val: unknown, length: number = 2) {
  if (isNumber(val)) {
    if (isFloat(val)) {
      return val.toFixed(length);
    } else {
      return val;
    }
  } else {
    return 0;
  }
}
