var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load);  //autoload :quizId
router.param('commentId', commentController.load);  //autoload :commentId

//Definicion de rutas de sesion
router.get('/login', sessionController.new); //formulario login
router.post('/login', sessionController.create); //crear session
router.get('/logout', sessionController.destroy); //destruir sesion

//Definicion de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizld(\\d+)', quizController.show);
router.get('/quizes/:quizld(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizld(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizld(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizld(\\d+)', sessionController.loginRequired, quizController.destroy);

// Definicion de rutas de comentario
router.get('/quizes/:quizld(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizld(\\d+)/comments', commentController.create);
router.get('/quizes/:quizld(\\d+)/comments/:commentId(\\d+)/publish',
sessionController.loginRequired, commentController.publish);

//Definicion de la ruta de autor
router.get('/author', function(req,res){
	res.render('author');
});

module.exports = router;
