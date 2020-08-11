import axios from 'axios';

export default axios.create({
  baseURL: 'https://d5il4ug6yc.execute-api.us-east-1.amazonaws.com/dev',
  headers: { 'content-type': 'application/json' }
});