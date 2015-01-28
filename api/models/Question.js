'use strict';

module.exports = function(sequelize, DataTypes) {

  var Question = sequelize.define('Question', {
    body: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('short', 'multi'), allowNull: false }
  },
  {
    classMethods: {
      associate: function(models) {
        Question.belongsTo(models.Quiz);
        Question.hasMany(models.Answer, { onDelete: 'cascade' });
      }
    }
  });

  return Question;

};