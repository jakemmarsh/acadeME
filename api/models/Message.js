'use strict';

module.exports = function(sequelize, DataTypes) {

  var Message = sequelize.define('Message', {
    body:       { type: DataTypes.TEXT, allowNull: false },
    attachment: { type: DataTypes.TEXT }
  },
  {
    setterMethods: {
      attachment: function(value) {
        return this.setDataValue('attachment', JSON.stringify(value));
      }
    },
    getterMethods: {
      attachment: function() {
        if ( this.getDataValue('attachment') ) {
          return JSON.parse(this.getDataValue('attachment'));
        }
        return null;
      }
    },
    classMethods: {
      associate: function(models) {
        Message.belongsTo(models.Conversation);
        Message.belongsTo(models.User);
      }
    }
  });

  return Message;

};