'use strict';

module.exports = function(sequelize, DataTypes) {

  var Lesson = sequelize.define('Lesson', {
    title:        { type: DataTypes.STRING, allowNull: false },
    description:  { type: DataTypes.TEXT },
    bodyElements: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false },
    imageUrl:     { type: DataTypes.STRING }
  },
  {
    setterMethods: {
      bodyElements: function(value) {
        var description = this.getDataValue('description');

        this.setDataValue('bodyElements', value);

        if ( !description || !description.length ) {
          this.setDataValue('description', value[0].substr(0, 200) + '...');
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