import path from 'path';
import fs from 'fs';
import { cpus, homedir } from 'os';
import cluster from 'cluster';
import config from './config';
import routers from '@/modules/index';
import { HttpResponse, KoaApplication, KoaContext } from '@axiosleo/koapp';
import { printer, helper, debug } from '@axiosleo/cli-tool';
import { RSAEncrypt } from './services/utils';
// import koastatic from 'koa-static';

const { str } = helper;
const { _fixed } = str;

const numCPUs = cpus().length;
const debugMode = !__dirname.startsWith('/snapshot/');
const processCount = debugMode ? 1 : numCPUs;

class App extends KoaApplication {
  constructor() {
    const debugMode = config.envs.debugMode;

    const options = {
      listen_host: '0.0.0.0',
      isProd: process.env.NODE_ENV === 'prod',
      debug: process.env.NODE_ENV !== 'prod',
      app_id: process.env.APP_ID || '',
      port: 33334,
      routers,
      static: {
        rootDir: path.join(__dirname, '../public'),
        uploadDir: path.join(__dirname, '../public/upload'),
        index: 'index.html',
        // notFoundFile: 'view/error/404.html'
      },
    };
    super(options);
    //.
    if (debugMode) {
      fs.writeFileSync(path.join(__dirname, '../../runtime/_router_.json'), JSON.stringify(this.routes, null, 2));
    }
    this.on('response', (context: KoaContext) => {
      if (context.response instanceof HttpResponse && context.response.status !== 200) {
        debug.log(context.response);
      }
    });
    // this.koa.use(koastatic(__dirname + '/public'));
  }

  async start() {
    if (!debugMode) {
      // check license
      const licenseFile = path.join(process.cwd(), 'license.lic');

      if (!await helper.fs._exists(licenseFile)) {
        printer.error('[S100]License file not found.');
        process.exit(1);
      }
      const licenseStr = await helper.fs._read(licenseFile);
      if (!licenseStr) {
        printer.error('[S101]Invalid license file.');
        process.exit(1);
      }

      const serverPrivateKeyFile = path.join(homedir(), '.ssh/id_ed25519');
      if (!await helper.fs._exists(serverPrivateKeyFile)) {
        printer.error('[S102]Invalid license file.');
        process.exit(1);
      }
      const serverPrivateKey = await helper.fs._read(serverPrivateKeyFile);

      try {
        const rsa = new RSAEncrypt();
        const publicKey = '-----BEGIN PUBLIC KEY-----' + licenseStr.substring(0, 392) + '-----END PUBLIC KEY-----';
        const license: { expired: number, server_private_key: string } = rsa.decryptPublic(licenseStr.substring(392), publicKey);
        const s1 = license.server_private_key;
        const s2 = serverPrivateKey.split('\n').slice(1, -2).join('');
        if (s1 !== s2) {
          printer.error('[S103]Invalid license file.');
          process.exit(1);
        }
        if (license.expired < (new Date()).getTime()) {
          printer.error('[S104]License expired.');
          process.exit(1);
        }
      } catch (err) {
        printer.error('Invalid license file.');
        process.exit(1);
      }
    }
    super.start();
  }
}

if (cluster.isPrimary) {
  const len = 15;
  printer.println();
  printer.yellow('-'.repeat(50)).println().println();
  printer.yellow(_fixed('Deploy Env', len)).print(': ').println(config.envs.deploy);
  printer.yellow(_fixed('Debug Mode', len)).print(': ').println(`${debugMode ? 'true' : 'false'}`);
  printer.yellow(_fixed('CPU number', len)).print(': ').println(`${numCPUs}`);
  printer.yellow(_fixed('Process count', len)).print(': ').println(`${processCount}`).println();
  if (!debugMode) {
    printer.yellow(_fixed('Listening Port', len)).print(': ').println(`${config.envs.app.api_port}`).println();
  }
  printer.yellow('-'.repeat(50)).println();
  cluster.on('listening', (worker, address) => {
    if (debugMode) {
      printer.yellow('worker pid: ').print(`${worker.process.pid}`)
        .yellow(' listening on ').green(`${address.port}`).println(' port');
    } else {
      printer.yellow('worker pid: ').print(`${worker.process.pid}`).println();
    }
  });
  cluster.on('exit', (worker, code, signal) => {
    printer.warning(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    printer.warning('Starting a new worker...');
    cluster.fork();
  });
  for (let i = 0; i < processCount; i++) {
    cluster.fork();
  }
} else {
  const app = new App();
  app.start();
}
