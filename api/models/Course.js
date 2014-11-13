'use strict';

module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
    title:       { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    imageUrl:    { type: DataTypes.STRING }
  },
  {
    classMethods: {
      associate: function(models) {
        Course.belongsTo(models.User);
        Course.hasMany(models.Lesson);
      }
    }
  });

  return Course;

};