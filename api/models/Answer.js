'use strict';

module.exports = function(sequelize, DataTypes) {

  var Answer = sequelize.define('Answer', {
    body: { type: DataTypes.STRING, allowNull: false },
    isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  {
    classMethods: {
      associate: function(models) {
        Answer.belongsTo(models.Question);
      }
    },
    instanceMethods: {
      toJSON: function() {
        // Delete private values from object before sending to client
        var res = this.get();
        delete res.isCorrect;
        return res;
      }
    }
  });

  return Answer;

};