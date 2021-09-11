'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
const post = require('./post')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate( { User, post }) {
      this.belongsTo(User, { foreignKey:'userId', as: 'user'})
      this.belongsTo(post, {foreignKey: "postId", as: "post"})
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
  Comment.init({
    signal: {
      type: DataTypes.BOOLEAN,
      defaultValues: false
    },
    uuidComment: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    message: {
      type:DataTypes.TEXT,
      allowNull: false,
    }
    
  }, {
    sequelize,
    tableName: 'comments',
    modelName: 'comment'
  });
  return Comment;
};