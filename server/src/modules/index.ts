import { KoaContext, Router, error, success } from '@axiosleo/koapp';
import { BaseController } from '../modules/user/user.controller';
import { _redis } from '@/services/db';
import loggedIn from './login.router';
// import { _write } from '@/utils';
// import path from 'path';
// import fs from 'fs';

const root = new Router('/api', {
  handlers: [
    async () => {
      error(404, 'Not Found');
    },
  ],
});
/**
 * Login interface
 */
root.push('post', '/login',
  async (context: KoaContext) => {
    const controller = new BaseController();
    const { user, token } = await controller.login(context);
    await _redis().set(`token:${token}`, JSON.stringify(user), 'EX', 3600 * 24 * 7); // 7 days
    if (context.koa.session) {
      context.koa.session.user = user;
    }
    success({ token: token, user });
  },
  {
    body: {
      rules: {
        username: 'required|string',
        password: 'required|string',
      },
    },
  }
);

root.push('post', '/register',
  async (context: KoaContext) => {
    const controller = new BaseController();
    const { user } = await controller.register(context);
    success({ user });
  },
  {
    body: {
      rules: {
        firstName: 'required|string',
        lastName: 'required|string',
        email: 'required|string',
        password: 'required|string',
        phone: 'required|string',
      },
    },
  }
);

root.push('post', '/registerAdmin',
  async (context: KoaContext) => {
    const controller = new BaseController();
    const { user } = await controller.registerAdmin(context);
    success({ user });
  },
  {
    body: {
      rules: {
        firstName: 'required|string',
        lastName: 'required|string',
        email: 'required|string',
        password: 'required|string',
        phone: 'required|string',
      },
    },
  }
);

root.any('/***', async () => {
  error(404, 'Not Found');
});

// root.add(upload);
root.add(loggedIn);

export default [root];
