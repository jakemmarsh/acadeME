'use strict';

module.exports = function(sequelize, DataTypes) {

  var MessageMedia = sequelize.define('MessageMedia', {
    url: { type: DataTypes.STRING, allowNull: false }
  },
  {
    classMethods: {
      associate: function(models) {
        MessageMedia.belongsTo(models.Message, { as: 'Media' });
      }
    }
  });

  return MessageMedia;

};