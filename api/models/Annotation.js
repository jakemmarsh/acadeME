'use strict';

module.exports = function(sequelize, DataTypes) {

  var Annotation = sequelize.define('Annotation', {
    text: { type: DataTypes.TEXT, allowNull: false },
    xPos: { type: DataTypes.FLOAT },
    yPos: { type: DataTypes.FLOAT }
  },
  {
    classMethods: {
      associate: function(models) {
        Annotation.belongsTo(models.Attachment);
        Annotation.belongsTo(models.User);
      }
    }
  });

  return Annotation;

};