'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('article', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: '文章id'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '文章标题'
      },
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        allowNull: false,
        defaultValue: 0,
        comment: '文章发表者的id'
      },
      desc: {
        type: Sequelize.TEXT(),
        allowNull: true,
        comment: '文章简介'
      },
      read: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '阅读量'
      },
      innocuous: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '点赞量'
      },
      categoryId: {
        type: Sequelize.INTEGER,
        field: 'category_id',
        allowNull: false,
        defaultValue: 0,
        comment: '所属分类'
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
        comment: '文章图片'
      },
      content: {
        type: Sequelize.TEXT('medium'),
        allowNull: false,
        
        comment: '文章内容'
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
      tableName: 'article',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      indexes: [
        {
          
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('article');
  }
};