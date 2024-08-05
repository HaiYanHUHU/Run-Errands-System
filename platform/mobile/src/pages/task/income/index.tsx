import { List, Space } from "antd-mobile";
import { useEffect, useState } from "react";
import { list as lsService } from '../../../api/task';
import './index.less';
import dayjs from "dayjs";

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
      completor: user._id
    }
    lsService(params).then(({ success, data }: any) => {
      if (success) {
        console.log(data)
        setListArr(data?.rows || [])
      }
    }).catch((err: any) => { console.log(err) })
  }

  return <>
    {listArr.length > 0 && <List style={{ padding: '15px', height: '100vh', overflowY: 'auto' }} className="item-income-list">
      {listArr?.map((item: any) => (
        <List.Item key={item.id} style={{ padding: '0px', marginBottom: '10px' }} className="item-income-content" >
          <Space direction="horizontal" justify="between" style={{ width: '100%', color: '#565656' }}>
            <div style={{}}>{dayjs(item.created_at).format('YYYY MM/DD HH:mm:ss')}</div>
            <div >{item.cost} EUR</div>
          </Space>
        </List.Item>
      ))}
    </List>}
  </>;
};

export default TaskList;
