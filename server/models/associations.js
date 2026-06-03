const User = require('./User');
const Car = require('./Car');
const Review = require('./Review');

// User has many Cars
User.hasMany(Car, {
  foreignKey: 'sellerId',
  as: 'cars'
});

// Car belongs to User (Seller)
Car.belongsTo(User, {
  foreignKey: 'sellerId',
  as: 'seller'
});

// User has many Reviews
User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews'
});

// Car has many Reviews
Car.hasMany(Review, {
  foreignKey: 'carId',
  as: 'reviews'
});

// Review belongs to User
Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Review belongs to Car
Review.belongsTo(Car, {
  foreignKey: 'carId',
  as: 'car'
});

module.exports = {
  User,
  Car,
  Review
};