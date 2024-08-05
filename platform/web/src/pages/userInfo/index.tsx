import { Table } from 'antd';
import { list } from '@/api/user';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const UserInfo = () => {
  const [dataSource, setDataSource] = useState();

  useEffect(() => {
    fetch();
  }, [])

  const fetch = (params = {}) => {
    console.log('params:', params);
    list({ ...params, status: 1 }).then(({ success, data }: any) => {
      if (success) {
        setDataSource(data.rows);
      }
    });
  };
  return <Table
    scroll={{ x: 800, y: 550 }}
    columns={[
      { title: 'ID', dataIndex: 'id_number' },
      { title: 'first name', dataIndex: 'firstName' },
      { title: 'last name', dataIndex: 'lastName' },
      { title: 'email', dataIndex: 'email' },
      { title: 'phone number', dataIndex: 'phone' },
      { title: 'registration date', dataIndex: 'created_at', render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
      { title: 'number of tasks', dataIndex: 'tasks', render: (text) => text?.length }
    ]} dataSource={dataSource} />;
};

export default UserInfo;

