import router from '@adonisjs/core/services/router'
const HomeController = () => import('#controllers/home_controller')
const EstimateController = () => import('#controllers/estimate_controller')

router.get('/', [HomeController, 'index'])
router.get('/estimate', [EstimateController, 'index'])
router.post('/estimate', [EstimateController, 'getPredictedPrice'])
