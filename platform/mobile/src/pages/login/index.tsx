import { Form, Input, Button, Space } from "antd-mobile";
import { loginApi } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { useState } from "react";
import './index.less';

const Login = () => {
  const nav = useNavigate();
  const [visible, setVisible] = useState(false)
  const onFinish = (values: object | undefined) => {
    loginApi(values).then(({ data, success }: any) => {
      if (success) {
        localStorage.setItem('auth-token', data?.token);
        localStorage.setItem('userInfo', JSON.stringify(data?.user));
        nav('/home');
      }
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        background: `url(/assets/login_bg.jpg) center center /cover no-repeat`,
      }}
    >
      <Form
        style={{ marginTop: "80px", width: "300px" }}
        onFinish={onFinish}
        footer={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              block
              type="submit"
              color="primary"
              style={{ borderRadius: "20" }}
            >
              sign in
            </Button>
            <a onClick={() => {
              nav('/register')
            }}>sign up</a>
          </Space>
        }
      >
        <Form.Header>
          <Space direction="vertical" style={{ marginBottom: "24px" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "32px",
                color: "#306EEFC1",
              }}
            >
              welcome to
            </span>
            <span style={{ fontSize: "24px", color: "#306EEFC1" }}>
              Run Errands
            </span>
          </Space>
        </Form.Header>
        <Form.Item
          name="username"
          label="Email or Phone number"
          rules={[{ required: true, message: "can not empty" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "can not empty" }]}
        >
          <div className={"password"}>
            <Input
              className={"input"}
              type={visible ? 'text' : 'password'}
            />
            <div className={"eye"}>
              {!visible ? (
                <EyeInvisibleOutline onClick={() => setVisible(true)} />
              ) : (
                <EyeOutline onClick={() => setVisible(false)} />
              )}
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
