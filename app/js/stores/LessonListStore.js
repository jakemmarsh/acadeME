'use strict';

var Reflux             = require('reflux');

var CurrentCourseStore = require('./CurrentCourseStore');
var LessonActions      = require('../actions/LessonActions');

var LessonListStore = Reflux.createStore({

  init: function() {
    this.listenTo(CurrentCourseStore, this.loadLessonsFor);
  },

  loadLessonsFor: function(course) {
    var lessons = [
      {
        id: 0,
        title: 'Rapid Prototyping',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus. Vivamus nec sem vitae sem suscipit tempus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
        image_url: ''
      },
      {
        id: 1,
        title: 'Heuristic Evaluation',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus.',
        image_url: ''
      }
    ];

    console.log('load lessons for course:', course.id);

    this.currentList = lessons;

    // TODO: fetch lessons from database

    this.trigger(lessons);
  },

  openLessonCallback: function(lessonId) {
    // trigger to open course?
    // this.trigger('course');

    LessonActions.loadLesson(lessonId);
  }

});

module.exports = LessonListStore;