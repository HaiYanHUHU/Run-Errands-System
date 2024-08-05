// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import config from '../config';
import Redis from 'ioredis';
import { MongoClient } from 'mongodb';
import { debug } from '@axiosleo/cli-tool';

let redis: Redis | null = null;

export const _redis = (): Redis => {
  if (!redis) {
    redis = new Redis(config.envs.redis);
  }
  return redis;
};

const conf = config.envs.mongo;
const up = (conf.user || '') !== '' && (conf.pass || '') !== '' ? `${conf.user}:${conf.pass}@` : '';
const url = `mongodb://${up}${conf.host}:${conf.port}/${conf.db}`;
const mongo = new MongoClient(url);
mongo.connect().catch((err) => debug.log(err));

export const _mongo = () => {
  return mongo.db(conf.db);
};

export function _mongoCollection(dbName: string) {
  return _mongo().collection(dbName);
}

_mongo();
