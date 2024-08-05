import { LoginApiContext } from '@/types';
import { Router, success } from '@axiosleo/koapp';
import { authMiddleware } from '../middlewares/auth.middleware';
import User from './user';
import Task from './task';
import { BaseController } from '../modules/user/user.controller';

/**
 * All interfaces that need to determine the login status must be on this route
 * @example loggedIn.add(new Router());
 */
const loggedIn = new Router<LoginApiContext>('', {
  method: 'any',
  middlewares: [authMiddleware],
  afters: [async () => {
  }]
});

loggedIn.push('get', '/user', async (context: LoginApiContext) => {
  const { id, name, avatar, email, phone, user_type } = context.loginUser;
  success({
    id, name, avatar, email, phone, user_type
  });
});

loggedIn.push('post', '/logout', async (context: LoginApiContext) => {
  const controller = new BaseController();
  await controller.logout(context);
});


loggedIn.add(User);
loggedIn.add(Task);

export default loggedIn;
