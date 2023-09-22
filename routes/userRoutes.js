const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
// //이렇게 app이 들어갈 요소에 해당 변수를 넣을 수 있음, 하지만 이 router을 우리 application이랑 연결해야하는데 그럴 때 미들웨어를 사용해야 함, 아래 코드, 서브웹이라고 할 수 있음

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
