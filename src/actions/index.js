import jwtDecode from 'jwt-decode';
import { API_ORIGIN } from "../config";
import { resolve } from 'path';
import io from 'socket.io-client';
/*
 * action types
*/

export const LOG_USER = "LOG_USER";
export const LOG_OUT = "LOG_OUT";
export const CHAT = "CHAT";
export const REQUEST = "REQUEST";
export const SELECT_VIDEO = "SELECT_VIDEO";
export const UPDATE_TIME = "UPDATE_TIME";
export const GEN_WATCHLIST = "GEN_WATCHLIST";
export const DELETE_VIDEO = "DELETE_VIDEO";
export const ADD_VIDEO = "ADD_VIDEO";
export const APPEND_RESULTS = "APPEND_RESULTS";
export const CLEAR_RESULTS = "CLEAR_RESULTS";


/*
 * action creators
 */

export const request = () => ({
  type: REQUEST
});

export const logUser = user => ({
  type: LOG_USER,
  user
});

export const logout = () => ({
  type: LOG_OUT
});

export const saveChat = (text) => ({
  type: CHAT,
  text
});

export const selectVideo = (currentVideo, id) => ({
  type: SELECT_VIDEO,
  currentVideo,
  id
});

export const updateTime = time => ({
  type: UPDATE_TIME,
  time
});

export const genWatchlist = videos => ({
  type: GEN_WATCHLIST,
  videos
});

export const deleteFromWatchlist = id => ({
  type: DELETE_VIDEO,
  id
});

export const addToWatchlist = video => ({
  type: ADD_VIDEO,
  video
});

export const appendResults = videos => ({
  type: APPEND_RESULTS,
  videos
});

export const clearResults = videos => ({
  type: CLEAR_RESULTS,
  videos
});

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const authRequest = () => ({
  type: AUTH_REQUEST
});

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const setAuthToken = (authToken) => ({
    type: SET_AUTH_TOKEN,
    authToken
});

export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const authSuccess = currentUser => ({
    type: AUTH_SUCCESS,
    currentUser
});


const storeAuthInfo = (authToken, dispatch) => {
  const decodedToken = jwtDecode(authToken);
  dispatch(setAuthToken(authToken));
  dispatch(authSuccess(decodedToken));
};

export const login = user => dispatch => {
  console.log(user);
  dispatch(request());
  fetch(`${API_ORIGIN}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then(authToken => storeAuthInfo(authToken.token, dispatch))
    .catch((res, err) => {
      console.log("res: ", res);
    });
};

export const signupUser = user => dispatch => {
  dispatch(request());
  fetch(`${API_ORIGIN}/auth/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then(authToken => storeAuthInfo(authToken.token, dispatch))
    .catch((res, err) => {
      console.log("res: ", res);
    });
};


export const testChat = text => dispatch => {
  const socket = io.connect('http://localhost:8080');
  fetch(`${API_ORIGIN}/user/chat`, {
    method: 'POST',
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmQ4YmU1MzdjNjNjYmNjMGI1OTgzOWIiLCJlbWFpbCI6ImJvc3RvbkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImJvc3RvbiIsInRlc3QiOiJIT1dEWSEiLCJpYXQiOjE1NDEwOTczOTF9.g1BN902doUml6tpVv1EbgCpDiKxlkoWO7D3txo_Vf0o`
    }
  })
  .then(res => {
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  })
  .then(res => {
    console.log(res);
    socket.emit('chat message', text);
    socket.on('chat message', function (msg) {
      // this needs to be dispatched to the reducer
      dispatch(saveChat(msg));
      console.log(msg);
    });

  })
};

// searchVideos finds videos using YouTube API
export const searchVideos = (text, token) => dispatch => {
  dispatch(request());
  fetch(`${API_ORIGIN}/videos/search/${text}`, {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(res.statusText);
      }
      return res.json();
    })
    .then(res => {
      dispatch(appendResults(res.response.body));
    })
    .catch(err => {
      console.log("actions index.js line 94", err);
    });
};

// addVideo adds a video to the watchlist (favorites)
export const addVideo = (obj, userID, token) => dispatch => {
  const userVideo = {video: obj, id: userID};
  dispatch(request());
  fetch(`${API_ORIGIN}/videos`, {
    method: 'POST',
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(userVideo)
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(res.statusText);
        // const err = new Error('Missing `title` in request body');
        // err.status = 400;
      }
      return res.json();
    })
    .then(res => {
      console.log(res);
      dispatch(addToWatchlist(res));
    })
    .catch(err => {
      console.log("actions index.js line 94", err);
    });
};

export const deleteVideo = (id, token) => dispatch => {
  dispatch(request);
  fetch(`${API_ORIGIN}/videos/${id}`, {
    method: 'DELETE',
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      dispatch(deleteFromWatchlist(id));
    })
    .catch(err => {
      console.log(err);
    });
};

// getWatchlist gets user's video list and generates on the page
export const getWatchlist = (id, token) => dispatch => {
  dispatch(request());
  fetch(`${API_ORIGIN}/videos/${id}`, {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(res => {
      dispatch(genWatchlist(res.videos));
    })
    .catch(err => {
      console.log(err);
    });
};
