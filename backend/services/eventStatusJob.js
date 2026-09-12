const cron = require('node-cron');
const { prisma } = require('../config/db');

const jobKey = Symbol.for('club-event-manager.event-status-job');

const updateEventStatuses = async () => {
  const now = new Date();
  const fallbackCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const ongoingResult = await prisma.event.updateMany({
    where: {
      status: 'UPCOMING',
      startAt: { lte: now },
      OR: [{ endAt: null }, { endAt: { gt: now } }],
    },
    data: { status: 'ONGOING' },
  });

  const completedResult = await prisma.event.updateMany({
    where: {
      status: { in: ['UPCOMING', 'ONGOING'] },
      OR: [
        { endAt: { not: null, lte: now } },
        { endAt: null, startAt: { lt: fallbackCutoff } },
      ],
    },
    data: { status: 'COMPLETED' },
  });

  console.log(`Status job: ${ongoingResult.count} -> ONGOING, ${completedResult.count} -> COMPLETED`);
};

const startEventStatusJob = () => {
  if (globalThis[jobKey]) return globalThis[jobKey];

  const task = cron.schedule('*/5 * * * *', () => {
    updateEventStatuses().catch((error) => {
      console.error('Status job failed:', error);
    });
  });

  globalThis[jobKey] = task;
  updateEventStatuses().catch((error) => {
    console.error('Initial status job failed:', error);
  });
  return task;
};

module.exports = { startEventStatusJob, updateEventStatuses };