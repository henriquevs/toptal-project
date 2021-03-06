import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { decamelize } from '@ember/string';

export default Route.extend({

  queryParams: {
    p: { refreshModel: true },
    startDatetime: { refreshModel: true },
    endDatetime: { refreshModel: true },
    startTime: { refreshModel: true },
    endTime: { refreshModel: true },
  },

  store: inject(),

  model(params) {
    let queryParams = this._buildQueryOptions(params);
    return {
      meals: this.get('store').query('meal', queryParams)
    }
  },

  _buildQueryOptions(params) {
    let queryParams = {};

    Object.keys(params).forEach(key => {
      queryParams[decamelize(key)] = params[key];
    });

    if (queryParams.p == undefined) {
      queryParams.p = 1;
    }

    return queryParams;
  },

  setupController(controller, model) {
    this._super(...arguments);

    let page = parseInt(controller.get('p')) || 1;

    if (page > 1) {
      controller.set('previousPage', page - 1);
    }
    controller.set('nextPage', page + 1);

  },

  actions: {
    deleteMeal(mealId) {
      console.log("delete!", mealId);
      let meal = this.get('store').peekRecord('meal', mealId);
      if (meal) {
        meal.deleteRecord();
        meal.save().then(() => {
          console.log("deleted mealId ", mealId);
        }).catch(e => {
          console.error(e);
          alert("something went wrong...");
        })
      }
    }
  }

});
