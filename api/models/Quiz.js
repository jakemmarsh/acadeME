'use strict';

var _ = require('lodash');

module.exports = function(sequelize, DataTypes) {

  var Quiz = sequelize.define('Quiz', {
    description:  { type: DataTypes.TEXT },
    tags:         { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    numQuestions: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    setterMethods: {
      tags: function(v) {
        return this.setDataValue('tags', _.map(v, function(tag) { return tag.toLowerCase(); }));
      }
    },
    classMethods: {
      associate: function(models) {
        Quiz.belongsTo(models.Lesson);
        Quiz.belongsTo(models.Course);
        Quiz.hasMany(models.Question, { onDelete: 'cascade' });
        Quiz.hasMany(models.QuizCompletion, { onDelete: 'cascade' });
      }
    }
  });

  return Quiz;

};