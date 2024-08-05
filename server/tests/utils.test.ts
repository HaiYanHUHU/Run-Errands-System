import { RSAEncrypt, _aes_cbc } from '../src/services/utils';
import { expect } from 'chai';

const privateKey = '-----BEGIN PRIVATE KEY-----\n' +
  'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCGDljdYvgMR7Ll\n' +
  '8X8k0EdUzWsCzUM/Dtiz8PtvuXw6KF/yabknt0OH0gY1BojHs6DGB+9XpYyDc925\n' +
  'OfOCZQ3ShnKWN/Ui4kCXqwTyaiexVmqHgcAao4DMMhT2tlVDt7G44Kr8xwIUVCB9\n' +
  'HMy75OT+rd9FiCrWP5Ez/+2kyHyE4N87IYqj/rSuCQGXxOKylvCDKdNiwLaJZTgC\n' +
  'nctrx5lUsvLdg4R3WWpoOFSrm+qPYLB3B+MFQDO0/DWVvw99Jf+8JGxDo1TNSufE\n' +
  'hZ2+4L6R51mBkffXJtaLOAhicEvamAnoaDrGfEqzfzi/3C9Ew6eeFIBPDkGIOPCl\n' +
  'c7WyEpVpAgMBAAECggEAXajQdXycCRhe6UCcsD/EVn9ecIqwnPHmfXG0eg6BuLBU\n' +
  'uK0c656i09Xs+EckcUIS5cjNc9L6JS1ij/LpKwUnbxr4G/PklQa2UkDuJ9/682+I\n' +
  '5jvE19e8OO4Ur3ocgD9rL9voGst/rGxKdp8Ue4Ika7tW7uF/7EhlTotUoXhhZwQi\n' +
  'ljLyDXTy3qhqreruZMWLfJ9/BimDN+Nj7LRwN6gIkd8VRFO7WA+j4pAuu+AuXn5t\n' +
  '+j8YpCDqaI+accjhQg7C37+teHSsOJXZyL39gZxauhdbcaqunIa8PqRbxGLMZEfU\n' +
  'yIXpT7YoGrMHD/mptmf+weQI+QEzD77BhMN4x7amAQKBgQC58kJ3UzTvUSBfS3RF\n' +
  'N//Yr8iBJ6/W+UpQiXlWzCkPpgsjTBIr23S5tdJIPw9HOY7u2XLJAHLT3V7s24HW\n' +
  'lb/6gmXrCuFlR5c4G/qiUCL8iwiYvnII6Z8W1WOuygCmGPT/vErHAfHhTj4r78NJ\n' +
  'vy8cZ2SSj+I3pbgnVosLzyxsMQKBgQC4j3z2pIv0h9n6ZiLhEHlCFNhYFK+3dN+k\n' +
  'C5/Jmx9rgK1cpKXWDKhxK8RwgJfxDqzaadOGjichCTqNiJhQ4kynjSW62lM1Pvm9\n' +
  'OAJCQut9gy361evBtl+OesNRS1VSHtN/FsmClgEZIGZ/8rCxjDC/2QinHZpQmCIA\n' +
  'PJwO+dNGuQKBgAY7xdikNHEVYiVvrR0o7G3CLtGNmAp33vLmOOgc/f9lTJhJU46e\n' +
  '08HqA3uiiYuUtWLybTOpzS+nCyibjzW3XXEzb+E6QyYXCU27OmK4lwOqUYZ1U/NS\n' +
  'iZ/FVYslgHIRAh2UnVkgipBIBDOK3RwayaSFHsz+/9Fnv82pzA2AS3fxAoGAGr03\n' +
  'Nqi6WjBAhYW8sezoFInemkxM9QBq0mKYwOXHlJStCUoVeMCWuubDbCVFXjhpFK/W\n' +
  'ZJ090Ax9Pjo3DyjqQDAz8jFlcsZv+lkeAqmdYq7Zv4i0wnkAuSzSFXobn2016SjN\n' +
  'Ay1mdVR7ZTgtH1wXSARSu5uPWvPfoTcmyQiq8okCgYAZ3SkPchC7tP+ZdNd/p/LW\n' +
  'D495WXeOQjgVdxAp1LeBrlAxLdzE/xVawdLD3+MV5NjdN3WpH86sioU9WrsSvGmQ\n' +
  'y0v11vVT0QGcERorRrnRWO++LoUKt61uXDKfDmI9jAAAh1vuyYWtt9rtxZ8V4RLL\n' +
  'BTq/t0XcDWqkdE4xDrXjkA==\n';

const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhg5Y3WL4DEey5fF/JNBH\n' +
  'VM1rAs1DPw7Ys/D7b7l8Oihf8mm5J7dDh9IGNQaIx7OgxgfvV6WMg3PduTnzgmUN\n' +
  '0oZyljf1IuJAl6sE8monsVZqh4HAGqOAzDIU9rZVQ7exuOCq/McCFFQgfRzMu+Tk\n' +
  '/q3fRYgq1j+RM//tpMh8hODfOyGKo/60rgkBl8TispbwgynTYsC2iWU4Ap3La8eZ\n' +
  'VLLy3YOEd1lqaDhUq5vqj2CwdwfjBUAztPw1lb8PfSX/vCRsQ6NUzUrnxIWdvuC+\n' +
  'kedZgZH31ybWizgIYnBL2pgJ6Gg6xnxKs384v9wvRMOnnhSATw5BiDjwpXO1shKV\n' +
  'aQIDAQAB\n' +
  '-----END PUBLIC KEY-----';

describe('utils', () => {
  it('rsa', () => {
    const rsa = new RSAEncrypt(2048);
    const data = {
      name: 'test',
      age: 18,
    };
    const encrypted = rsa.encryptPrivate(data, privateKey);
    expect(encrypted).to.be.a('string');
    const decrypted = rsa.decryptPublic(encrypted, publicKey);
    expect(JSON.stringify(decrypted)).to.be.equal('{"name":"test","age":18}');
  });

  it('aes', () => {
    const data = JSON.stringify({ test: 123 });
    const key = '1234567890abcdef1234567890abcdef';
    const iv = '1234567890abcdef';
    const encrypted = _aes_cbc(data, { key, iv });
    expect(encrypted).to.be.a('string');
    const decrypted = _aes_cbc(encrypted, { key, iv, encrypt: false });
    expect(decrypted).to.be.equal(data);
  });
});
