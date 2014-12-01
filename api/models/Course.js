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
    setterMethods: {
      title: function(value) {
        this.setDataValue('title', value);
        this.setDataValue('slug', slug(value));
      }
    },
    classMethods: {
      associate: function(models) {
        Course.belongsTo(models.User, { as: 'Instructor' });
        Course.hasMany(models.Lesson);
        Course.hasMany(models.Enrollment);
      }
    }
  });

  return Course;

};