import { Card } from 'antd';
import ReactChart from "echarts-for-react";
import { statistics as UStatistics } from '@/api/user';
import { statistics as TStatistics } from '@/api/task';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const DataStatic = () => {
  const [userData, setUserData] = useState<any>();
  const [taskData, setTaskData] = useState<any>();

  useEffect(() => {
    UStatistics().then(({ success, data }: any) => {
      if (success) {
        const date = data?.date?.map(item => dayjs(item).format('YYYY-MM-DD'));
        const dataArr = [];
        date.map(item => {
          const obj = data.data?.find(d => d._id === item);
          dataArr.push(obj?.count || 0)
        })
        setUserData({ data: dataArr, date });
      }
    })
    TStatistics().then(({ success, data }: any) => {
      if (success) {
        const date = data?.date?.map(item => dayjs(item).format('YYYY-MM-DD'));
        const dataArr = [];
        date.map(item => {
          const obj = data.data?.find(d => d._id === item);
          dataArr.push(obj?.count || 0)
        })
        setTaskData({ data: dataArr, date });
      }
    })
  }, [])

  return <>
    <Card bodyStyle={{ padding: '10px' }} size='small' title='User growth in the last week'>
      <ReactChart style={{ height: '260px', width: '800px' }} option={{
        xAxis: {
          type: 'category',
          data: userData?.date || []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: userData?.data || [],
            type: 'bar'
          }
        ]
      }} />
    </Card>
    <Card bodyStyle={{ padding: '10px' }} size='small' title='Tasks posted by users in the last week' style={{ marginTop: '18px' }}>
      <ReactChart style={{ height: '260px', width: '800px' }} option={{
        xAxis: {
          type: 'category',
          data: taskData?.date || []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: taskData?.data || [],
            type: 'bar'
          }
        ]
      }} />
    </Card>
  </>;
};

export default DataStatic;

