import app from './app.js';
import { ENVIRONMENT } from './config/environment.js';
import { checkDatabaseConnection } from './config/database.js';

const startServer = async (): Promise<void> => {
  // Verificar la conexión a la base de datos antes de iniciar
  await checkDatabaseConnection();

  app.listen(ENVIRONMENT.PORT, () => {
    console.log(`🚀 [UrbanRent Backend] Servidor ejecutándose en http://localhost:${ENVIRONMENT.PORT}`);
  });
};

startServer();