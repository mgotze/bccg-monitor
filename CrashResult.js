const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const CrashResult = sequelize.define('CrashResult', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roundId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  crashPoint: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = CrashResult;
