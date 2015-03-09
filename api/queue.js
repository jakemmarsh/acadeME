'use strict';

var url       = require('url');
var when      = require('when');
var kue       = require('kue');
var chatUtils = require('./utils/chat');

/* ====================================================== */

module.exports = function() {

  function Queue() {
    var redisUrl = process.env.REDISTOGO_URL ? url.parse(process.env.REDISTOGO_URL) : {};

    this.jobs = kue.createQueue({
      redis: {
        port: redisUrl.port || process.env.REDIS_PORT,
        host: redisUrl.hostname || process.env.REDIS_HOST,
        auth: redisUrl.auth || process.env.REDIS_AUTH
      }
    });

    this.clearAllJobs();

    this.jobs.process('message', function(job, done) {
      console.log('now processing message:', job.data);
      chatUtils.saveMessage(job.data).then(done);
    });
  }

  /* ====================================================== */

  Queue.prototype.clearAllJobs = function() {
    kue.Job.rangeByType('message', 'complete', 0, -1, 'asc', function(err, selectedJobs) {
      selectedJobs.forEach(function(job) {
        job.remove();
      });
    });
  };

  /* ====================================================== */

  Queue.prototype.message = function(message, attachment) {
    var deferred = when.defer();

    console.log('create message job for:', message);

    var job = this.jobs.create('message', {
      message: {
        body: message.body || message.Body,
        ConversationId: message.conversationId || message.ConversationId,
        UserId: message.userId || message.UserId
      },
      attachment: attachment || null
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

  /* ====================================================== */

  return new Queue();

};