// 페이지 로드 시 #state 아래에 BMI 게이지 바 구조 자동 삽입
document.addEventListener("DOMContentLoaded", () => {
  const stateEl = document.getElementById("state");
  const gaugeHTML = `
    <div class="bmi-gauge-wrap" id="bmiGauge">
      <div class="bmi-pointer" id="bmiPointer"></div>
      <div class="bmi-bar">
        <div class="bmi-seg under">저체중</div>
        <div class="bmi-seg normal">정상</div>
        <div class="bmi-seg overweight">과체중</div>
        <div class="bmi-seg obesity">비만</div>
      </div>
      <div class="bmi-ticks">
        <span class="t-18">18.5</span>
        <span class="t-23">23</span>
        <span class="t-25">25</span>
      </div>
    </div>
  `;
  stateEl.insertAdjacentHTML("afterend", gaugeHTML);
});

function calculateBMI() {
  const heightVal = parseFloat(document.getElementById("height").value);
  const weightVal = parseFloat(document.getElementById("weight").value);
  const resultEl = document.getElementById("result");
  const stateEl = document.getElementById("state");
  const gaugeEl = document.getElementById("bmiGauge");
  const pointerEl = document.getElementById("bmiPointer");

  if (!heightVal || !weightVal || heightVal <= 0 || weightVal <= 0) {
    alert("키와 몸무게를 올바르게 입력해주세요.");
    return;
  }

  const heightM = heightVal / 100;
  const bmi = weightVal / (heightM * heightM);
  const bmiFixed = bmi.toFixed(1);

  resultEl.innerText = `BMI 지수: ${bmiFixed}`;

  // 상태 텍스트 및 색상 지정
  if (bmi < 18.5) {
    stateEl.innerText = "저체중입니다";
    stateEl.style.color = "#2994d8";
  } else if (bmi < 23) {
    stateEl.innerText = "정상 체중입니다";
    stateEl.style.color = "#7cb334";
  } else if (bmi < 25) {
    stateEl.innerText = "과체중입니다";
    stateEl.style.color = "#f49533";
  } else {
    stateEl.innerText = "비만입니다";
    stateEl.style.color = "#f15233";
  }

  // 게이지 바 표시
  gaugeEl.style.display = "block";

  // 각 구간 너비(25%, 22%, 16%, 37%)에 맞춘 정확한 삼각형 위치(%) 계산
  let percent = 0;
  if (bmi < 18.5) {
    // 12 ~ 18.5 구간을 0% ~ 25%에 매핑
    percent = ((bmi - 12) / (18.5 - 12)) * 25;
  } else if (bmi < 23) {
    // 18.5 ~ 23 구간을 25% ~ 47%에 매핑
    percent = 25 + ((bmi - 18.5) / (23 - 18.5)) * 22;
  } else if (bmi < 25) {
    // 23 ~ 25 구간을 47% ~ 63%에 매핑
    percent = 47 + ((bmi - 23) / (25 - 23)) * 16;
  } else {
    // 25 ~ 35 구간을 63% ~ 100%에 매핑
    percent = 63 + ((bmi - 25) / (35 - 25)) * 37;
  }

  // 양 끝을 벗어나지 않도록 범위 제한
  percent = Math.max(2, Math.min(98, percent));

  // 부드러운 애니메이션과 함께 마커 이동
  requestAnimationFrame(() => {
    pointerEl.style.left = `${percent}%`;
  });
}