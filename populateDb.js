'use strict';

var when = require('when');
var _    = require('lodash');

/* ====================================================== */

module.exports = function(models) {

  var createInstructorUser = function() {
    var deferred = when.defer();
    var user = {
      username: 'jdoe',
      name: 'John Doe',
      imageUrl: 'http://themes.mysitemyway.com/_shared/images/content/john_doe.jpg'
    };

    models.User.create(user).then(function(createdUser) {
      deferred.resolve(createdUser);
    }).catch(function(err) {
      console.log('error creating instructor user:', err);
    });

    return deferred.promise;
  };

  var createCourse = function(instructor) {
    var deferred = when.defer();
    var course = {
      title: 'Human-Computer Interaction',
      description: 'This course teaches a lot of very cryptic stuff, I don\'t know.',
      InstructorId: instructor.id
    };

    models.Course.create(course).then(function(course) {
      deferred.resolve(course);
    }).catch(function(err) {
      console.log('error creating course:', err);
    });

    return deferred.promise;
  };

  var createLessons = function(course) {
    var deferred = when.defer();
    var lessons = [
      {
        CourseId: course.id,
        title: 'Rapid Prototyping',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus. Vivamus nec sem vitae sem suscipit tempus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
        image_url: '',
        bodyElements: []
      },
      {
        CourseId: course.id,
        title: 'Heuristic Evaluation',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus.',
        image_url: '',
        bodyElements: []
      }
    ];

    models.Lesson.bulkCreate(lessons).then(function() {
      deferred.resolve(course);
    }).catch(function(err) {
      console.log('error creating lesssons:', err);
    });

    return deferred.promise;
  };

  var createEnrolledUsers = function(course) {
    var deferred = when.defer();
    var usersToCreate = [
      {
        username: 'sjobs',
        name: 'Steve Jobs',
        imageUrl: 'http://a5.files.biography.com/image/upload/c_fill,dpr_1.0,g_face,h_300,q_80,w_300/MTE5NDg0MDU0NTIzODQwMDE1.jpg'
      },
      {
        username: 'bgates',
        name: 'Bill Gates',
        imageUrl: 'http://timedotcom.files.wordpress.com/2014/01/bill-gates.jpg?w=1100'
      }
    ];
    var usernames = _.pluck(usersToCreate, 'username');

    models.User.bulkCreate(usersToCreate).then(function() {
      models.User.findAll({
        where: { username: usernames }
      }).then(function(users) {
        var enrollments = _.map(users, function(user) {
          return {
            UserId: user.id,
            CourseId: course.id
          };
        });

        models.Enrollment.bulkCreate(enrollments).then(function() {
          deferred.resolve(users);
        }).catch(function(err) {
          console.log('error creating enrollments:', err);
        });
      });
    }).catch(function(err) {
      console.log('error creating other users:', err);
    });

    return deferred.promise;
  };

  var createCurrentUser = function(otherUsers) {
    var deferred = when.defer();
    var user = {
      username: 'jakemmarsh',
      name: 'Jake Marsh',
      type: 'instructor',
      imageUrl: 'https://scontent-b-lga.xx.fbcdn.net/hphotos-xpf1/t31.0-8/1796992_10151957242618173_179336983_o.jpg'
    };

    models.User.create(user).then(function(currentUser) {
      deferred.resolve([currentUser, otherUsers]);
    }).catch(function(err) {
      console.log('error creating current user:', err);
    });

    return deferred.promise;
  };

  var createCourseCurrentUserTeaches = function(users) {
    var deferred = when.defer();
    var course = {
      title: 'Test Course',
      description: 'This course is just a test, taught by the current user.',
      InstructorId: users[0].id // current user's ID
    };

    models.Course.create(course).then(function() {
      deferred.resolve(users);
    }).catch(function(err) {
      console.log('error creating course taught by current user:', err);
    });

    return deferred.promise;
  };

  var createConversation = function(users) {
    var currentUser = users[0];
    var otherUsers = users[1];
    var deferred = when.defer();
    var sortedOtherUserIds = [otherUsers[0].id, otherUsers[1].id].sort();
    var sortedIds = [currentUser.id, sortedOtherUserIds[0]].sort();
    var conversation = {
      CourseId: 1,
      UserOneId: sortedIds[0],
      UserTwoId: sortedIds[1]
    };

    models.Conversation.create(conversation).then(function(createdConversation) {
      deferred.resolve([currentUser, otherUsers, createdConversation]);
    }).catch(function(err) {
      console.log('error creating conversation:', err);
    });

    return deferred.promise;
  };

  var createMessages = function(previousData) {
    var currentUser = previousData[0];
    var otherUsers = previousData[1];
    var createdConversation = previousData[2];
    var deferred = when.defer();
    var messagesToCreate = [
      {
        body: 'This is a message sent by another user with ID 2!',
        UserId: otherUsers[0].id,
        ConversationId: createdConversation.id
      },
      {
        body: 'This is a message sent by the current!',
        UserId: currentUser.id,
        ConversationId: createdConversation.id
      }
    ];

    models.Message.bulkCreate(messagesToCreate).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      console.log('error creating messages:', err);
    });
  };

  createInstructorUser()
    .then(createCourse)
    .then(createLessons)
    .then(createEnrolledUsers)
    .then(createCurrentUser)
    .then(createCourseCurrentUserTeaches)
    .then(createConversation)
    .then(createMessages);

};