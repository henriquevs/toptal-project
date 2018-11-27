import DS from 'ember-data';
const { attr } = DS;

export default DS.Model.extend({
  email: attr('string'),
  password: attr('string'),
  name: attr('string'),
  deleted: attr('boolean')
});