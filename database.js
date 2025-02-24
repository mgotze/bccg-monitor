database.jsconst { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // arquivo do banco local
});

module.exports = sequelize;

