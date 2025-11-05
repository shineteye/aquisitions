import logger from '../config/logger.js';
import { formatValidationError } from '../utils/format.js';
import { signUpSchema } from '../validations/auth.validation.js';

export const signUp = async (req, res, next) => {
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
    const { name, email, role } = validationResult.data;

    // AUTH SERVICE

    logger.info(`User registered Succeefully: ${email}`);

    res.status(201).json({
      message: 'User registered',
      user: {
        id: 1,
        name: name,
        email: email,
        role,
      },
    });
  } catch (error) {
    logger.error('Signup error', error);

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already exist' });
    }
  }
};
