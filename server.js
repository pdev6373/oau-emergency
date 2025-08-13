require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const getRoutes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/dbConnection');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'OAU Emergency API',
      version: '0.1.0',
      description:
        'This is OAU Emergency API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: 'https://oau-emergency.onrender.com',
      },
      {
        url: 'http://localhost:3500',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('common'));
app.use('/api/v1', getRoutes());

app.all('*', (_, res) => {
  res.status(404).json({ success: false, message: 'Route not available' });
});

mongoose.connection.once('open', () => {
  app.listen(PORT, () =>
    console.log(`⚡️[server]: Server is running on port: ${PORT}`),
  );
});
mongoose.connection.on('error', (err) => console.error(err));
