'use strict';

module.exports = function(sequelize, DataTypes) {

  var QuizCompletion = sequelize.define('QuizCompletion', {
    score: { type: DataTypes.FLOAT, allowNull: false }
  },
  {
    classMethods: {
      associate: function(models) {
        QuizCompletion.belongsTo(models.User);
        QuizCompletion.belongsTo(models.Quiz);
        QuizCompletion.belongsTo(models.Course);
      }
    }
  });

  return QuizCompletion;

};