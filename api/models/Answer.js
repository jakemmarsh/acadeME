'use strict';

module.exports = function(sequelize, DataTypes) {

  var Answer = sequelize.define('Answer', {
    body: { type: DataTypes.STRING, allowNull: false },
    isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  {
    classMethods: {
      associate: function(models) {
        Answer.belongsTo(models.Question);
      }
    }
  });

  return Answer;

};