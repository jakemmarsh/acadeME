'use strict';

module.exports = function(sequelize) {

  var Conversation = sequelize.define('Conversation', {},
  {
    classMethods: {
      associate: function(models) {
        Conversation.belongsTo(models.Course);
        Conversation.hasMany(models.User);
        Conversation.hasMany(models.Message);
      }
    }
  });

  return Conversation;

};