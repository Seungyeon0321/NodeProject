const express = require('express');
const tourControllerWithDB = require('../controllers/tourControllerWithDB');

const authController = require('../controllers/authController');
const router = express.Router();

//이렇게 미들웨어를 이용해서 아이디를 받아올 수 있다, pipeline

// router.param('id', tourController.checkID);

//Create a checkBody middleware
//Check if body contains the name and price property
//If not, send back 400 (bad request)
//Add it to the post handler stack

//만약 5개의 가장 싼 투어를 고르고 싶을 때는 이렇게 모든 tours의 data를 가지고 가지만 5개를 선별해줄 로직을 미들웨어로 가지고 오면 된다
router
  .route('/top-5-cheap')
  .get(tourControllerWithDB.aliasTopTours, tourControllerWithDB.getAllTours);

router.route('/tour-status').get(tourControllerWithDB.getTourStats);
router.route('/monthly-plan/:year').get(tourControllerWithDB.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourControllerWithDB.getAllTours)
  .post(tourControllerWithDB.createTours);
// .post(tourController.checkBody, tourController.postTours); <-- 미들 웨어 사용했을 때 코드
//이미 미들웨어에서 /api/v1/tours로 동작하기 때문에 이 부분에서는 '/'가 들어가야함
//여기에 getAllTours보다 먼저 authController 미들웨어가 들어가는 이유는
//로그인을 하고 안하고의 유무에 따라, 그 로그인한 유저의 투어를 받아야하기
//때문에 해당 getAllTours보다 먼저 동작해야 한다.

router
  .route('/:id')
  .get(tourControllerWithDB.getTour)
  .patch(tourControllerWithDB.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllerWithDB.deleteTour,
  );
//delete를 하려면 해당 유저가 'amin' 아니면 lead-guide의 role이여야 가능하다,
//protect가 먼저여야 함

module.exports = router;
