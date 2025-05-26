// import axios from 'axios';
// import { getToken, clearToken, storeToken} from '../pages/auth'; // Adjust the import path as necessary

// const API_BASE_URL = 'http://localhost:8000/api/';
// //const API_BASE_URL = 'https://groupaaits.onrender.com/api/';

// // Create an axios instance with default config
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// const refreshAccessToken = async (refreshToken) => {
//   try {
//     const response = await api.post('/token/refresh/', { refresh: refreshToken });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };


// // Add request interceptor to include the token in headers
// api.interceptors.request.use(
//     (config) => {
//       const token = getToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   // Add response interceptor to handle token refresh and errors
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;
      
//       // If 401 error and we haven't already tried to refresh
//       if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
        
//         try {
//           const refreshToken = localStorage.getItem('refreshToken');
//           if (!refreshToken) {
//             clearToken();
//             window.location.href = '/signin';
//             return Promise.reject(error);
//           }
          
//           const response = await refreshAccessToken(refreshToken);
//           const newAccessToken = response.data.access;
//           storeToken(newAccessToken);
          
//           // Retry the original request with new token
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
//         } catch (refreshError) {
//           clearToken();
//           window.location.href = '/signin';
//           return Promise.reject(refreshError);
//         }
//       }
      
//       return Promise.reject(error);
//     }
//   );

//   // Authentication API
// export const authAPI = {
//     signup: async (email, fullname, password, role) => {
     
//       try {
//         const response = await api.post('/signup/', { email, fullname, password, role });
//         return response.data;
//       } catch (error) {
//         throw error.response?.data || error.message;
//       }
//     },

//     verifyOTP: async (email, otp) => {
//         try {
//         const response = await api.post('/verify-otp/', { email, otp });
//         return response.data;
//         } catch (error) {
//         throw error.response?.data || error.message;
//         }
//     },
//     signin: async (email, password) => {
//         try {
//           const response = await api.post('/login/', { email, password });
//           // Store tokens
//           storeToken(response.data.access);
//           localStorage.setItem('refreshToken', response.data.refresh);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//     resendOTP: async (email) => {
//     try {
//         const response = await api.post('/resend-otp/', { email });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
//     },
//     refreshAccessToken: async (refreshToken) => {
//         try {
//           const response = await api.post('/token/refresh/', { refresh: refreshToken });
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       logout: () => {
//         clearToken();
//         localStorage.removeItem('refreshToken');
//       },
//     };
//     // User API
// export const userAPI = {
//     getUserInfo: async () => {
//       try {
//         const response = await api.get('/user-info/');
//         return response.data;
//       } catch (error) {
//         throw error.response?.data || error.message;
//       }
//     },
//     updateUserInfo: async (userData) => {
//         try {
//           const response = await api.put('/user-info/edit/', userData);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//     };
//     // Department API
// export const departmentAPI = {
//     getDepartments: async () => {
//       try {
//         const response = await api.get('/departments/');
//         return response.data;
//       } catch (error) {
//         throw error.response?.data || error.message;
//       }
//     },
//     createDepartment: async (departmentData) => {
//         try {
//           const response = await api.post('/departments/', departmentData);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//     };
//     // Course API
// export const courseAPI = {
//     getCourses: async () => {
//       try {
//         const response = await api.get('/courses/');
//         return response.data;
//       } catch (error) {
//         throw error.response?.data || error.message;
//       }
//     },
//     getCourseDetail: async (courseId) => {
//         try {
//           const response = await api.get(`/courses/${courseId}/`);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       createCourse: async (courseData) => {
//         try {
//           const response = await api.post('/courses/', courseData);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       updateCourse: async (courseId, courseData) => {
//         try {
//           const response = await api.put(`/courses/${courseId}/`, courseData);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       deleteCourse: async (courseId) => {
//         try {
//           const response = await api.delete(`/courses/${courseId}/`);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//     };
//     // Lecturer API
// export const lecturerAPI = {
//     getLecturers: async () => {
//       try {
//         const response = await api.get('/lecturers/');
//         return response.data;
//       } catch (error) {
//         throw error.response?.data || error.message;
//       }
//     },
//     createLecturer: async (lecturerData) => {
//         try {
//           const response = await api.post('/lecturers/', lecturerData);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       getLecturerIssues: async () => {
//         try {
//           const response = await api.get('/lecturers/issues/');
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//     };
//     // Issue API
// export const issueAPI = {
//     getIssues: async () => {
//       try {
//         const response = await api.get('/issues/');
//         return response.data;
//       } catch (error) {
//         throw error.response?.data || error.message;
//       }
//     },
//     getIssueDetail: async (issueId) => {
//         try {
//           const response = await api.get(`/issues/${issueId}/`);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       createIssue: async (issueData) => {
//         try {
//           const response = await api.post('/issues/', issueData);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       updateIssue: async (issueId, issueData) => {
//         try {
//           const response = await api.put(`/issues/${issueId}/`, issueData);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       deleteIssue: async (issueId) => {
//         try {
//           const response = await api.delete(`/issues/${issueId}/`);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       assignIssue: async (issueId, lecturerId) => {
//         try {
//           const response = await api.post(`/issues/${issueId}/assign/${lecturerId}/`);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//       resolveIssue: async (issueId) => {
//         try {
//           const response = await api.post(`/issues/${issueId}/resolve/`);
//           return response.data;
//         } catch (error) {
//           throw error.response?.data || error.message;
//         }
//       },
//     };
    
//     export default api;
    
    
  
import axios from 'axios';
import { getToken, clearToken, storeToken } from '../pages/auth'; // Make sure this path is correct

let API_BASE_URL;

if (import.meta.env.DEV){
  API_BASE_URL = 'http://127.0.0.1:8000/api/';
} else {
  API_BASE_URL = 'https://groupaaits.onrender.com/api/';
}
// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await api.post('/token/refresh/', { refresh: refreshToken });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = getToken(); // Fixed: Use the imported function instead of localStorage.getToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          clearToken();
          window.location.href = '/signin';
          return Promise.reject(error);
        }

        const response = await refreshAccessToken(refreshToken);
        const newAccessToken = response.access;
        storeToken(newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearToken();
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);
 

