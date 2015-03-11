'use strict';

module.exports = function(sequelize) {

  var Enrollment = sequelize.define('Enrollment', {},
  {
    methods: {
      associate: function(models) {
        Enrollment.belongsTo(models.Course, { as: 'Enrollments' });
        Enrollment.belongsTo(models.User, { as: 'User' });
      }
    }
  });

  return Enrollment;

};