'use strict';

module.exports = {
  env: 'production',
  hostURL: 'pelotonstreet.com',
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://localhost/fullstack'
  }
};