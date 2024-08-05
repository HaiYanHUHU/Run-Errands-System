// * Request response parameters (excluding data)
export interface Result {
  timestamp?: number;
  code: string;
  message?: string;
  success?: boolean;
  request_id?: string;
}

// * Request response parameters (including data)
export interface ResultData<T> extends Result {
  data?: T;
}
