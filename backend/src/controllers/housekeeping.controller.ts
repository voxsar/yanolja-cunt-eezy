import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { HousekeepingTask, Room, RoomType } from '../models';

export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority } = req.query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const tasks = await HousekeepingTask.findAll({
      where,
      include: [{
        model: Room,
        as: 'room',
        include: [{
          model: RoomType,
          as: 'roomType'
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await HousekeepingTask.findByPk(id, {
      include: [{
        model: Room,
        as: 'room',
        include: [{
          model: RoomType,
          as: 'roomType'
        }]
      }]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, assignedTo, priority, taskType, notes } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    const task = await HousekeepingTask.create({
      roomId,
      assignedTo,
      status: 'pending',
      priority: priority || 'medium',
      taskType: taskType || 'cleaning',
      notes
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await HousekeepingTask.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If task is being completed, update room housekeeping status
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();

      await Room.update(
        { housekeepingStatus: 'clean' },
        { where: { id: task.roomId } }
      );
    }

    await task.update(req.body);
    res.json({ task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await HousekeepingTask.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getHouseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const rooms = await Room.findAll({
      include: [{
        model: RoomType,
        as: 'roomType'
      }],
      order: [['roomNumber', 'ASC']]
    });

    // Group rooms by housekeeping status
    const statusCounts = {
      clean: 0,
      dirty: 0,
      inspected: 0,
      out_of_order: 0
    };

    rooms.forEach(room => {
      statusCounts[room.housekeepingStatus]++;
    });

    res.json({
      rooms,
      statusCounts,
      total: rooms.length
    });
  } catch (error) {
    console.error('Get house status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
