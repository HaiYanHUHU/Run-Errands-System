import request from './index';

export async function list(
  params?: any,
) {
  return request.get(`/task/list`, params);
}

export async function add(data?: any) {
  return request.post('/task/add', data);
}

export async function update(id: any, data: any) {
  return request.put(`/task/${id}`, data);
}

export async function accept(id: any) {
  return request.put(`/task/accept/${id}`);
}

export async function complete(id: any) {
  return request.put(`/task/complete/${id}`);
}

export async function del(id: any) {
  return request.delete(`/task/${id}`);
}


export async function info(id: any) {
  return request.get(`/task/info/${id}`);
}

