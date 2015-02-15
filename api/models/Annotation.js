'use strict';

module.exports = function(sequelize, DataTypes) {

  var Annotation = sequelize.define('Annotation', {
    body: { type: DataTypes.TEXT, allowNull: false },
    xPos: { type: DataTypes.INTEGER },
    yPos: { type: DataTypes.INTEGER }
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