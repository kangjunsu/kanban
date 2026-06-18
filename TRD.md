# Technical Requirements Document (TRD)
# 칸반보드 애플리케이션

## 1. 기술 스택

### 1.1 현재 스택 (Phase 1)
| 레이어 | 기술 | 버전 | 목적 |
|--------|------|------|------|
| Frontend | HTML5 | - | 마크업 구조 |
| Styling | CSS3 | - | 스타일링 및 레이아웃 |
| Scripting | Vanilla JavaScript | ES6+ | 비즈니스 로직 및 인터랙션 |
| 호스팅 | 정적 파일 서버 | - | 로컬 개발/배포 |

### 1.2 향후 스택 (Phase 2+)
| 레이어 | 기술 옵션 | 목적 |
|--------|-----------|------|
| Backend | Node.js + Express / Python + FastAPI | REST API 서버 |
| Database | MySQL / PostgreSQL | 데이터 영속성 |
| 인증 | JWT / Session | 사용자 인증 |
| 스토리지 | LocalStorage → Database | 데이터 저장 방식 마이그레이션 |

## 2. 시스템 아키텍처

### 2.1 현재 아키텍처 (Client-Only)
```
┌─────────────────────────────────────┐
│         Browser (Client)            │
│  ┌───────────────────────────────┐  │
│  │       index.html (View)       │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │      style.css (Style)        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   script.js (Controller)      │  │
│  │  - DOM Manipulation           │  │
│  │  - Event Handling             │  │
│  │  - State Management (Memory)  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 2.2 향후 아키텍처 (Client-Server)
```
┌──────────────────┐      HTTP/REST      ┌──────────────────┐
│  Browser Client  │ ←─────────────────→ │   Backend API    │
│  - UI Rendering  │    JSON Request/     │  - Node.js/      │
│  - User Input    │    Response          │    Python        │
│  - State Mgmt    │                      │  - Business      │
└──────────────────┘                      │    Logic         │
                                          └──────────────────┘
                                                   │
                                                   │ SQL
                                                   ↓
                                          ┌──────────────────┐
                                          │   Database       │
                                          │   MySQL/         │
                                          │   PostgreSQL     │
                                          └──────────────────┘
```

## 3. 데이터 흐름

### 3.1 현재 데이터 흐름
```
User Action
    ↓
Event Listener (script.js)
    ↓
DOM Manipulation
    ↓
Visual Update (Browser Re-render)
    ↓
State Update (In-Memory: draggedCard variable, DOM queries)
```

### 3.2 향후 데이터 흐름 (with Backend)
```
User Action
    ↓
Event Listener
    ↓
API Request (fetch/axios)
    ↓
Backend API Handler
    ↓
Database Query
    ↓
Database Update
    ↓
API Response (JSON)
    ↓
Frontend State Update
    ↓
UI Re-render
```

## 4. 핵심 기술 요구사항

### 4.1 Drag and Drop 구현
**기술**: HTML5 Drag and Drop API

**이벤트 체인**:
1. `dragstart` - 드래그 시작 시 카드 참조 저장
2. `dragenter` - 컬럼 진입 시 시각적 피드백
3. `dragover` - 드래그 중 `preventDefault()` 호출 (드롭 허용)
4. `dragleave` - 컬럼 이탈 시 피드백 제거
5. `drop` - 카드를 대상 컬럼에 추가
6. `dragend` - 드래그 종료 시 정리 작업

**데이터 전달**: `dataTransfer` 객체 사용

### 4.2 상태 관리
**현재 방식**:
- 전역 변수 `draggedCard`로 드래그 중인 카드 추적
- DOM을 Single Source of Truth로 사용
- `querySelectorAll()`로 실시간 카드 개수 계산

**향후 개선**:
- 클라이언트 측: LocalStorage 또는 IndexedDB
- 서버 측: 백엔드 DB와 동기화

### 4.3 반응형 디자인
**구현 방식**: CSS Media Queries

**브레이크포인트**:
```css
@media (max-width: 768px) {
  .board { flex-direction: column; }
}
```

**레이아웃**: Flexbox 기반
- Desktop: 3컬럼 가로 배치 (`flex-direction: row`)
- Mobile: 3컬럼 세로 배치 (`flex-direction: column`)

## 5. API 설계 (Phase 2 - 향후)

### 5.1 REST API Endpoints
| Method | Endpoint | 설명 | Request Body | Response |
|--------|----------|------|--------------|----------|
| GET | `/api/cards` | 모든 카드 조회 | - | `[{id, title, description, column, order}]` |
| POST | `/api/cards` | 새 카드 생성 | `{title, description}` | `{id, title, description, column, order}` |
| PUT | `/api/cards/:id` | 카드 수정 | `{title, description, column, order}` | `{id, ...}` |
| DELETE | `/api/cards/:id` | 카드 삭제 | - | `{success: true}` |
| PATCH | `/api/cards/:id/move` | 카드 이동 | `{column, order}` | `{id, column, order}` |

### 5.2 Request/Response 예시
```javascript
// POST /api/cards
Request:
{
  "title": "프로젝트 기획서 작성",
  "description": "새 프로젝트 기획서 초안 작성",
  "column": "todo"
}