// User API
export const userAPI = {
  getUserInfo: async () => {
    try {
      const response = await api.get('/user-info/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateUserInfo: async (userData) => {
    try {
      const response = await api.put('/user-info/edit/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Authentication API
export const authAPI = {
    signup: async (email, fullname, password, role) => {
    try {
      const response = await api.post('/signup/', { email, fullname, password, role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const response = await api.post('/verify-otp/', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  signin: async (email, password) => {
    try {
      const response = await api.post('/login/', { email, password });
      // Store tokens
      storeToken(response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resendOTP: async (email) => {
    try {
      const response = await api.post('/resend-otp/', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    clearToken();
    localStorage.removeItem('refreshToken');
  },

  // forgotPassword: async (email) => request(api.post, '/forgot-password/', { email }),
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/forgot-password/', { email })
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // changePassword: async (data) => request(api.post, '/change-password/', data),
  changePassword: async (data) => {
    try {
      const response = await api.post('/change-password/', data)
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Department API
export const departmentAPI = {
  getDepartments: async () => {
    try {
      const response = await api.get('/departments/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createDepartment: async (departmentData) => {
    try {
      const response = await api.post('/departments/', departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Course API

export const courseAPI = {
  getCourses: async () => {
    try {
      const response = await api.get('/courses/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getCourseDetail: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // getCourseLecturers: async (courseId) => {
  //   try {
  //     const response = await api.get(`/courses/${courseId}/lecturers/`);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },

  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses/', courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.put(`/courses/${courseId}/`, courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/courses/${courseId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  fetchRegistrars: async ({ id } = {}) => {
    const url = `/registrars/${id === undefined ? '' : id}`
    return request(api.get, url);
  },

  fetchRegistrarById: async (id) => {
    return this.fetchRegistrars({ id });
  },

  fetchColleges: async ({ id } = {}) => {
    const url = `/colleges/${id === undefined ? '' : id}`
    return request(api.get, url);
  },

  fetchCollegeById: async (id) => {
    return this.fetchColleges({ id });
  },
};

// Lecturer API
export const lecturerAPI = {
  getLecturers: async () => {
    try {
      const response = await api.get('/lecturers/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createLecturer: async (lecturerData) => {
    try {
      const response = await api.post('/lecturers/', lecturerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getLecturerIssues: async () => {
    try {
      const response = await api.get('/lecturers/issues/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Issue API
export const issueAPI = {
  getIssues: async () => {
    try {
      const response = await api.get('/issues/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // getStudentIssues: async () => {
  //   try {
  //     const response = await api.get('/issues/student/');
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },

  getIssueDetail: async (issueId) => {
    try {
      const response = await api.get(`/issues/${issueId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  createIssue: async (issueData) => {
    try {
      const response = await api.post('/issues/', issueData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateIssue: async (issueId, issueData) => {
    try {
      const response = await api.put(`/issues/${issueId}/`, issueData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  deleteIssue: async (issueId) => {
    try {
      const response = await api.delete(`/issues/${issueId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  assignIssue: async (issueId, lecturerId) => {
    try {
      const response = await api.post(`/issues/${issueId}/assign/${lecturerId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  resolveIssue: async (issueId) => {
    try {
      const response = await api.post(`/issues/${issueId}/resolve/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

async function request(method, url, ...args) {
  try {
    const response = await method.call(api, url, args);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export default api;