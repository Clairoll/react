'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    const Criticism = sequelize.define('criticism', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: false,
            defaultValue: 0,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'user_username',
            defaultValue: '',
            references: {
                model: 'User',
                key: 'username'
            }
        },
        replyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        replyName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: '',
        },
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false,
            defaultValue: '',
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
        tableName: 'criticism',
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
        indexes: [
            {}
        ]
    });
    Criticism.associate = function (models) {
        this.belongsTo(models['user'], {
            foreignKey: 'userId'
        });
    };
    return Criticism;
};
//# sourceMappingURL=criticism.js.map