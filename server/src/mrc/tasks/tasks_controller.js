import task_service from "./task_service.js";

export const createTask = async (req, res, next) => {
  try {
    const result = await task_service.createTask(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const result = await task_service.getTasks(req.user.id, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const result = await task_service.updateTask(req.user.id, req.params.taskId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await task_service.deleteTask(req.user.id, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const result = await task_service.getTaskById(req.user.id, req.params.taskId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};