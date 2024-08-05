import { Button, Flex, message, Table, Image } from "antd";
import { useEffect, useState } from "react";
import { list, consent, reject } from '@/api/user';

const PendingAudit = () => {
  const [dataSource, setDataSource] = useState();
  const [selectedKeys, setSelectedKey] = useState<React.Key[]>([]);

  useEffect(() => {
    fetch();
  }, [])

  const fetch = (params = {}) => {
    console.log('params:', params);
    list({ ...params, status: 0 }).then(({ success, data }: any) => {
      if (success) {
        setDataSource(data.rows);
      }
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedKey(newSelectedRowKeys);
  };

  const handleConsent = () => {
    if (!selectedKeys.length) {
      message.info('please select')
      return
    }
    consent(selectedKeys).then(({ success, data }) => {
      if (success) {
        fetch();
        setSelectedKey([])
      }
    })
  }

  const handleReject = () => {
    if (!selectedKeys.length) {
      message.info('please select')
      return
    }
    reject(selectedKeys).then(({ success, data }) => {
      if (success) {
        fetch();
        setSelectedKey([])
      }
    })
  }

  return <div>
    <Flex gap={12}>
      <Button type="primary" onClick={handleConsent}>consent</Button>
      <Button danger type="primary" onClick={handleReject}>not approve</Button>
    </Flex>
    <Table
      scroll={{ x: 800, y: 550 }}
      rowKey={'_id'}
      columns={[
        { title: 'ID', dataIndex: 'id_number' },
        { title: 'first name', dataIndex: 'firstName' },
        { title: 'last name', dataIndex: 'lastName' },
        { title: 'email', dataIndex: 'email' },
        { title: 'phone number', dataIndex: 'phone' },
        { title: 'registration date', dataIndex: 'create_at' },
        {
          title: 'document', dataIndex: 'documents', render: (val) => {
            return <Flex gap={10}>
              {val?.map(item => <Image src={item.url} width={40} height={40} />)}
            </Flex>
          }
        }
      ]} dataSource={dataSource}
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: onSelectChange,
      }}
    />
  </div>;
};
export default PendingAudit;

