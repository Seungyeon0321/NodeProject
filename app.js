const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MiDDLEWARE
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//dotenv.config는 한번밖에 happen 안되기 때문에 그래서 process로 접근이 가능하다, 어떤 파일 안에 있다고 해도

//이건 미들 웨어다 - a function that can modify the incoming request data, 이 미들 웨어가 없으면 post 파일이 undefined 결과값을 받는다
app.use(morgan('dev'));
app.use(express.json());

//미들 웨어 중에서 html, 즉 public폴더에 저장되어있는 html파일에 접근할 수 있게 해주는 역할을 하는 녀석이 있다 (access static file)
app.use(express.static(`${__dirname}/public`));

//미들웨어 만들기
//next가 없으면 middle웨어는 stuck 해버리기 때문에 절대로 잊어먹어서는 안된다
//아무 router을 set하지 않으면 모든 get, post와 같은 라우터에도 동작하게 된다

// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

//미들웨어는 이렇게 요청을 받고 응답을 하는 과정에서 새로운 데이터를 넣을 수 있다는 말인가? 그래서 효과적이라는 말인가
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello form the server side!', app: 'Natours' });
//   //express 이용하면 header의 content type을 굳이 안 정해줘도 된다
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

//여기 top 레벨에서 파일을 읽어오는 시점에서 JSON을 parse한다
////////////데이터 읽기////////////////

///////////데이터 응답하기///////////////// Router handler
//여기서의 json()은 실제 JSON 파일을 parsing하지 못하고 객체를 JSON형식의 문자열로 변환만 해주는 역활을 하기 때문에 저렇게 한번 파싱하는 작업이 필요로 하는 것이다

//해당 작업이 반복되기 때문에 함수로 하나 따로 만들어서 집어넣는다

// app.get('/api/v1/tours', getAllTours);

//여기 url tours뒤에 아무것도 안 오게 되면 저 params를 catch하지 못한다, 저 params를 가르키는 url는 아무거나 넣어도 상관없다 대신 ':' 를 붙이는 것을 잊으면 안된다, params라고 알려주는 장치같은 느낌임, 만약 뒤에 ?를 붙이면 optional이 될 수 있다, 있을 수도 있고 없을 수도 있는 느낌임, :붙은 뒤에 녀석이 params가 된다, 위에 getTour 함수 참조
// app.get('/api/v1/tours/:id', getTour);

//이렇게 보면 앞에 http의 method만 바뀌고 저 url은 똑같기 때문에 정말 편리하게 작업을 할 수 있다
// app.post('/api/v1/tours', postTours);

// app.patch('/api/v1/tours/:id', patchTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//이렇게 route를 쓰게 되면 위에 있는 모든 app 이하의 동작들을 체인할 수 있다

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//////////////// 4) start server

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// 여기서 push를 통해 새로운 데이터(newTour)를 tours 배열에 추가하고, 동시에 fs.writeFile를 사용하여 파일에 데이터를 쓰는 것은 두 가지 다른 동작입니다.

// push: push 메소드를 사용하여 새로운 데이터를 tours 배열에 추가하면, 이 데이터는 현재 서버의 메모리에만 저장됩니다. 이것은 서버의 실행 중인 프로세스에서만 유지되며, 서버를 다시 시작하거나 종료하면 데이터가 사라질 수 있습니다. 이렇게 메모리에만 저장된 데이터는 일반적으로 실시간으로 변경되는 데이터나 일시적인 데이터에 사용됩니다.

// fs.writeFile: fs.writeFile를 사용하여 데이터를 파일에 쓰면, 데이터는 영구적으로 파일 시스템에 저장됩니다. 이 파일은 서버가 종료되더라도 데이터가 유지되고, 서버 재시작 시에도 파일에서 데이터를 읽어올 수 있습니다. 이것은 주로 서버 데이터의 영구적인 저장이 필요한 경우에 사용됩니다.

// 따라서 여기에서는 새로운 데이터를 메모리에 추가하고 동시에 파일 시스템에도 쓰는 것으로, 새로운 데이터가 실시간으로 서버 메모리에 추가되면서 동시에 파일로 저장되어 영구적으로 보존됩니다. 이렇게 하면 데이터의 일관성과 영구성을 유지할 수 있습니다.

module.exports = app;
