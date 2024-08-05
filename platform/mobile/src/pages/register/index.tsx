import { Form, Input, Button, Space, ImageUploader, Toast, ImageUploadItem } from "antd-mobile";
import { registerApi, uploadImage } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

async function mockUpload(file: File) {
  const base = await readImgToBase64(file);
  console.log(base, "==")
  return {
    // url: URL.createObjectURL(file),
    url: base
  }
}

function blob2Base64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const base64 = reader.result?.toString() || '';
      resolve(base64);
    });
    reader.addEventListener('error', () => {
      reject(new Error('message'));
    });
    reader.readAsDataURL(blob);
  });
}

const readImgToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    try {

      // 读取信息
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // 转base64结果
        const base64Url = reader.result;
        resolve(base64Url);
      }

      reader.onerror = (err) => {
        reject(err);
      }

    } catch (error) {
      reject(error);
    }
  });
}

const Register = () => {
  const nav = useNavigate();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const onFinish = async (values: any) => {
    registerApi(values).then((res) => {
      console.log(res, "===re");
      if (res?.success) {
        nav('/login')
      }
    });
  };

  const upLoadFile = async (file: any) => {
    Toast.show({ content: 'uploading...' });
    console.log(file, '===file')
    const fileArr = file?.name?.split('.');
    const formData = new FormData();
    formData.append("file", file);
    formData.append('filename', fileArr[0]);
    formData.append('ext', fileArr[1]);
    const { success, data } = await uploadImage(formData);
    if (!success) return
    console.log(data, "data")
    // // 将File对象转换为Blob
    // const blob = new Blob([file], { type: file.type });

    // // 创建一个FileReader实例
    // const reader = new FileReader();

    // // 文件读取成功完成后的处理
    // reader.onload = async (e: any) => {
    //   // e.target.result就是文件的内容（文件流）
    //   console.log(e.target.result);
    //   // 这里可以进一步处理文件流，例如发送到服务器等
    //   const formData = new FormData();
    //   formData.append('image', e.target.result);
    //   const { success, data } = await uploadImage(formData);
    //   if (!success) return
    //   console.log(data, "data")
    // };

    // // // 读取文件内容
    // reader.readAsArrayBuffer(blob);

    // const _file = file.file || {};
    // console.log(file, "===")

    // const { success, data } = await uploadImage(formData);
    // if (!success) return
    // file.url = data.images[0] ? data.images[0].url : '';
    // file.name = _file.name;
    // file.size = _file.size;
    // files.push(file);
    // changeFiles(files, { operationType: 'add' });
    // Toast.hide();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        background: `url(/assets/login_bg.jpg) center center /cover no-repeat`,
        overflowY: 'auto'
      }}
    >
      <Form
        style={{ marginTop: "80px", width: "300px" }}
        onFinish={onFinish}
        footer={
          <Button
            block
            type="submit"
            color="primary"
            style={{ borderRadius: "20" }}
          >
            confirm
          </Button>
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
          name="firstName"
          label="First name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Set Password"
          rules={[{ required: true }]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          name="documents"
          label="Please upload your documents"
          rules={[{ required: true }]}
        >
          <ImageUploader
            accept='image/jpeg,image/jpg,image/png'
            // value={fileList}
            // onChange={setFileList}
            upload={mockUpload}
          />
        </Form.Item>

      </Form>
    </div>
  );
};
export default Register;
