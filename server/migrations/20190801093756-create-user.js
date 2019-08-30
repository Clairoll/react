'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: '用户id'
      },
      disabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '用户权限'
      },
      username: {
        type: Sequelize.STRING(50),
        unique: false,
        allowNull: false,
        defaultValue: '',
        comment: '用户名'
      },
      avator: {
        type: Sequelize.STRING(150),
        allowNull: true,
        defaultValue: '',
        comment: '头像'
      },
      password: {
        type: Sequelize.CHAR(32),
        allowNull: false,
        defaultValue: '',
        comment: '密码'
      },
      mobile: {
        type: Sequelize.CHAR(12),
        unique: true,
        allowNull: false,
        defaultValue: '',
        comment: '手机号/账号'
      },
      email: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
        defaultValue: '',
        comment: '邮箱'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        comment: '用户注册时间'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
        comment: '用户最新一次登录时间'
      }
    }, {
      tableName: 'user',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      indexes: [
        {
          
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};