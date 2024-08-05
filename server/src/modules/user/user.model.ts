import { Model } from '@axiosleo/koapp';

export interface AccountItem {
  id: number;
  uuid: string;
  created_at: Date;
  updated_at: Date;
  disabled_at: Date;
  username: string;
  name: string;
  avatar?: string;
  password: string;
  last_token?: string;
}

export interface LoginAccountItem extends AccountItem {
  roles: number[];
  org_id: number;
  org_code: string;
}

/**
 * Login request parameter
 */
export interface UserLoginReq extends Model {
  username: string;
  password: string;
}

/**
 * Login callback
 */
export interface UserLoginRes {
  uuid: string;
  name: string;
  avatar?: string;
  last_token: string;
  org_code: string;
}


