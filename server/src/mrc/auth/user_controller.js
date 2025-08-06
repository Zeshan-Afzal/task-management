import user_service from "./user_service.js";

export const signUp = async (req, res, next) => {
  const { email, password, name } = req.body;
console.log(req.body);

  try {
    const result = await user_service.createUser({ email, name, password });

    res.status(201).json({
      message: 'User created successfully',
      ...result,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const result = await user_service.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const result = await user_service.logout(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const result = await user_service.updateUser( req.body);
    res.status(200).json({ user: result });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const result = await user_service.updatePassword( req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateEmail = async (req, res, next) => {
  try {
    const result = await user_service.updateEmail( req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};