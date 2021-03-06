from flask import g, request
from flask_restful import (
    abort,
    fields,
    marshal_with,
    Resource,

)

from app.auth import authorize
from app.models.meal import Meal


meal_resource_fields = {
    'id': fields.Integer,
    'owner_user_id': fields.Integer,
    'text': fields.String,
    'entry_datetime': fields.DateTime(dt_format='rfc822'),
    'calories': fields.Integer(attribute='calorie_count')
}


def update_meal(props, meal):
    # USER_UPDATEABLE_FIELDS = ['text', 'entry_datetime', 'calories']
    meal.text = props.get('text', meal.text)
    meal.entry_datetime = props.get('entry_datetime', meal.entry_datetime)
    meal.calorie_count = props.get('calories', meal.calorie_count)


class MealResource(Resource):

    method_decorators = [authorize]

    @marshal_with(meal_resource_fields, envelope='meal')
    def get(self, meal_id):

        meal = Meal.get_by_id(meal_id)

        if meal is None:
            abort(404)

        if meal.owner_user_id != g.user.id and not g.user.is_admin:
            abort(401)

        return meal

    @marshal_with(meal_resource_fields, envelope='meal')
    def put(self, meal_id):

        properties_to_update = request.get_json()
        if properties_to_update is None:
            abort(400)

        meal = Meal.get_by_id(meal_id)

        if meal is None:
            abort(404)

        if meal.owner_user_id != g.user.id and not g.user.is_admin:
            abort(401)

        props = properties_to_update['meal'].copy()
        props['calorie_count'] = props['calories']

        meal.update(**props)
        meal.save()

        return meal

    def delete(self, meal_id):

        meal = Meal.query.filter(
            Meal.id == meal_id
        ).one_or_none()

        if meal is None:
            abort(404)

        if meal.owner_user_id != g.user.id and not g.user.is_admin:
            abort(401)

        meal.delete()
        meal.save()

        return {}
