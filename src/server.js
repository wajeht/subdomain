import { app } from './app.js';
import { env } from './conifg/env.js';
import { logger } from './utils/logger.js';
import cp from 'child_process';

const server = app.listen(env.port, async () => {
	logger.info(`Server was started on http://localhost:${env.port}`);

	if (env.env === 'development') {
		cp.exec('npm run build:tailwind:colors', (err, stdout, stderr) => {
			if (err) logger.error(err);
			if (stdout) logger.info(stdout.toString());
			if (stderr) logger.info(stdout.toString());
		});
	}
});

function gracefulShutdown() {
	logger.info('Received kill signal, shutting down gracefully.');
	server.close(() => {
		logger.info('HTTP server closed.');
		process.exit(0);
	});
}

process.on('SIGINT', gracefulShutdown);

process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection at: ', promise, ' reason: ', reason);
});
