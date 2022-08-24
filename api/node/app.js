const recurly = require('recurly');
const express = require('express');

const app = express();
app.use(express.json());

const {
  RECURLY_SUBDOMAIN,
  RECURLY_API_KEY,
  RECURLY_PUBLIC_KEY,
  SUCCESS_URL,
  ERROR_URL,
  PUBLIC_DIR_PATH
} = process.env;

app.get('/api/hello', (request, response) => {
  response.send({hello: 'world'})
})


const pubDirPath = '../../public'

app.use(express.static(pubDirPath));

app.listen(9001, () => console.log('Listening on port localhost:9001'))