'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('friend', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: '友链id'
      },
      img: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '友链图片'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '友链名'
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment: '友链地址'
      },
      content: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '友链简介'
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
      tableName: 'friend',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
      indexes: [
        {
          
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('friend');
  }
};