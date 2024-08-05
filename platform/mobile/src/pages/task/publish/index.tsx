import { Image, Input, Form, Space, Button, Toast, Picker } from "antd-mobile";
import { RightOutline } from 'antd-mobile-icons';
import { add } from '../../../api/task';
import { useState } from "react";
import './index.less';
import { useNavigate } from "react-router-dom";

const timeEnum = [
  { value: '1', label: '30 minutes' },
  { value: '2', label: '60 minutes' },
  { value: '3', label: '120 minutes' },
]
const Publish = () => {
  const [form] = Form.useForm();
  const [typeVisible, setTypeVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const nav = useNavigate();

  const [time, setTime] = useState<any>('');
  const [type, setType] = useState<any>('');
  const [width, setWidth] = useState<any>('');
  const [heigth, setHeight] = useState<any>('');
  const [length, setLength] = useState<any>('');
  const [weight, setWeight] = useState<any>('');
  const [cost, setCost] = useState<any>('');


  const [fromLo, setFromLo] = useState<any>();
  const [toLo, setToLo] = useState<any>();

  const onFinish = (values: object | undefined) => {
    add({ ...values, time, type, width, heigth, length, weight, cost, fromLo, toLo, status: 'Pending' }).then(({ success }) => {
      if (success) {
        nav(-1);
        Toast.show({
          icon: 'success',
          content: 'success',
        })
      }
    });
  };

  return <div style={{ padding: '15px' }}>
    <Form layout='horizontal' mode='card' form={form}>
      <Form.Item label='From where?' >
        <Input value={fromLo} onChange={(val) => {
          setFromLo(val);
        }} />
      </Form.Item>
      <Form.Item label='Where to send it?'>
        <Input value={toLo} onChange={(val) => {
          setToLo(val);
        }} />
      </Form.Item>
    </Form>
    <Form
      layout='horizontal'
      mode='card'
      className="taskPublishForm"
      onFinish={onFinish}
      footer={<Button
        block
        type="submit"
        color="primary"
        style={{ borderRadius: "20" }}
      >
        confirm
      </Button>}>
      <Form.Item
        label={<Space align="center">
          <Image width={18} src="/assets/box.jpg" />
          <span>Type of item</span>
        </Space>}
        extra={<RightOutline
          onClick={() => {
            setTypeVisible(true);
          }} />}
      >
        {type}
      </Form.Item>
      <Form.Item className="size-form-item" label={<Space align="center">
        <Image width={18} src="/assets/rule.jpg" />
        <span></span>
      </Space>}>
        <Space className="split3-flex" direction="horizontal">
          <div className="split3-flex-item">
            <Input type="number" value={length} onChange={(val) => {
              setLength(val);
            }} style={{ width: '100%' }} placeholder="length" />
            <span style={{ width: '20px', color: '#666' }}>cm</span>
          </div>
          <div className="split3-flex-item">
            <Input type="number" value={width} onChange={(val) => {
              setWidth(val);
            }} style={{ width: '100%' }} placeholder="width" />
            <span style={{ width: '20px', color: '#666' }}>cm</span>
          </div>
          <div className="split3-flex-item">
            <Input type="number" value={heigth} onChange={(val) => {
              setHeight(val);
            }} style={{ width: '100%' }} placeholder="height" />
            <span style={{ width: '20px', color: '#666' }}>cm</span>
          </div>
        </Space>
      </Form.Item>
      <Form.Item
        label={<Space align="center">
          <Image width={18} src="/assets/weight.jpg" />
          <span>Weight</span>
        </Space>}
        extra={<div style={{ color: '#666' }}>kg</div>}
        name='weight'>
        <Input type="number" value={weight} onChange={(val) => {
          setWeight(val);
        }} />
      </Form.Item>
      <Form.Item
        label={<Space align="center">
          <Image width={18} src="/assets/time.jpg" />
          <span>Pickiup Time</span>
        </Space>}
        extra={<RightOutline
          onClick={() => {
            setTimeVisible(true);
          }} />}
      >
        {timeEnum.find(item => String(item.value) === String(time))?.label}
      </Form.Item>
      <Form.Item
        label={<Space align="center">
          <Image width={18} src="/assets/cost.jpg" />
          <span>cost</span>
        </Space>}
        extra={<div>EUR</div>}
        name='cost'>
        <Input type="number" value={cost} onChange={(val) => {
          setCost(val);
        }} />
      </Form.Item>
    </Form>
    <Picker
      columns={[[
        { label: 'Clothing', value: 'Clothing' },
        { label: 'Food', value: 'Food' },
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Documents', value: 'Documents' },
        { label: 'Others', value: 'Others' },
      ]]}
      visible={typeVisible}
      onClose={() => {
        setTypeVisible(false)
      }}
      // value={value}
      onConfirm={val => {
        setType(val?.[0] || '');
      }}
    />
    <Picker
      columns={[timeEnum]}
      visible={timeVisible}
      onClose={() => {
        setTimeVisible(false)
      }}
      // value={value}
      onConfirm={val => {
        console.log(val?.[0], '==', timeEnum.find(item => String(item.value) === String(val?.[0]))?.label)
        setTime(val?.[0] || '');
      }}
    />
  </div>;
};

export default Publish;
