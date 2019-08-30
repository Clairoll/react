'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define('article', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: false,
            defaultValue: 0,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        desc: {
            type: DataTypes.TEXT(),
            allowNull: true,
        },
        read: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        innocuous: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            field: 'category_id',
            allowNull: false,
            defaultValue: 0,
            references: {
                model: 'category',
                key: 'id'
            }
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },
        content: {
            type: DataTypes.TEXT('medium'),
            allowNull: false,
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
        tableName: 'article',
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
        indexes: [
            {}
        ]
    });
    Article.associate = function (models) {
        this.belongsTo(models['user'], {
            foreignKey: 'userId'
        });
        this.belongsTo(models['category'], {
            foreignKey: 'categoryId'
        });
        this.hasMany(models['comment']);
    };
    return Article;
};