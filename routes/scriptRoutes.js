import express from 'express';
const router = express.Router();

import {
  createScript,
  exportScripts,
  updateScript,
} from '../controllers/scriptController.js'

import testUser from '../middleware/testUser.js';

router.route('/').post(testUser, createScript);
// Export scripts based on job ID (crNumber)
router.route('/export').get(testUser, exportScripts);
router.route('/update').put(testUser, updateScript);

export default router;
