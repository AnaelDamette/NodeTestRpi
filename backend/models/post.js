'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
const comments = require('./comment')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate( { User, comment }) {
      this.belongsTo(User, { foreignKey:'userId', as: 'user'})
      this.hasMany(comment, {foreignKey: 'postId', as: 'comment'})
      // define association here
      //models.User.hasMany(models.post)
      // models.Post.belongsTo(models.User, {
      //   foreignKey: {
      //     allowNull :false
      //   }
      // });
    }
    toJSON(){
      return { ...this.get(), id: undefined, userId: undefined }
    }
  };
  Post.init({
    signal: {
      type: DataTypes.BOOLEAN,
      defaultValues: false
    },
    uuidPost: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    titre: {
      type: DataTypes.STRING,
      allowNull : false,
    },
    message: {
      type:DataTypes.TEXT,
      allowNull: false,
    },
    attachement: {
      type: DataTypes.STRING,
    }
    
  }, {
    sequelize,
    tableName: 'posts',
    modelName: 'post'
  });
  return Post;
};