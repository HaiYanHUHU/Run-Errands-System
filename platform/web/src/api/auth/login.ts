import request from "@/api";

/**
 * @login
 */
// * User login interface
export const loginApi = (params: object | undefined) => {
  return request.post(`login`, params, {
    headers: {
      fullLoading: true,
      Progress: true,
    },
  });
};

// * User login interface
export const logoutApi = () => {
  return request.post(`logout`, undefined, {
    headers: {
      fullLoading: true,
      Progress: true,
    },
  });
};

export const userApi = () => {
  return request.get(`/user`, undefined, {
    headers: {
      fullLoading: true,
      Progress: true,
    },
  });
};


// * User register interface
export const registerApi = (params: object | undefined) => {
  return request.post(`register`, params, {
    headers: {
      fullLoading: true,
      Progress: true,
    },
  });
};
