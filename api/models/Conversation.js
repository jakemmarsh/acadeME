'use strict';

module.exports = function(sequelize) {

  var Conversation = sequelize.define('Conversation', {},
  {
    classMethods: {
      associate: function(models) {
        Conversation.belongsTo(models.Course);
        Conversation.belongsTo(models.User, { as: 'UserOne' });
        Conversation.belongsTo(models.User, { as: 'UserTwo' });
        Conversation.hasMany(models.Message);
      }
    }
  });

  return Conversation;

};