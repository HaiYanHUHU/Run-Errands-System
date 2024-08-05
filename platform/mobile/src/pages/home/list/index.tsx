import { List } from "antd-mobile";
import { useEffect, useState } from "react";
import { list as lsService } from '../../../api/task';
import TaskItem from '../../task/list/taskItem';
import './index.less';

const History = () => {
  const [listArr, setListArr] = useState([]);
  const userString = localStorage.getItem('userInfo');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    const params = {
      created_by: user._id,
      status: 'Pending,Progress'
    }
    lsService(params).then(({ success, data }: any) => {
      if (success) {
        console.log(data)
        setListArr(data?.rows || [])
      }
    }).catch((err: any) => { console.log(err) })
  }

  return <>
    {listArr.length > 0 && <List style={{ padding: '15px' }}>
      {listArr?.map((item: any) => (
        <List.Item key={item.id} style={{ padding: '0px', marginBottom: '10px' }} className="item-task-content" >
          <TaskItem data={item} reload={() => {
            fetchList();
          }} />
        </List.Item>
      ))}
    </List>}
  </>;
};

export default History;
