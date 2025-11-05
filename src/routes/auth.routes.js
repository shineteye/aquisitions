import express from 'express';
import { signUp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', (req, res) => {
  res.status(200).send('POST /api/sign-in response');
});
router.post('/sign-out', (req, res) => {
  res.status(200).send('POST /api/sign-out response');
});

export default router;
