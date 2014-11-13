'use strict';

module.exports = function(sequelize, DataTypes) {

  var Lesson = sequelize.define('Lesson', {
    title:       { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    body:        { type: DataTypes.TEXT, allowNull: false },
    imageUrl:    { type: DataTypes.STRING }
  },
  {
    classMethods: {
      associate: function(models) {
        Lesson.belongsTo(models.Course);
      }
    }
  });

  return Lesson;

};