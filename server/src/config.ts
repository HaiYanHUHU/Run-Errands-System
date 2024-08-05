export default {
  envs: {
    deploy: process.env.NODE_ENV || 'local',
    debugMode: !__dirname.startsWith('/snapshot/'),
    app: {
      web_public: process.env.APP_WEB_PUBLIC || './web/dist',
      api_port: process.env.API_PORT ? parseInt(process.env.API_PORT) : 33334
    },
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 33306,
      user: process.env.MYSQL_USER || 'root',
      pass: process.env.MYSQL_PASS || '3AQqZTfmww=Ftj',
      db: process.env.MYSQL_DB || 'local_db',
    },
    redis: {
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 33679,
      host: process.env.REDIS_HOST || 'localhost',
      username: process.env.REDIS_USER || undefined,
      password: process.env.REDIS_PASS || undefined,
      db: process.env.REDIS_DEFAULT_DB ? parseInt(process.env.REDIS_DEFAULT_DB) : 0, // Defaults to 0
    },
    mongo: {
      user: process.env.MONGO_USER || '',
      pass: process.env.MONGO_PASS || '',
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT ? parseInt(process.env.MONGO_PORT) : 37017,
      db: process.env.MONGO_DB || 'local_db',
    }
  }
};
