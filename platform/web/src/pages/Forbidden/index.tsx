import React from 'react';
import './index.less';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Forbidden: React.FC = () => {
  return (
    <div className='not-found-container'>
      <div className='bg-container'>
        <div className={'tip-404'}>
          <h2>404</h2>
          <div className='not-found-text'>Sorry, the page you are looking for does not exist</div>
        </div>
      </div>
      <div className='footer'>
        <Link to='/home'>
          <Button className={'back-to-home'} type={'primary'}>
            back home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
