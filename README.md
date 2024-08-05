# runErrands
  ## Technology Stack
  ### web:
    -  react：js
    -  antd：component library
    -  echarts：chart Statistics
    -  vite：optimized Build
    -  axios：request for communication
    -  zustand：state management
  ### mobile
    -  react：js
    -  antd mobile：component library
    -  axios：request for communication
  ### server
    -  mongodb：database -- data storage
    -  redis：persistent storage,token 
    -  multer：documents processing
    -  docker：database container


  ## Web Administrator   
    - login account: admin@163.com  
    - password: 123456
  
  ## vscode extension
    - MongoDB for VS Code  
  
  ## Development preparation
```bash

# setting environment var
cp .env.local .env

# npm install
npm install
cd ./platform/web/ && npm install
cd ./platform/mobile/ && npm install
cd ./server/ && npm install

# start development environment
npm run start:docker

# # initialize database schema and data
# npm run init


## Starting

# start service
npm run start:server

# start front-end web project
npm run start:web

# start front-end mobile project
npm run start:mobile
```



