import { NavBar, Space, Image, Popup, Button } from "antd-mobile";
import { LocationOutline, FileOutline } from "antd-mobile-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListItem from "./list";
import { logoutApi } from "../../api/auth";

const styles = {
  marginTop: '15px',
  width: '300px',
  padding: '8px 15px',
  height: '80px',
  borderRadius: '6px',
  color: 'white',
  fontSize: '18px',
}

const itemStyles = {
  color: '#565656',
  fontSize: '14px',
  borderBottom: '1px solid #565656',
  height: '38px',
  lineHeight: '38px',
  paddingLeft: '4px'
}

const Home = () => {
  const nav = useNavigate();
  const [visible, setVisible] = useState(false);
  const userString = localStorage.getItem('userInfo');
  const user = userString ? JSON.parse(userString) : null;

  const logout = async () => {
    await logoutApi();
    localStorage.clear();
    nav('/login');
  }

  return (
    <Space
      block
      direction="vertical"
      style={{ width: "100%", background: "#F5F6F8", height: "100%" }}
    >
      <NavBar
        backIcon={false}
        style={{ backgroundColor: "white", color: "#333" }}
        right={<div style={{ float: 'right' }} onClick={() => {
          setVisible(true);
        }}>
          <Image src='/assets/home.jpg' width={18} />
        </div>}
      ></NavBar>
      <Space style={{ width: '100%', flex: 1 }} direction="vertical" align="center" >
        <Space
          align="center"
          onClick={() => {
            nav('/task/publish');
          }}
          style={{ ...styles, background: '#2359C9' }}>
          <LocationOutline />
          <span>Publish as task</span>
        </Space>
        <Space
          align="center"
          onClick={() => {
            nav('/task/list');
          }}
          style={{ ...styles, background: '#AA6925' }}>
          <FileOutline />
          <span>Task list</span>
        </Space>
      </Space>
      <ListItem />
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        position='right'
        bodyStyle={{ width: '70vw' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', height: '100vh', position: 'relative' }}>
          <Space><Image src='/assets/home.jpg' width={16} /><span>{user.firstName} {user.lastName}</span></Space>
          <Space direction="vertical" style={{ marginTop: '24px' }}>
            <div style={{ ...itemStyles }} onClick={() => { nav('/task/history'); }}>Task history</div>
            <div style={{ ...itemStyles }} onClick={() => { nav('/task/income'); }}>My income</div>
          </Space>
          <Button
            onClick={() => {
              logout();
            }}
            size="small"
            style={{
              width: '90px',
              background: '#403F3F',
              color: 'white',
              position: 'absolute',
              left: '40px',
              bottom: '80px'
            }}>log out</Button>
        </div>
      </Popup>
    </Space>
  );
};

export default Home;
