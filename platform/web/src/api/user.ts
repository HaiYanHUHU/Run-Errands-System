import request from './index';

export async function list(
  params?: any,
) {
  return request.get(`/user/list`, params);
}

export async function add(data?: any) {
  return request.post('/user/add', data);
}

export async function update(id: any, data: any) {
  return request.put(`/user/${id}`, data);
}

export async function consent(_ids: any) {
  return request.post(`/user/approve`, { _ids: _ids.join(',') });
}

export async function reject(_ids: any) {
  return request.post(`/user/reject`, { _ids: _ids.join(',') });
}

export async function statistics() {
  return request.get(`/user/statistics`);
}

export async function del(id: any) {
  return request.delete(`/user/${id}`);
}


export async function info(id: any) {
  return request.get(`/user/info/${id}`);
}

