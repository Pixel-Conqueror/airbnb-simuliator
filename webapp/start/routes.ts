import router from '@adonisjs/core/services/router'
const HomeController = () => import('#controllers/home_controller')
const CreatesController = () => import('#controllers/creates_controller')

router.get('/', [HomeController, 'index'])
router.get('/create', [CreatesController, 'index'])
