'use strict';

module.exports = function(sequelize, DataTypes) {

  var Quiz = sequelize.define('Quiz', {
    description: { type: DataTypes.TEXT },
    tags:        { type: DataTypes.STRING }
  },
  {
    setterMethods: {
      tags: function(v) {
        return this.setDataValue('tags', v.join(','));
      }
    },
    getterMethods: {
      tags: function() {
        return this.getDataValue('tags') ? this.getDataValue('tags').split(',') : null;
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