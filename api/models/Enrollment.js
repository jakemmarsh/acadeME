'use strict';

module.exports = function(sequelize) {

  var Enrollment = sequelize.define('Enrollment', {},
  {
    methods: {
      associate: function(models) {
        Enrollment.belongsTo(models.User);
        Enrollment.belongsTo(models.Course);
      }
    }
  });

  return Enrollment;

};