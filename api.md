
#### register
  1. Create an administrator: post  /api/registerAdmin 
  ```
  body:{
    email: "admin@163.com",
    firstName: "aiai",
    lastName: "zhang",
    password: "123456",
    phone: "12345678901"
 }
  ```

  2. registered user: post  /api/register 
  ```
  body:{
    email: "user@163.com",
    firstName: "uiui",
    lastName: "zhang",
    password: "123456",
    phone: "12345678902",
    documents:[]
 }
  ```

  3. users login: post  /api/login 
  ```
  body:{
    username: "user@163.com",
    password: "123456"
 }
  ```

  4. users logout: post  /api/logout
  ```
  body:{
    username: "user@163.com",
    password: "123456"
  }
  ```

#### User Moduel
  1. Register by user: post  /api/user/approve
  ```
  body:{
    _ids：[]
  }
  ```

  2. Refuse user registration: post  /api/user/reject
  ```
  body:{
    _ids：[]
  }
  ```

   3. Statistics of user growth in one week: get  /api/user/statistics
  ```
  ```
  
  4. User List: get  /api/user/list
  ```
  query:{
    status?:0, //state 0/1
    created_by?:1, //creator id
  }
  ```

#### task Moduel
  1. publish a task: post  /api/task/add
  ```
  body:{
    "weight": "1212",
    "cost": "121",
    "time": "1",
    "type": "Clothing",
    "width": "12",
    "heigth": "12",
    "length": "12",
    "fromLo": "address1",
    "toLo": "address2",
  }
  ```

  2. accept a task:put  /task/accept/{:id}
  ```
  ```

  3. task done:put  /task/complete/{:id}
  ```
  ```

   4. The number of tasks increased in one week: get  /api/task/statistics
  ```
  ```

  5. task list: get  /api/task/list
  ```
  query:{
    status:'Pending', //state 'Pending' | 'Progress' | 'Completed',
    acceptor:1, //acceptor id
    completor:1, //completor id
    created_by:1, //created_by id
  }
  ```
