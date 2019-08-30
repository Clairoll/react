'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('criticism', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: '留言id'
      },
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        allowNull: false,
        defaultValue: 0,
        comment: '留言用户id'
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'user_username',
        defaultValue: '',
        comment: '留言用户名'
      },
      replyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '回复留言id'
      },
      replyName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
        comment: '回复留言用户名'
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: false,
        defaultValue: '',
        comment: '留言内容'
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
      tableName: 'criticism',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      indexes: [
        {
          
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('criticism');
  }
};