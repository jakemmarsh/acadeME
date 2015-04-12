'use strict';

var slug = require('slug');

module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
    title:       { type: DataTypes.STRING, allowNull: false },
    slug:        { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    imageUrl:    { type: DataTypes.STRING }
  },
  {
    hooks: {
      beforeValidate: function(course, model, cb) {
        var titleSlug = slug(course.title).toLowerCase();

        Course.count({
          where: { title: { ilike: course.title } }
        }).then(function(c) {
          if ( c > 0 ) { titleSlug += '-' + c; }
          course.setDataValue('slug', titleSlug);
          cb(null, course);
        });
      }
    },
    classMethods: {
      associate: function(models) {
        Course.belongsTo(models.User, { as: 'Instructor' });
        Course.hasMany(models.Lesson, { onDelete: 'cascade' });
        Course.hasMany(models.Quiz, { onDelete: 'cascade' });
        Course.hasMany(models.QuizCompletion, { onDelete: 'cascade' });
        Course.hasMany(models.Enrollment, { as: 'Enrollments', foreignKey: 'CourseId', onDelete: 'cascade' });
      }
    }
  });

  return Course;

};