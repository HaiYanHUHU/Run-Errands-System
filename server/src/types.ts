import { KoaContext, StatusCode } from '@axiosleo/koapp';
import { AesCbcOptions } from './services/utils';

export type CompanyItemModel = {
  name: string,
  code: string,
  level_name: string,
  parent_id: number,
  meta: {
    aes_ak?: AesCbcOptions
  }
};

export type LoginApiContext = KoaContext & {
  loginUser: any;
  dbName: string;
  org_code: string;
}

export type OpenApiContext = KoaContext & {
  company: CompanyItemModel;
  dbName: string;
};

export type RequestStatusCode = StatusCode &
  'SV40401; 部门不存在' |
  'SV40402; 用户不存在';

export type BaseAttributes = {
  id: number,
  created_at: Date,
  updated_at: Date,
  disabled: number, // default is 0
}

export type ModelItem = BaseAttributes & {
  created_by: number,
  updated_by: number
}

export interface PaginationModel {
  page: number;
  size: number;
  order?: 'asc' | 'desc';
}
