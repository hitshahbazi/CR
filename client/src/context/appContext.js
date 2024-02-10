import React, { useReducer, useContext, useEffect } from 'react';

import reducer from './reducer';
import axios from 'axios';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  GET_JOBS_ERROR,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  SET_VALUES,
  CREATE_SCRIPT_BEGIN,
  CREATE_SCRIPT_SUCCESS,
  CREATE_SCRIPT_ERROR,
  EXPORT_SCRIPTS_ERROR,
  EXPORT_SCRIPTS_SUCCESS,
  UPDATE_SCRIPT_ERROR,
  UPDATE_SCRIPT_SUCCESS,
  UPDATE_SCRIPT_BEGIN,
  SHOW_ATOLL_BEGIN,
  SHOW_ATOLL_SUCCESS,
} from './actions';

const initialState = {
  userLoading: true,
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  userLocation: '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  company: '',
  jobLocation: '',
  jobTypeOptions: ['NSA','LSA','HSA'],
  jobType: 'NSA',
  statusOptions: ['Approved','Implemented','Cancelled'],
  status: 'Approved',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
  //////////////////
  startTime: '',
  endTime : '' ,
  team: 'Ericsson',
  teamOptions:['Ericsson','Nokia','Huawei'],
  jobTechnology: '4G',
  jobTechnologyOptions: ['2G','3G','4G'],
  crNumber : '',
  ///////////// script initial values
  rowid : '',
  category: '',
  subregion: '',
  siteId:'',
  cellId:'',
  mo:'',
  parameter:'',
  pre:'',
  post:'',
  bl:'',
  scripts: [],
  group:'',
  exportedScripts: [],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });
  // request

  // response

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // console.log(error.response)
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, location , group} = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText , group },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = async () => {
    await authFetch.get('/auth/logout');
    dispatch({ type: LOGOUT_USER });
  };
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { crNumber, team, jobTechnology, jobType, status , startTime , endTime} = state;
      await authFetch.post('/jobs', {
        crNumber,
        team, 
        jobTechnology, 
        jobType, 
        status , 
        startTime , 
        endTime
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state;

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const setEditJob = async (id) => {
    try {
      const jobDetails = await fetchJobById(id);
      dispatch({
        type: SET_VALUES,
        payload: {
          crNumber: jobDetails.crNumber,
          team: jobDetails.team,
          jobTechnology: jobDetails.jobTechnology,
          jobType: jobDetails.jobType,
          status: jobDetails.status,
          startTime: jobDetails.startTime,
          endTime: jobDetails.endTime,
        },
      });
  
      // Also set the id in the state
      dispatch({ type: SET_EDIT_JOB, payload: { id } });
    } catch (error) {
      console.error('Error setting edit job:', error);
      // Handle the error as needed
    }
  };
  

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });

    try {
      const { crNumber, team, jobTechnology, jobType, status , startTime , endTime } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        crNumber, 
        team, 
        jobTechnology, 
        jobType, 
        status , 
        startTime , 
        endTime
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  
  
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch('/jobs/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status === 401) return;
      logoutUser();
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);


  const fetchJobById = async (jobId) => {
    try {
      const response = await axios.get(`/api/v1/jobs/fetchJobById/${jobId}`);
      const jobDetails = response.data;
      return jobDetails;
    } catch (error) {
      throw error;
    }
  };
  

/* script related code */
const createScript = async (tableData) => {
  dispatch({ type: CREATE_SCRIPT_BEGIN });
  try {
    const scripts = tableData.map((script) => {
      const {
        crNumber,
        rowid,
        category,
        subregion,
        siteId,
        cellId,
        mo,
        parameter,
        bl,
        pre,
        post,
      } = script;

      return {
        crNumber: state.crNumber,
        rowid,
        category,
        subregion,
        siteId,
        cellId,
        mo,
        parameter,
        bl,
        pre,
        post,
      };
    });
    await authFetch.post('/scripts', { scripts }); // Assuming an API endpoint for bulk insertion
    dispatch({ type: CREATE_SCRIPT_SUCCESS });
    dispatch({ type: CLEAR_VALUES });
  } catch (error) {
    console.error('Server error:', error);
  
    if (error.response && error.response.status === 401) return;
  
    dispatch({
      type: CREATE_SCRIPT_ERROR,
      payload: { msg: error.response ? error.response.data.msg : 'Unknown error' },
    });
  }
  clearAlert();
};

const exportScripts = async () => {
  try {
    const { data } = await authFetch(`/scripts/export?crNumber=${state.crNumber}`);
    // Assuming `data` contains the exportedScripts property
    dispatch({ type: EXPORT_SCRIPTS_SUCCESS, payload: { exportedScripts: data.exportedScripts } });
  } catch (error) {
    if (error.response.status !== 401) {
      dispatch({
        type: EXPORT_SCRIPTS_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  }
  clearAlert();
};

const updateScript = async (updatedData) => {
  dispatch({ type: UPDATE_SCRIPT_BEGIN });
  try {
    const updatedScripts = updatedData.map((updatedScript) => {
      const {
        crNumber,
        rowid,
        category,
        subregion,
        siteId,
        cellId,
        mo,
        parameter,
        bl,
        pre,
        post,
      } = updatedScript;

      return {
        crNumber,
        rowid,
        category,
        subregion,
        siteId,
        cellId,
        mo,
        parameter,
        bl,
        pre,
        post,
      };
    });
    await authFetch.put('/scripts/update', { updatedScripts }); // Assuming an API endpoint for bulk update
    dispatch({ type: UPDATE_SCRIPT_SUCCESS });
    clearAlert(); // Move clearAlert inside the try block to only clear alert on success

    // Call exportScripts after updating scripts
    exportScripts(); // Trigger exportScripts after updating scripts
  } catch (error) {
    if (error.response.status !== 401) {
      dispatch({
        type: UPDATE_SCRIPT_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  }
  clearAlert();
};


const showAtoll = async () => {
  dispatch({ type: SHOW_ATOLL_BEGIN });
  try {
    const { data } = await authFetch('/jobs/atoll');
    dispatch({
      type: SHOW_ATOLL_SUCCESS,
      payload: {
        atolls: data.defaultAtolls,
        monthlyApplications: data.monthlyApplications,
      },
    });
  } catch (error) {
    logoutUser();
  }
  clearAlert();
};



useEffect(() => {
  // Call exportScripts when setEditJob is triggered
  if (state.editJobId) {
    exportScripts();
  }
}, [state.editJobId]);



  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
        fetchJobById, // Adding fetchJobById to the context
        createScript, //adding script to database
        exportScripts, // adding the exportScripts function to the context
        updateScript,
        showAtoll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
