import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const Disconnected: React.FC = () => (
  <Result
    style={{ marginTop: 150 }}
    status="500"
    title="500"
    subTitle="Sorry, there is a problem with the network connection"
    extra={
      <Link to='/home'>
        <Button type="primary">back home</Button>
      </Link>
    }
  />
);

export default Disconnected;
