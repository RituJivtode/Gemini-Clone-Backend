module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subscriptionTier: {
      type: DataTypes.ENUM('BASIC', 'PRO'),
      defaultValue: 'BASIC'
    }
  });

  Users.associate = models => {
    Users.hasMany(models.Chatroom, { foreignKey: 'UserId' });
  };

  return Users;
};
