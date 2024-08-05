import { LoginApiContext } from '@/types';
import { Router, success } from '@axiosleo/koapp';
import { _mongoCollection } from '@/services/db';
import { ObjectId } from 'mongodb';
import { getDatesInRange } from '@/utils';

const root = new Router<LoginApiContext>();


root.push('get', '/user/list', async (context: LoginApiContext) => {
  const status = context.query.status;
  const created_by = context.query.created_by;
  const con = {};
  if (status) {
    Object.assign(con, { status: { $in: status.split(',')?.map((item: any) => Number(item)) } });
  }
  if (created_by) {
    Object.assign(con, { created_by: new ObjectId(created_by) });
  }
  const userList = await _mongoCollection('user').aggregate([
    { $match: con },
    {
      $lookup: {
        from: 'task', // 关联到task集合
        localField: '_id', // user集合中用于关联的字段
        foreignField: 'created_by', // task集合中用于关联的字段
        as: 'tasks' // 添加到user文档中的字段名
      }
    }
  ]).toArray();
  success({ rows: userList });
}, {
  query: {
    rules: {
    },
  }
});

root.push('post', '/user/add', async (context: LoginApiContext) => {
  const loginUser = context.loginUser;
  const userInfo = {
    ...context.body,
    created_by: loginUser._id,
    updated_by: loginUser._id,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const user = await _mongoCollection('user').insertOne(userInfo);
  success(user);
});

root.push('post', '/user/reject', async (context: LoginApiContext) => {
  const loginUser = context.loginUser;
  const _ids = context.body._ids?.split(',')?.map((id: number) => new ObjectId(id));
  const result = await await _mongoCollection('user').updateMany(
    { _id: { $in: _ids } },
    { $set: { status: 2, approver: loginUser._id } }
  );
  success(result);
}, {
});

root.push('post', '/user/approve', async (context: LoginApiContext) => {
  const loginUser = context.loginUser;
  const _ids = context.body._ids?.split(',')?.map((id: number) => new ObjectId(id));
  const result = await await _mongoCollection('user').updateMany(
    { _id: { $in: _ids } },
    { $set: { status: 1, approver: loginUser._id } }
  );
  success(result);
}, {
});

root.push('get', '/user/statistics', async () => {
  // const loginUser = context.loginUser;
  // 设置时间范围
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  const endDate = new Date();
  const dateArr = getDatesInRange(startDate, endDate);

  // 使用聚合框架统计过去7天每天的记录数
  const pipeline = [
    { $match: { created_at: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } }
  ];
  const result = await _mongoCollection('user').aggregate(pipeline).toArray();
  success({ data: result, date: dateArr });
}, {
});

root.push('delete', '/user/{:id}', async (context: LoginApiContext) => {
  const id = parseInt(context.params.id);
  const result = await await _mongoCollection('user').deleteOne({ _id: new ObjectId(id) });
  success(result);
}, {
  params: {
    rules: {
      id: 'required|integer'
    }
  }
});


export default root;
