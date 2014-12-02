'use strict';

var url       = require('url');
var when      = require('when');
var kue       = require('kue');
var config    = require('../config');
var chatUtils = require('./utils/chat');

/* ====================================================== */

module.exports = function() {

  function Queue() {
    var redisUrl = process.env.REDISTOGO_URL ? url.parse(process.env.REDISTOGO_URL) : {};

    this.jobs = kue.createQueue({
      redis: {
        port: redisUrl.port || config.redis.port,
        host: redisUrl.hostname || config.redis.host,
        auth: redisUrl.auth || config.redis.auth
      }
    });

    this.clearAllJobs();

    this.jobs.process('message', function(job, done) {
      console.log('now processing message:', job.data);
      chatUtils.saveMessage(job.data).then(done);
    });
  }

  Queue.prototype.clearAllJobs = function() {
    kue.Job.rangeByType('message', 'complete', 0, -1, 'asc', function(err, selectedJobs) {
      selectedJobs.forEach(function(job) {
        job.remove();
      });
    });
  };

  Queue.prototype.message = function(message) {
    var deferred = when.defer();

    console.log('create message job for:', message);

    var job = this.jobs.create('message', {
      Body: message.body || message.Body,
      ConversationId: message.conversationId || message.ConversationId,
      UserId: message.userId || message.UserId
    }).removeOnComplete(true).save(function(err){
      if( err ) {
        console.log('Error saving message job:', err);
        deferred.reject(err);
      } else {
        console.log('job saved:', job.id);
        deferred.resolve(message);
      }
    });

    return deferred.promise;
  };

  return new Queue();

};