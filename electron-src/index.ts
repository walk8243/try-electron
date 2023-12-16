import { app } from 'electron';
import log from 'electron-log/main';
import { main } from './main';

log.initialize({ preload: true });
log.eventLogger.startLogging({});

app.on('ready', () => {
	log.verbose('App is ready');
	main();
});

app.on('window-all-closed', app.quit);
