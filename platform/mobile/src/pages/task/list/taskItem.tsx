import { Button, Ellipsis, Image, Tag, Toast } from "antd-mobile";
import { accept, complete } from "../../../api/task";
import './taskItem.less';
import dayjs from 'dayjs'

const colorEnum = {
  Pending: '#14171F',
  Progress: '#14171F',
  Completed: '#838383',
}

// eslint-disable-next-line react-refresh/only-export-components
export default ({ data, reload, nofooter }: {
  nofooter?: boolean,
  data: {
    _id: string,
    status: 'Pending' | 'Progress' | 'Completed',
    fromLo: any,
    toLo: any,
    type: string,
    length: string,
    width: string,
    heigth: string,
    weight: string,
    cost: string,
    created_at: string,
  },
  reload?: () => void
}) => {
  const { status, fromLo, toLo, type, length, weight, heigth, width, cost, created_at } = data;
  const onAccept = () => {
    accept(data._id).then(({ success }: any) => {
      if (success) {
        Toast.show({
          icon: 'success',
          content: 'success',
        })
        reload?.();
      }
    })
  }

  const onComplete = () => {
    complete(data._id).then(({ success }: any) => {
      if (success) {
        Toast.show({
          icon: 'success',
          content: 'success',
        })
        reload?.();
      }
    })
  }

  return <div className="task-item-com">
    {status === 'Completed' && <div style={{ textAlign: 'right', color: '#999', padding: '5px 10px', fontSize: '12px' }}>published  time: {dayjs(created_at).format('YYYY MM/DD HH:mm:ss')}</div>}
    <div className="top-item" style={{ backgroundColor: colorEnum[status], height: '48px' }} >
      <div className="flex-item"><Ellipsis direction='start' content={fromLo} /></div>
      <div className="flex-item center" >
        <span></span>
        <Image width={58} src="/assets/arrow.jpg" />
      </div>
      <div className="flex-item"><Ellipsis direction='start' content={toLo} /></div>
    </div>
    <div className="center-item">
      <Tag color='#999'>
        {type}
      </Tag>
      <Tag color='#999'>
        {width}cm*{heigth}cm*{length}*cm
      </Tag>
      <Tag color='#999'>
        {weight}kg
      </Tag>
    </div>
    {status === 'Pending' && !nofooter && <div className="footer-item">
      <span className="cost">cost: {cost}<span className="unit">EUR</span></span>
      <Button size="small" color='primary' onClick={() => {
        onAccept();
      }}>accept</Button>
    </div>}
    {status === 'Progress' && !nofooter && <div className="footer-item">
      <span className="cost">income: {cost}<span className="unit">EUR</span></span>
      <Button size="small" color='primary' onClick={() => {
        onComplete();
      }}>complete</Button>
    </div>}
    {status === 'Completed' && !nofooter && <div className="footer-item">
      <span className="cost">income: {cost}<span className="unit">EUR</span></span>
    </div>}
  </div>
}
