import ErrorHandler from "../../utils/error_hanlder.js";
import Task from "./task_model.js";

class TaskService {
   async createTask(userId, data) {
    console.log(data);
    
    const { title, description, status, priority, dueDate } = data;
    if (!title?.trim() || !description?.trim() || !dueDate?.trim()) {
      throw new ErrorHandler(
          "Title, description, and due date are required.",
          400,
      );
    }

    const task = Task.create({
      ...data,
      user: userId,
    });
    if(!task) throw new ErrorHandler("Error adding Task", 500)

    return await task
  }

   async getTasks(userId, queryOptions) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
      priority,
      dueBefore,
      dueAfter,
      search,
    } = queryOptions;

    const filter = { user: userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (dueBefore || dueAfter) filter.dueDate = {};
    if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
    if (dueAfter) filter.dueDate.$gte = new Date(dueAfter);
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    return {
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update task with validation
 async updateTask(userId, taskId, updates) {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw new ErrorHandler( "Task not found or access denied." , 400);
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
    ];
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        task[key] = updates[key];
      }
    });

    task.updatedAt = new Date();
    return await task.save();
  }

  // Delete task
   async deleteTask(userId, taskId) {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw new ErrorHandler( "Task not found or access denied." , 404);
    }

    await Task.deleteOne({ _id: taskId });
    return { message: "Task deleted successfully." };
  }

   async getTaskById(userId, taskId) {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw new ErrorHandler( "Task not found or access denied." , 404);
    }
    return task;
  }
}

export default new TaskService();
