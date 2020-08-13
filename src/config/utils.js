//Import
import config from "../config/config";
import https from 'https';
//Require
const axios = require('axios').default;
const DateDiff = require('date-diff');
//Config
axios.defaults.baseURL = config.backURL;
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });
  export default {
    getTokenApi: () => {
      if (localStorage.APITimer == undefined || localStorage.APITimer == "undefined"){
        localStorage.APITimer = new Date();
      }
      const date1 = Date.parse(localStorage.APITimer);
      const date2 = new Date();
      const diff = new DateDiff(date1, date2);
      if((diff.seconds()*(-1))>=24 || localStorage.APItoken == undefined || localStorage.APItoken == "undefined"){
       return axiosInstance.post('/auth/login', {"user":config.APIUser, "pass": config.APIPass})
          .then((res) => {
            localStorage.APITimer = new Date();
            localStorage.APItoken = res.data.token
            return res.data.token;
          });
      }else{
        return localStorage.APItoken;
      }
    }
  }