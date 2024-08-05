import { _mongoCollection, _redis } from '@/services/db';
import { Controller, KoaContext, Model } from '@axiosleo/koapp';
import { debug } from '@axiosleo/cli-tool';
import { LoginApiContext, RequestStatusCode } from '../../types';
import { userPass } from '../../services/utils';
import { generateToken } from '../../services/utils';

export class BaseController extends Controller {
  constructor() {
    super();
  }

  async fail(code: RequestStatusCode) {
    this.failed({}, code, 200);
  }

  async login(context: KoaContext) {
    const body = Model.create<any>(context.body);
    const username = body.username;
    const password = body.password;
    const loginType = body.loginType;

    const user: any = await _mongoCollection('user').findOne({
      $or: [{ email: username }, { phone: username }]
    });
    if (!user) {
      this.error(400, 'user does not exist');
    }
    if (user.status === 0) {
      this.error(400, 'user wait approved');
    }
    if (user.status === 2) {
      this.error(400, 'user not approved');
    }
    if (user.role !== 'admin' && loginType === 'admin') {
      this.error(400, 'user not has permission');
    }

    const pass = userPass(password, process.env.SALT || 'salt');
    if (user.password !== pass) {
      this.error(401, 'Unauthorized');
    }

    const token = generateToken(`${user.id}`);
    delete user.password;
    delete user.documents;
    return {
      user: user,
      token
    };
  }

  async register(context: KoaContext) {
    const body = Model.create<any>(context.body);
    const { email, phone, password, firstName, lastName, documents } = body;
    const exuser: any = await _mongoCollection('user').findOne({
      $or: [{ email: email }, { phone: phone }]
    });
    if (exuser) {
      this.error(400, 'user exist');
    }
    const pass = userPass(password, process.env.SALT || 'salt');
    const count = await _mongoCollection('user').find().count();
    const user = await _mongoCollection('user').insertOne({
      email,
      password: pass,
      phone,
      firstName,
      lastName,
      created_at: new Date(),
      updated_at: new Date(),
      status: 0,
      id_number: String(count).padStart(5, '0'),
      documents
    });
    return {
      user: user,
    };
  }

  async registerAdmin(context: KoaContext) {
    const body = Model.create<any>(context.body);
    const { email, phone, password, firstName, lastName } = body;
    const exuser: any = await _mongoCollection('user').findOne({
      $or: [{ email: email }, { phone: phone }]
    });
    if (exuser) {
      this.error(400, 'user exist');
    }

    const pass = userPass(password, process.env.SALT || 'salt');
    const count = await _mongoCollection('user').find().count();
    const user = await _mongoCollection('user').insertOne({
      email,
      password: pass,
      phone,
      firstName,
      lastName,
      created_at: new Date(),
      updated_at: new Date(),
      status: 1,
      id_number: String(count).padStart(5, '0'),
      role: 'admin'
    });
    return {
      user: user,
    };
  }


  /**
   * logout
   * @param context 
   */
  async logout(context: LoginApiContext) {
    if (context.loginUser) {
      const user = context.loginUser;
      debug.log('logout', user);
      await _redis().del(`token:${user.token}`);
    }
    this.success();
  }

}
