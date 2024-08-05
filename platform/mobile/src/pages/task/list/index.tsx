import { Space, List, Tabs, Empty } from "antd-mobile";
import { useEffect, useState } from "react";
import { list as lsService } from '../../../api/task';
import TaskItem from './taskItem';
import './index.less';

const TaskList = () => {
  const [key, setKey] = useState('Pending');
  const [listArr, setListArr] = useState([]);
  const userString = localStorage.getItem('userInfo');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    fetchList();
  }, [key]);

  const fetchList = () => {
    const params = {
      status: key,
      acceptor: '',
      completor: ''
    }
    if (key === 'Progress') {
      params.acceptor = user._id
    }
    if (key === 'Completed') {
      params.completor = user._id
    }
    lsService(params).then(({ success, data }: any) => {
      if (success) {
        console.log(data)
        setListArr(data?.rows || [])
      }
    }).catch((err: any) => { console.log(err) })
  }

  return <Space direction="vertical" style={{ width: '100%' }}>
    <Tabs onChange={(key) => {
      setKey(key);
    }}>
      <Tabs.Tab title='Pending orders' key='Pending'>
      </Tabs.Tab>
      <Tabs.Tab title='On Task' key='Progress'>
      </Tabs.Tab>
      <Tabs.Tab title='Completed' key='Completed'>
      </Tabs.Tab>
    </Tabs>
    {listArr.length > 0 && <List style={{ padding: '15px', height: '100vh', overflowY: 'auto' }}>
      {listArr?.map((item: any) => (
        <List.Item key={item.id} style={{ padding: '0px', marginBottom: '10px' }} className="item-task-content" >
          <TaskItem data={item} reload={() => {
            fetchList();
          }} />
        </List.Item>
      ))}
    </List>}
    {listArr.length < 1 && <Empty description={'no task'} />}
    {/* <InfiniteScroll loadMore={loadMore} hasMore={hasMore} /> */}
  </Space>;
};

export default TaskList;
