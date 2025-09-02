const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// 예시 JSON 원본
const raw = [ /* 너가 준 JSON 붙여넣으면 됨 */ ];

app.use(cors());

app.get('/api/knps-notices', (req, res) => {
  // ✅ 변환 로직 시작
  const grouped = {};

  raw.forEach(item => {
    const { park, status, time } = item;

    if (!grouped[park]) grouped[park] = [];

    // 상태로 판단: 상태가 '정상', '부분통제', '전면통제' 중 하나면 status, 아니면 office로 간주
    const statusList = ['정상', '부분통제', '전면통제'];
    const isStatus = statusList.includes(time); // time 자리에 상태가 있는지

    if (isStatus) {
      // old structure: status = office, time = status
      grouped[park].push({
        office: status,
        status: time,
        time: '', // 시간 없음
      });
    } else {
      // 정상 구조
      grouped[park].push({
        status,
        time,
      });
    }
  });

  const result = Object.entries(grouped).map(([park, details]) => ({
    park,
    details,
  }));

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});

