import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { Space, theme } from 'antd';
import { loginApi } from '@/api/auth/login';
import { useNavigate } from 'react-router';
import { globalStore } from '@/store/global';

const Login = () => {
  const { token } = theme.useToken();
  const nav = useNavigate();
  const setUser = globalStore.use.setUser();

  const onFinish = async (values) => {

    loginApi({ ...values, loginType: 'admin' }).then(({ data, success }: any) => {
      if (success) {
        localStorage.setItem('token', data?.token);
        localStorage.setItem('userInfo', JSON.stringify(data?.user));
        setUser(data?.user);
        nav('/errands/user');
      }
    });
  }
  return (
    <ProConfigProvider hashed={false}>
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        background: `url(login-bg.jpg) center center /cover no-repeat`,
      }}>
        <div style={{
          backgroundColor: 'white',
          marginTop: '15%',
          width: '400px',
          paddingTop: '30px',
          height: '314px',
          borderRadius: '8px',
          boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.1), 0px 17px 36px rgba(23, 57, 222, 0.25)'
        }}>
          <LoginForm
            title={
              <Space style={{ color: '#306EEF', fontSize: '18px', marginBottom: '34px' }}><span>Run Errands</span><span>Admin Dashboard </span></Space>
            } subTitle='' onFinish={onFinish}
            submitter={{
              searchConfig: {
                submitText: 'login',
              },
            }}
          >
            <ProFormText
              name='username'
              placeholder={''}
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              rules={[
                {
                  required: true,
                  message: 'please input'
                },
              ]}
            />
            <ProFormText.Password
              name='password'
              allowClear
              placeholder={''}
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              rules={[
                {
                  required: true,
                  message: 'please input'
                },
              ]}
            />
          </LoginForm>
        </div>

      </div>
    </ProConfigProvider>
  );
};

export default Login;

