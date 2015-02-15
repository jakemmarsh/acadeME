'use strict';

module.exports = function(sequelize, DataTypes) {

  var Attachment = sequelize.define('Attachment', {
    name: { type: DataTypes.STRING, allowNull: false },
    url:  { type: DataTypes.STRING, allowNull: false }
  },
  {
    classMethods: {
      associate: function(models) {
        Attachment.hasMany(models.Annotation, { onDelete: 'cascade' });
      }
    }
  });

  return Attachment;

};