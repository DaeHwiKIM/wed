const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// doSomeCalculation 함수 정의
function doSomeCalculation() {
  // 여기에 계산 로직을 작성하세요.
  // 이 예시에서는 단순히 10을 반환하도록 합니다.
  return 10;
}

// 정적 파일을 제공하는 미들웨어
app.use(express.static(path.join(__dirname, "public")));

// '/calculation' 라우트 핸들러
app.get("/calculation", function (요청, 응답) {
  let result = doSomeCalculation(); // doSomeCalculation은 개발자가 정의한 함수입니다.
  응답.send("Calculation result is " + result);
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
