import express from 'express';

const router = express.Router();

router.post('/sign-up', (req, res) => {
  res.status(200).send('POST /api/sign-up response');
});
router.post('/sign-in', (req, res) => {
  res.status(200).send('POST /api/sign-in response');
});
router.post('/sign-out', (req, res) => {
  res.status(200).send('POST /api/sign-out response');
});

export default router;
