'use strict';

module.exports = function(sequelize, DataTypes) {

  var Lesson = sequelize.define('Lesson', {
    title:        { type: DataTypes.STRING, allowNull: false },
    description:  { type: DataTypes.TEXT },
    bodyElements: { type: DataTypes.TEXT, defaultValue: '[]', allowNull: false },
    imageUrl:     { type: DataTypes.STRING }
  },
  {
    setterMethods: {
      bodyElements: function(value) {
        return this.setDataValue('bodyElements', JSON.stringify(value));
      }
    },
    getterMethods: {
      bodyElements: function() {
        if ( this.getDataValue('bodyElements') ) {
          return JSON.parse(this.getDataValue('bodyElements'));
        }
        return null;
      }
    },
    classMethods: {
      associate: function(models) {
        Lesson.belongsTo(models.Course);
        Lesson.hasOne(models.Quiz, { onDelete: 'cascade' });
      }
    }
  });

  return Lesson;

};