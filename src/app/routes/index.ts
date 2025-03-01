import express, { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import serviceController from '../controllers/service.controller';
import authController from '../controllers/auth.controller';
import movieController from '../controllers/movie.controller';
import { auth, upload, validateSchema } from '../middlewares';
import userSchema from '../validationSchemas/user.schema';
import movieSchema from '../validationSchemas/movie.schema';
import swaggerDocument from '../../../spec/swagger.json';

const usersRouter: Router = express.Router();
const moviesRouter: Router = express.Router();
const serviceRouter: Router = express.Router();

usersRouter
  .post('/signup', validateSchema({ body: userSchema.signup }), authController.signup)
  .post('/signin', validateSchema({ body: userSchema.signin }), authController.signin)
  .put('/refresh-token', validateSchema({ body: userSchema.refreshToken }), authController.renewToken)
  .delete('/logout', auth, authController.logout);

moviesRouter
  .use(auth)
  .post('/import', upload.multi, movieController.importMovies)
  .post('/', validateSchema({ body: movieSchema.createMovie }), movieController.create)
  .delete('/:id', validateSchema({ params: movieSchema.idParam }), movieController.remove)
  .patch('/:id', validateSchema({ params: movieSchema.idParam, body: movieSchema.updateMovie }), movieController.update)
  .get('/:id', validateSchema({ params: movieSchema.idParam }), movieController.show)
  .get('/', validateSchema({ query: movieSchema.listMovies }), movieController.list);

serviceRouter
  .get('/', serviceController.about);

const apiRouter = Router();
apiRouter.use('/v1/users', usersRouter);
apiRouter.use('/v1/movies', moviesRouter);

const mainRouter: Router = Router();
mainRouter.use('/api', apiRouter);
mainRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
mainRouter.use(serviceRouter);

export default mainRouter;
