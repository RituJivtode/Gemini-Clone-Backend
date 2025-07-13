module.exports = (sequelize, DataTypes) => {
  const Chatroom = sequelize.define('Chatroom', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Chatroom.associate = models => {
    Chatroom.belongsTo(models.Users, { foreignKey: 'UserId' });
    Chatroom.hasMany(models.Message, { foreignKey: 'ChatroomId' });
  };

  return Chatroom;
};
