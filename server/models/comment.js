"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "comment",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        type: DataTypes.INTEGER
      },
      replyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      replyName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: ""
      },
      articleId: {
        type: DataTypes.INTEGER,
        field: "article_id",
        allowNull: false,
        defaultValue: 0,
        references: {
          model: "article",
          key: "id"
        }
      },
      content: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue: ""
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: ""
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "updated_at"
      }
    },
    {
      tableName: "comment",
      charset: "utf8mb4",
      collate: "utf8mb4_bin",
      indexes: [{}]
    }
  );
  Comment.associate = function(models) {
    this.belongsTo(models["article"], {
      foreignKey: "articleId"
    });
  };
  return Comment;
};
//# sourceMappingURL=comment.js.map
