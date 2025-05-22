const cron = require('node-cron');
const { updateEnrollmentStatusCompleted } = require('../models/courseModel');

cron.schedule('* * * * *', async () => {
  try {
    await updateEnrollmentStatusCompleted();
  } catch (err) {
    console.error(err);
  }
});
