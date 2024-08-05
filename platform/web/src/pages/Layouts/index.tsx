import type { ProSettings } from '@ant-design/pro-components';
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';
import defaultProps from './_props';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { globalStore } from '@/store/global';
import { LogoutOutlined } from '@ant-design/icons';
import { logoutApi } from '@/api/auth/login';
import { Avatar, Button, Flex } from 'antd';

export default () => {
  const settings: ProSettings | undefined = {
    layout: 'mix',
  };
  const user = globalStore.use.user();

  const navigate = useNavigate();
  const lo = useLocation();

  const loginOut = async () => {
    await logoutApi();
    localStorage.clear();
    navigate('/login');
  }

  return (
    <>
      <div
        id='test-pro-layout'
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          title='Errands'
          logo='/favicon.ico'
          {...defaultProps}
          location={{
            pathname: lo.pathname,
          }}
          actionsRender={(props) => {
            if (props.isMobile) return [];
            return [<Button key={'avatar'} type='text'>
              <Flex align='center' gap={4}>
                <span>{user.firstName}</span>
                <Avatar size={'small'} src={user.avatar || '/avatar.png'} />
              </Flex>
            </Button>, <LogoutOutlined key={'LogoutOutlined'} onClick={loginOut} />];
          }}
          menuItemRender={(item, dom) => (
            <div
              onClick={() => {
                navigate(item.path);
              }}
            >
              {dom}
            </div>
          )}
          {...settings}
        >
          <PageContainer header={{ title: '' }}>
            <ProCard
              title=''
              style={{
                minHeight: 800,
                overflowY: 'auto',
                height: '100vh',
              }}
            >
              <div style={{ paddingBottom: '60px' }}>
                <Outlet />
              </div>
            </ProCard>
          </PageContainer>
        </ProLayout>
      </div>
    </>
  );
};

