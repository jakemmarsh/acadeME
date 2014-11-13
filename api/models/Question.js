'use strict';

module.exports = function(sequelize, DataTypes) {

  var Question = sequelize.define('Question', {
    body: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.enum('short', 'multi'), allowNull: false }
  },
  {
    classMethods: {
      associate: function(models) {
        Question.belongsTo(models.Quiz);
        Question.hasMany(models.Answer);
      }
    }
  });

  return Question;

};