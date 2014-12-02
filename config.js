'use strict';

var config = {};

/* ====================================================== */

config.redis = {
  port: 11082,
  host: 'pub-redis-11082.us-east-1-4.4.ec2.garantiadata.com',
  auth: 'redispass'
};

/* ====================================================== */

config.database = {
  string: 'postgres://swxnsevnkecujp:n4fL2_f2fsP2Di2qdi4WqzkuDJ@ec2-54-163-255-191.compute-1.amazonaws.com:5432/db1j2vad56lppo?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory',
  host: 'ec2-54-163-255-191.compute-1.amazonaws.com',
  port: 5432,
  db: 'db1j2vad56lppo',
  user: 'swxnsevnkecujp',
  password: 'n4fL2_f2fsP2Di2qdi4WqzkuDJ'
};

/* ====================================================== */

module.exports = config;