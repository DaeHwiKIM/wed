const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// 정적 파일을 제공하는 미들웨어
app.use(express.static(path.join(__dirname, "public")));

// '/' 라우트 핸들러
app.get("/", function (요청, 응답) {
  let result = doSomeCalculation(); // doSomeCalculation은 개발자가 정의한 함수입니다.
  응답.send("Calculation result is " + result);
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});