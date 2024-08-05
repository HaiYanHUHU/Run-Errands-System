import { LoginApiContext } from '@/types';
import { Router, success } from '@axiosleo/koapp';
import { _mongoCollection } from '@/services/db';
import { ObjectId } from 'mongodb';
import { getDatesInRange } from '@/utils';

const root = new Router<LoginApiContext>();

root.push('get', '/task/list', async (context: LoginApiContext) => {
  const status = context.query.status;
  const acceptor = context.query.acceptor;
  const completor = context.query.completor;
  const created_by = context.query.created_by;
  const con = {};
  if (status) {
    Object.assign(con, { status: { $in: status.split(',') } });
  }
  if (acceptor) {
    Object.assign(con, { acceptor: new ObjectId(acceptor) });
  }
  if (completor) {
    Object.assign(con, { completor: new ObjectId(completor) });
  }
  if (created_by) {
    Object.assign(con, { created_by: new ObjectId(created_by) });
  }
  const taskList = await _mongoCollection('task').aggregate([
    { $match: con },
    {
      $lookup: {
        from: 'user',
        localField: 'created_by',
        foreignField: '_id',
        as: 'user'
      }
    }
  ]).toArray();
  success({ rows: taskList });
}, {
  query: {
    rules: {
    },
  }
});

root.push('post', '/task/add', async (context: LoginApiContext) => {
  const loginUser = context.loginUser;
  const taskInfo = {
    ...context.body,
    created_by: loginUser._id,
    updated_by: loginUser._id,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const task = await _mongoCollection('task').insertOne(taskInfo);
  success(task);
});

root.push('put', '/task/accept/{:id}', async (context: LoginApiContext) => {
  const loginUser = context.loginUser;
  const result = await await _mongoCollection('task').updateOne({
    _id: new ObjectId(context.params.id)
  }, {
    $set: {
      status: 'Progress',
      acceptor: loginUser._id,
    }
  });
  success(result);
}, {
});

root.push('put', '/task/complete/{:id}', async (context: LoginApiContext) => {
  const loginUser = context.loginUser;
  const result = await await _mongoCollection('task').updateOne({
    _id: new ObjectId(context.params.id)
  }, {
    $set: {
      status: 'Completed',
      completor: loginUser._id,
      complete_at: new Date(),
    }
  });
  success(result);
}, {
});

root.push('get', '/task/statistics', async () => {
  // const loginUser = context.loginUser;
  // Set time range
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  const endDate = new Date();
  const dateArr = getDatesInRange(startDate, endDate);
  // Number of records per day in the last 7 days
  const pipeline = [
    { $match: { created_at: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } }
  ];
  const result = await _mongoCollection('task').aggregate(pipeline).toArray();
  success({ data: result, date: dateArr });
}, {
});

root.push('delete', '/task/{:id}', async (context: LoginApiContext) => {
  const id = parseInt(context.params.id);
  const result = await await _mongoCollection('task').deleteOne({ _id: new ObjectId(id) });
  success(result);
}, {
  params: {
    rules: {
      id: 'required|integer'
    }
  }
});


export default root;
