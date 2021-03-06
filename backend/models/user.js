'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({  }) {

      // define association here
      // models.User.hasMany(models.Post, {
      //   foreignKey: {
      //     allowNull :false
      //   }
      // })
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined }
    }
  };
  User.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User'
  });
  return User;
};