Response:
{
  "id": "uuid-1234",
  "title": "프로젝트 기획서 작성",
  "description": "새 프로젝트 기획서 초안 작성",
  "column": "todo",
  "order": 0,
  "createdAt": "2026-06-18T10:00:00Z",
  "updatedAt": "2026-06-18T10:00:00Z"
}
```

## 6. 보안 요구사항 (Phase 2)

### 6.1 인증 및 권한
- JWT 토큰 기반 인증
- HTTPS 통신 필수
- XSS 방지: 사용자 입력 sanitization
- CSRF 방지: CSRF 토큰 또는 SameSite 쿠키

### 6.2 데이터 검증
- 프론트엔드: 클라이언트 측 기본 검증
- 백엔드: 서버 측 필수 검증 (신뢰할 수 없는 입력)
- SQL Injection 방지: Prepared Statements 사용

## 7. 성능 요구사항

### 7.1 프론트엔드 성능
| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| 초기 로딩 시간 | < 2초 | Lighthouse |
| 드래그 지연 시간 | < 100ms | Performance API |
| 메모리 사용량 | < 50MB | Chrome DevTools |
| 최대 카드 수 | 100개 | 수동 테스트 |

### 7.2 백엔드 성능 (Phase 2)
| 지표 | 목표 |
|------|------|
| API 응답 시간 | < 200ms (p95) |
| 동시 사용자 | 100명 |
| DB 쿼리 시간 | < 100ms |

## 8. 테스트 전략

### 8.1 현재 테스트 방식
- **수동 테스트**: 브라우저에서 직접 기능 확인
- **시각적 테스트**: 드래그 앤 드롭 인터랙션 확인
- **호환성 테스트**: 다양한 브라우저에서 동작 확인

### 8.2 향후 자동화 테스트 (Phase 2)
| 테스트 유형 | 도구 | 대상 |
|-------------|------|------|
| Unit Test | Jest | 개별 함수 로직 |
| Integration Test | Jest + Testing Library | 컴포넌트 상호작용 |
| E2E Test | Cypress (Playwright 제외) | 전체 사용자 플로우 |

**참고**: Playwright는 사용하지 않음 (요구사항)

## 9. 배포 전략

### 9.1 현재 배포 (Static Hosting)
- GitHub Pages
- Netlify
- Vercel
- 또는 로컬 HTTP 서버 (`python -m http.server`)

### 9.2 향후 배포 (Phase 2)
**프론트엔드**: Vercel, Netlify
**백엔드**: AWS EC2, Heroku, Railway
**데이터베이스**: AWS RDS, Supabase, PlanetScale

## 10. 기술적 제약사항

### 10.1 현재 제약
- 빌드 도구 없음 (No Webpack, Vite, etc.)
- 패키지 매니저 없음 (No npm, yarn)
- 타입스크립트 미사용
- 프레임워크 미사용 (No React, Vue, etc.)
- 데이터 영속성 없음

### 10.2 브라우저 호환성
- HTML5 Drag and Drop API 지원 필수
- ES6+ JavaScript 지원 필수
- Flexbox 지원 필수
- 최소 지원 버전:
  - Chrome 60+
  - Firefox 55+
  - Safari 11+
  - Edge 79+

## 11. 기술 부채 및 개선 사항

### 11.1 현재 기술 부채
- 전역 변수 사용 (`draggedCard`)
- DOM을 상태 저장소로 사용
- 데이터 영속성 없음
- 에러 핸들링 부족

### 11.2 개선 계획 (우선순위순)
1. LocalStorage 통합으로 데이터 영속성 추가
2. 모듈 패턴으로 전역 스코프 오염 방지
3. 에러 바운더리 및 사용자 피드백 추가
4. 백엔드 API 통합
5. 타입스크립트 마이그레이션 (선택)

## 12. 개발 환경 설정

### 12.1 필수 도구
- 모던 웹 브라우저 (Chrome/Firefox 권장)
- 텍스트 에디터 (VS Code, Sublime Text 등)
- 로컬 HTTP 서버 (선택사항)

### 12.2 개발 서버 실행
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server 설치 필요)
npx http-server

# 그냥 브라우저에서 직접 열기
open index.html
```

### 12.3 디버깅
- Chrome DevTools
- Firefox Developer Tools
- Console.log 디버깅
- Breakpoint 설정

## 13. 코딩 컨벤션

### 13.1 JavaScript
- 함수명: camelCase (`handleDragStart`)
- 상수: UPPER_SNAKE_CASE (현재 미사용)
- 들여쓰기: 4 spaces
- 세미콜론: 사용

### 13.2 CSS
- 클래스명: kebab-case (`.card-container`)
- 선택자 우선순위: 클래스 > ID
- 들여쓰기: 4 spaces

### 13.3 HTML
- 시맨틱 태그 우선 사용
- `data-*` 속성으로 메타데이터 저장
- 들여쓰기: 4 spaces
