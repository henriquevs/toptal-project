import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | meals/search', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:meals/search');
    assert.ok(route);
  });
});
