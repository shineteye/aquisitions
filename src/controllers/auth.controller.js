import logger from '../config/logger.js';
import { createUser, authenticateUser } from '../services/auth.service.js';
import { cookies } from '../utils/cookies.js';
import { formatValidationError } from '../utils/format.js';
import { jwtToken } from '../utils/jwt.js';
import { signUpSchema, signInSchema } from '../validations/auth.validation.js';

export const signUp = async (req, res, _next) => {
  try {
    // We perform validation checks
    const validationResult = signUpSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }

    // if everything checks out we then destructure the data from the frontend and then we can go ahead to use it
    const { name, email, password, role } = validationResult.data;

    // AUTH SERVICE
    const user = await createUser({ name, email, password, role });

    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User registered Succeefully: ${email}`);

    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Signup error', error);

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already exist' });
    }
  }
};

export const signIn = async (req, res, _next) => {
  try {
    // Validate input
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    // Authenticate user
    const user = await authenticateUser({ email, password });

    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User signed in successfully: ${email}`);

    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Sign-in error', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    if (error.message === 'Invalid password') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const signOut = async (req, res, _next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out successfully');

    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (error) {
    logger.error('Sign-out error', error);

    return res.status(500).json({ error: 'Internal server error' });
  }
};
