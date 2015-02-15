'use strict';

module.exports = function(sequelize, DataTypes) {

  var Message = sequelize.define('Message', {
    body:       { type: DataTypes.TEXT, allowNull: false }
  },
  {
    classMethods: {
      associate: function(models) {
        Message.belongsTo(models.Conversation);
        Message.belongsTo(models.User);
        Message.hasOne(models.Attachment, { onDelete: 'cascade' });
      }
    }
  });

  return Message;

};