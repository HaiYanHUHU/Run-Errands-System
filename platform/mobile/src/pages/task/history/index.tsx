import { List } from "antd-mobile";
import { useEffect, useState } from "react";
import { list as lsService } from '../../../api/task';
import TaskItem from '../../task/list/taskItem';
import './index.less';

const TaskList = () => {
  const [listArr, setListArr] = useState([]);
  const userString = localStorage.getItem('userInfo');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    const params = {
      status: 'Completed',
      created_by: user._id
    }
    lsService(params).then(({ success, data }: any) => {
      if (success) {
        console.log(data)
        setListArr(data?.rows || [])
      }
    }).catch((err: any) => { console.log(err) })
  }

  return <>
    {listArr.length > 0 && <List style={{ padding: '15px', height: '100vh', overflowY: 'auto' }}>
      {listArr?.map((item: any) => (
        <List.Item key={item.id} style={{ padding: '0px', marginBottom: '10px' }} className="item-task-content" >
          <TaskItem nofooter={true} data={item} reload={() => {
            fetchList();
          }} />
        </List.Item>
      ))}
    </List>}
  </>;
};

export default TaskList;
