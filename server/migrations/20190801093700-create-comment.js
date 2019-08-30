'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: '评论id'
      },
      userId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '评论人id'
      },
      replyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '回复评论id'
      },
      replyName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '回复评论用户名'
      },
      articleId: {
        type: Sequelize.INTEGER,
        field: 'article_id',
        allowNull: false,
        defaultValue: 0,
        comment: '评论文章id'
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: false,
        defaultValue: '',
        comment: '评论内容'
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '评论人'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    }, {
      tableName: 'comment',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      indexes: [
        {
          
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comment');
  }
};