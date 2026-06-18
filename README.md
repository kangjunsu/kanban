# 칸반보드 애플리케이션

HTML, CSS, JavaScript로 구현한 드래그 앤 드롭 기능이 있는 칸반보드

## 🌐 데모
**[🚀 Live Demo](https://kangjunsu.github.io/kanban/)**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)](https://kangjunsu.github.io/kanban/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/kangjunsu/kanban)

## 🎯 주요 기능

### ✅ Phase 1 (MVP) - 완료
- **3개 컬럼**: TO-DO, IN-PROGRESS, DONE
- **드래그 앤 드롭**: 마우스로 카드를 다른 컬럼으로 이동
- **카드 개수 표시**: 각 컬럼의 카드 개수 실시간 업데이트
- **반응형 디자인**: 모바일/태블릿 화면 대응

### ✅ Phase 2 (개선) - 완료
- **LocalStorage 영속성**: 새로고침 후에도 데이터 유지
- **카드 편집**: 모달에서 제목/설명/우선순위 수정
- **카드 삭제**: 확인 후 카드 삭제
- **우선순위 시스템**: High/Medium/Low 색상 구분
- **토스트 알림**: 작업 결과 피드백
- **데이터 초기화**: 샘플 데이터로 리셋

## 🚀 실행 방법

### 방법 1: 직접 열기
```bash
# 브라우저에서 index.html 파일을 직접 엽니다
open index.html
```

### 방법 2: 로컬 서버 (권장)
```bash
# Python 3
python3 -m http.server 8000

# 브라우저에서 접속
open http://localhost:8000
```

## 📖 사용 가이드

### 카드 추가
1. **"+ 새 카드 추가"** 버튼 클릭
2. 제목 입력 (필수)
3. 설명 입력 (선택)
4. 카드가 TO-DO 컬럼에 자동 추가됨

### 카드 이동
1. 카드를 마우스로 **클릭 & 드래그**
2. 대상 컬럼으로 이동 (컬럼 배경색 변화)
3. 마우스 버튼을 놓으면 카드 이동 완료

### 카드 편집
1. 카드의 **"✏️ 편집"** 버튼 클릭
2. 모달에서 제목/설명/우선순위 수정
3. **"저장"** 버튼 클릭

### 카드 삭제
1. 카드의 **"🗑️ 삭제"** 버튼 클릭
2. 확인 다이얼로그에서 **"확인"** 클릭

### 데이터 초기화
1. **"데이터 초기화"** 버튼 클릭
2. 확인 다이얼로그에서 **"확인"** 클릭
3. 샘플 데이터로 복원됨

## 🎨 우선순위 색상

| 우선순위 | 색상 | 표시 |
|---------|------|------|
| **High** | 🔴 빨간색 | 왼쪽 테두리 + 배지 |
| **Medium** | 🟠 주황색 | 왼쪽 테두리 + 배지 |
| **Low** | 🟢 초록색 | 왼쪽 테두리 + 배지 |

## 💾 데이터 저장

- **자동 저장**: 모든 작업(추가/수정/삭제/이동)은 자동으로 LocalStorage에 저장됩니다
- **자동 로드**: 페이지를 다시 열면 이전 데이터가 자동으로 복원됩니다
- **브라우저 제한**: LocalStorage는 브라우저별로 독립적입니다 (Chrome의 데이터는 Firefox에서 보이지 않음)

## 📱 반응형 디자인

- **데스크톱 (> 768px)**: 컬럼 3개 가로 배치
- **모바일 (≤ 768px)**: 컬럼 3개 세로 배치

## 🔧 기술 스택

- **HTML5**: 시맨틱 마크업, Drag and Drop API
- **CSS3**: Flexbox, Transitions, Media Queries
- **JavaScript (Vanilla)**: 모듈 패턴, LocalStorage, DOM 조작

## 📂 파일 구조

```
day03/
├── index.html              # HTML 구조
├── style.css               # 스타일링
├── script.js               # 비즈니스 로직
├── README.md               # 이 파일
├── CLAUDE.md               # 개발 가이드
├── PRD.md                  # 제품 요구사항
├── TRD.md                  # 기술 요구사항
├── USER.md                 # 사용자 페르소나 & 스토리
├── FLOW.md                 # 사용자/애플리케이션 플로우
├── DATABASE_DESIGN.md      # 데이터베이스 설계
├── DESIGN_SYSTEM.md        # 디자인 시스템
├── TASK.md                 # 작업 목록
├── IMPLEMENTATION_LOG.md   # 구현 로그
└── plan.md                 # 초기 계획서
```

## 🌐 브라우저 호환성

| 브라우저 | 최소 버전 | 상태 |
|---------|----------|------|
| Chrome | 60+ | ✅ 지원 |
| Firefox | 55+ | ✅ 지원 |
| Safari | 11+ | ✅ 지원 |
| Edge | 79+ | ✅ 지원 |

## ⚠️ 알려진 제한 사항

1. **터치 디바이스**: 모바일에서 드래그 앤 드롭이 작동하지 않을 수 있음 (HTML5 Drag and Drop API 제한)
2. **같은 컬럼 내 순서**: 현재는 다른 컬럼으로만 이동 가능, 같은 컬럼 내 순서 변경 미지원
3. **데이터 공유**: 각 브라우저/기기별로 데이터가 독립적 (백엔드 미연동)

## 🔮 향후 계획

### Phase 3: 백엔드 연동
- REST API 서버 (Node.js/Python)
- 데이터베이스 (MySQL/PostgreSQL)
- 사용자 인증 (JWT)
- 다중 보드 지원

### Phase 4: 협업 기능
- 실시간 동기화 (WebSocket)
- 보드 공유
- 카드 댓글
- 담당자 할당

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 👨‍💻 개발자

- 강준수 (kangjunsu)
- 제작일: 2026-06-18

## 📚 참고 문서

- [HTML5 Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

---

**즐거운 작업 관리 되세요! 🎉**
