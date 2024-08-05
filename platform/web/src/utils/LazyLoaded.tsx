import React, { Suspense } from 'react';
import { Spin } from 'antd';
import Loading from '@/components/loading';
/**
 * @description 路由懒加载
 * @param {Element} Com 需要访问的组件
 * @returns element
 */
const lazyLoad = (Com: React.LazyExoticComponent<any>): React.ReactNode => {
  return (
    <Suspense fallback={<Loading />}>
      <Com />
    </Suspense>
  );
};

export default lazyLoad;

