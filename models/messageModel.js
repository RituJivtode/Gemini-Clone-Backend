module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  Message.associate = models => {
    Message.belongsTo(models.Chatroom, { foreignKey: 'ChatroomId' });
  };

  return Message;
};
