'use strict';

module.exports = function(sequelize, DataTypes) {

  var Lesson = sequelize.define('Lesson', {
    title:       { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    body:        { type: DataTypes.TEXT, allowNull: false },
    imageUrl:    { type: DataTypes.STRING }
  },
  {
    setterMethods: {
      body: function(value) {
        var description = this.getDataValue('description');

        this.setDataValue('body', value);

        if ( !description || !description.length ) {
          this.setDataValue('description', value.substr(0, 200) + '...');
        }
      }
    },
    classMethods: {
      associate: function(models) {
        Lesson.belongsTo(models.Course);
      }
    }
  });

  return Lesson;

};