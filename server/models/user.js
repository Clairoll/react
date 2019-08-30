'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        username: {
            type: DataTypes.STRING(50),
            unique: false,
            allowNull: false,
            defaultValue: ''
        },
        avator: {
          type: DataTypes.STRING(150),
          allowNull: true,
          defaultValue: ''
      },
        password: {
            type: DataTypes.CHAR(32),
            unique: true,
            allowNull: false,
            defaultValue: '',
        },
        mobile: {
            type: DataTypes.CHAR(12),
            unique: true,
            allowNull: false,
            defaultValue: ''
        },
        email: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
            defaultValue: ''
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }, {
        tableName: 'user',
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
        indexes: [
            {}
        ],
    });
    User.associate = function (models) {
        this.hasMany(models['criticism']);
        this.hasMany(models['article']);
        this.hasMany(models['comment']);
    };
    return User;
};
//# sourceMappingURL=user.js.map