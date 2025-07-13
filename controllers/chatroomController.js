const { Chatroom, Message } = require('../models');
const redis = require('../cache/redisClient');
const geminiQueue = require('../queues/geminiQueue');

exports.createChatroom = async (req, res) => {
  try {
    const { name } = req.body;
    const existingRoomName = await Chatroom.findOne({where: {name: name}})
    if(existingRoomName){
        return res.status(400).send({ status: false, msg: 'Chatroom name already exist' })
    }
    const chatroom = await Chatroom.create({ name, UserId: req.userId });
    await redis.del(`chatrooms:${req.userId}`); // invalidate cache
    return res.status(200).json({ success: true, chatroom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listChatrooms = async (req, res) => {
  try {
    const key = `chatrooms:${req.userId}`;
    const cached = await redis.get(key);
    if (cached) return res.json({ success: true, chatrooms: JSON.parse(cached) });

    const chatrooms = await Chatroom.findAll({ where: { UserId: req.userId } });
    await redis.set(key, JSON.stringify(chatrooms), 'EX', 300); // 5 min TTL
    return res.status(200).json({ success: true, chatrooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatroomById = async (req, res) => {
  try {
    const chatroom = await Chatroom.findOne({
      where: { id: req.params.id, UserId: req.userId },
      include: [
        {
          model: Message,
          attributes: ['prompt', 'response'],
        }
      ]
    });
    if (!chatroom) return res.status(404).json({ success: false, message: 'Chatroom not found' });
    return res.status(200).json({ success: true, chatroom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.sendMessage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const chatroomId = req.params.id;

    const message = await Message.create({ prompt, ChatroomId: chatroomId });

    await geminiQueue.add('generate-reply', {
      messageId: message.id,
      prompt
    });

    return res.status(200).json({ success: true, message: 'Message received and queued', id: message.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
