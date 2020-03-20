require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  const cookieIngredients = [{
    name: 'flour',
    amount: 2,
    measurement: 'cup',
  },
  {
    name: 'sugar',
    amount: .5,
    measurement: 'cup',
  },
  {
    name: 'butter',
    amount: 6,
    measurement: 'tablespoon',
  }];

  // POST
  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: cookieIngredients
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            _id: expect.any(String),
            name: 'flour',
            amount: 2,
            measurement: 'cup',
          },
          {
            _id: expect.any(String),
            name: 'sugar',
            amount: .5,
            measurement: 'cup',
          },
          {
            _id: expect.any(String),
            name: 'butter',
            amount: 6,
            measurement: 'tablespoon',
          }],
          __v: 0
        });
      });
  });

  // GET ALL
  it('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ]);

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name
          });
        });
      });
  });

  // GET ONE
  it('gets a specific recipe', async() => {
    const recipe = await Recipe.create({ name: 'cookies', directions: [], ingredients: [] });

    return request(app)
      .get(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: recipe._id.toString(),
          name: 'cookies',
          directions: [],
          ingredients: [],
          __v: 0
        });
      });
  });

  // PATCH
  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: []
    });

    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [],
          __v: 0
        });
      });
  });

  // DELETE
  it('deletes a specific recipe', async() => {
    const recipe = await Recipe.create({ name: 'cookies', directions: [], ingredients: [] });

    return request(app)
      .delete(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: recipe._id.toString(),
          name: 'cookies',
          directions: [],
          ingredients: [],
          __v: 0
        });
      });
  });

});
