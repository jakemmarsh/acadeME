'use strict';

module.exports = function(sequelize, DataTypes) {

  var Quiz = sequelize.define('Quiz', {
    title:       { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT }
  },
  {
    classMethods: {
      associate: function(models) {
        Quiz.belongsTo(models.Lesson);
        Quiz.hasMany(models.Question);
      }
    }
  });

  return Quiz;

};