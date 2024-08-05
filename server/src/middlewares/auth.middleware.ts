import { Controller, KoaContext } from '@axiosleo/koapp';
import { _mongoCollection, _redis } from '@/services/db';
import { AuthRequestHeaderInterface } from './auth.model';
import { ObjectId } from 'mongodb';

export class AuthController extends Controller {
  async index(headers: AuthRequestHeaderInterface): Promise<any> {
    if (!headers['authorization']) {
      this.error(401, 'Unauthorized');
    }
    let tmp = headers['authorization'] || '';
    const token = (typeof tmp === 'string') ? tmp.replace('Bearer ', '') : '';
    const exist = await _redis().exists(`token:${token}`);
    if (!exist) {
      this.error(401, 'Unauthorized');
    }
    tmp = await _redis().get(`token:${token}`) || '';
    // refresh token expire time
    await _redis().expire(`token:${token}`, 3600 * 24 * 7);
    const info: any = tmp ? JSON.parse(tmp) : {};
    const user: any = await _mongoCollection('user').findOne({
      _id: new ObjectId(info._id),
    });
    if (!user) {
      this.error(401, 'Unauthorized');
    }
    Object.assign(user, { token });
    return user;
  }

}

export const authMiddleware = async (context: KoaContext) => {
  const headers = context.headers as AuthRequestHeaderInterface;
  const controller = new AuthController();
  const loginUser = await controller.index(headers);
  if (context.koa.session) {
    context.loginUser = loginUser;
  }
};
