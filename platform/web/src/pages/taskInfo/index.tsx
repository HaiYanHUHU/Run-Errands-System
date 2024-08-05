import { Table } from 'antd';
import { list } from '@/api/task';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
const TaskInfo = () => {
  const [dataSource, setDataSource] = useState();

  useEffect(() => {
    fetch();
  }, [])

  const fetch = (params = {}) => {
    console.log('params:', params);
    list({ ...params }).then(({ success, data }: any) => {
      if (success) {
        setDataSource(data.rows);
      }
    });
  };
  return <Table
    scroll={{ x: 800, y: 550 }}
    columns={[
      {
        title: 'publishTime', dataIndex: 'created_at', render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
        sorter: (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        defaultSortOrder: 'ascend'
      },
      {
        title: 'endTime', dataIndex: 'complete_at', render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
        sorter: (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        defaultSortOrder: 'ascend'
      },
      { title: 'user ID', dataIndex: 'user', render: (text) => text?.[0]?.id_number },
      { title: 'type', dataIndex: 'type' },
      {
        title: 'size', dataIndex: 'size', render: (_, { heigth, width, length }) => {
          return `${width}cm*${heigth}cm*${length}*cm`
        }
      },
      { title: 'weight', dataIndex: 'weight' },
      {
        title: 'from', dataIndex: 'fromLo',
        ellipsis: true,
      },
      {
        title: 'to', dataIndex: 'toLo',
        ellipsis: true,
      },
      { title: 'cost(EUR)', dataIndex: 'cost' }
    ]} dataSource={dataSource} />;
};

export default TaskInfo;

