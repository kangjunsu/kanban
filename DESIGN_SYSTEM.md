# Design System
# 칸반보드 애플리케이션

## 1. 디자인 원칙

### 1.1 핵심 가치
- **단순함 (Simplicity)**: 복잡한 기능 대신 직관적인 사용성
- **명확함 (Clarity)**: 모든 UI 요소는 그 목적이 명확해야 함
- **일관성 (Consistency)**: 동일한 패턴을 반복 사용
- **반응성 (Responsiveness)**: 사용자 액션에 즉각적인 피드백

### 1.2 디자인 목표
- 별도의 학습 없이 5분 내 사용 가능
- 시각적으로 깔끔하고 현대적인 느낌
- 드래그 앤 드롭 인터랙션이 부드럽고 자연스러움

---

## 2. 컬러 시스템

### 2.1 Primary Colors
| 이름 | HEX | RGB | 용도 |
|------|-----|-----|------|
| **Primary Purple** | `#667eea` | rgb(102, 126, 234) | 메인 브랜드 색상, 버튼, 배지 |
| **Secondary Purple** | `#764ba2` | rgb(118, 75, 162) | 그라디언트 끝, 강조 |

### 2.2 Neutral Colors
| 이름 | HEX | RGB | 용도 |
|------|-----|-----|------|
| **White** | `#ffffff` | rgb(255, 255, 255) | 카드 배경, 버튼 배경 |
| **Light Gray** | `#f4f5f7` | rgb(244, 245, 247) | 컬럼 배경 |
| **Medium Gray** | `#e4e6eb` | rgb(228, 230, 235) | 드래그 오버 상태 |
| **Border Gray** | `#ddd` | rgb(221, 221, 221) | 구분선 |
| **Text Dark** | `#333` | rgb(51, 51, 51) | 제목, 주요 텍스트 |
| **Text Medium** | `#666` | rgb(102, 102, 102) | 설명, 보조 텍스트 |

### 2.3 Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
**용도**: Body 배경

### 2.4 컬러 팔레트 시각화
```
┌──────────────────────────────────────┐
│  Primary Purple (#667eea)            │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Secondary Purple (#764ba2)          │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  White (#ffffff)                     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Light Gray (#f4f5f7)                │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │
└──────────────────────────────────────┘
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```
**이유**: 크로스 플랫폼 가독성이 우수한 시스템 폰트

### 3.2 폰트 크기
| 요소 | 크기 | 용도 | CSS |
|------|------|------|-----|
| **Heading 1** | 2.5rem (40px) | 페이지 제목 | `<h1>` |
| **Heading 2** | 1.2rem (19.2px) | 컬럼 제목 | `.column-header h2` |
| **Heading 3** | 1rem (16px) | 카드 제목 | `.card h3` |
| **Body** | 1rem (16px) | 버튼 텍스트 | `button` |
| **Small** | 0.9rem (14.4px) | 카드 설명, 배지 | `.card p`, `.card-count` |

### 3.3 폰트 웨이트
| 용도 | Weight | CSS |
|------|--------|-----|
| 일반 텍스트 | 400 (normal) | 기본값 |
| 강조 제목 | 600 (semi-bold) | `.column-header h2`, `.card h3` |
| 버튼/배지 | 700 (bold) | `#addCardBtn`, `.card-count` |

### 3.4 Line Height
```css
body {
    line-height: 1.6; /* 기본 */
}

.card p {
    line-height: 1.4; /* 밀집 텍스트 */
}
```

---

## 4. 간격 (Spacing)

### 4.1 Spacing Scale
| 레벨 | 크기 | 용도 |
|------|------|------|
| **xs** | 4px | 아이콘 내부 패딩 (향후) |
| **sm** | 8px | 카드 제목-설명 간격 |
| **md** | 12px | 카드 간 간격, 버튼 패딩 (세로) |
| **lg** | 15px | 컬럼 내부 패딩, 카드 내부 패딩 |
| **xl** | 20px | 컬럼 간 간격, Body 패딩 |
| **2xl** | 30px | 제목 하단 마진 |

### 4.2 Spacing 적용 예시
```css
/* 컬럼 간격 */
.board {
    gap: 20px; /* xl */
}

/* 카드 내부 패딩 */
.card {
    padding: 15px; /* lg */
}

/* 카드 간 간격 */
.card {
    margin-bottom: 12px; /* md */
}
```

---

## 5. 레이아웃

### 5.1 Grid System
**방식**: Flexbox 기반

#### 데스크톱 (> 768px)
```
┌────────────────────────────────────────────────────┐
│                    Container                       │
│  max-width: 1400px                                 │
│  ┌──────────┬──────────────┬──────────────┐       │
│  │ TO-DO    │ IN-PROGRESS  │ DONE         │       │
│  │ flex: 1  │ flex: 1      │ flex: 1      │       │
│  │          │              │              │       │
│  └──────────┴──────────────┴──────────────┘       │
│                                                    │
└────────────────────────────────────────────────────┘
```

#### 모바일 (≤ 768px)
```
┌──────────────────┐
│    Container     │
│  ┌────────────┐  │
│  │  TO-DO     │  │
│  │            │  │
│  └────────────┘  │
│  ┌────────────┐  │
│  │IN-PROGRESS │  │
│  │            │  │
│  └────────────┘  │
│  ┌────────────┐  │
│  │   DONE     │  │
│  │            │  │
│  └────────────┘  │
└──────────────────┘
```

### 5.2 레이아웃 CSS
```css
.board {
    display: flex;
    gap: 20px;
}

.column {
    flex: 1;
    min-width: 0; /* Flexbox 오버플로우 방지 */
}

@media (max-width: 768px) {
    .board {
        flex-direction: column;
    }
}
```

---

## 6. 컴포넌트 디자인

### 6.1 카드 (Card)
#### 기본 상태
```
┌─────────────────────────────────────┐
│  프로젝트 기획서 작성               │  ← 제목 (h3, 1rem, #333)
│  새 프로젝트 기획서 초안 작성       │  ← 설명 (p, 0.9rem, #666)
└─────────────────────────────────────┘
```

#### 스타일 정의
```css
.card {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: move;
    transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
}
```

#### 상태별 스타일
| 상태 | CSS Class | 시각 효과 |
|------|-----------|-----------|
| **기본** | `.card` | box-shadow: 0 2px 4px |
| **호버** | `.card:hover` | transform: translateY(-2px), box-shadow: 0 4px 8px |
| **드래그 중** | `.card.dragging` | opacity: 0.5, transform: rotate(5deg) |

---

### 6.2 컬럼 (Column)
#### 구조
```
┌────────────────────────────────┐
│  TO-DO                    [3]  │  ← 헤더 (제목 + 카드 개수)
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← 구분선
│  ┌──────────────────────────┐ │
│  │  카드 1                  │ │
│  └──────────────────────────┘ │
│  ┌──────────────────────────┐ │
│  │  카드 2                  │ │
│  └──────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

#### 스타일 정의
```css
.column {
    background-color: #f4f5f7;
    border-radius: 12px;
    padding: 15px;
    min-height: 500px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
}

.column.drag-over {
    background-color: #e4e6eb;
    border: 2px dashed #667eea;
}
```

---

### 6.3 카드 카운트 배지
```css
.card-count {
    background-color: #667eea;
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: bold;
}
```

**시각 예시**:
```
┌─────┐
│  3  │  ← 보라색 배경, 흰색 텍스트
└─────┘
```

---

### 6.4 버튼 (Button)
#### 기본 상태
```
┌──────────────────────┐
│  + 새 카드 추가      │  ← 흰색 배경, 보라색 텍스트
└──────────────────────┘
```

#### 호버 상태
```
┌──────────────────────┐
│  + 새 카드 추가      │  ← 보라색 배경, 흰색 텍스트
└──────────────────────┘
```

#### 스타일 정의
```css
#addCardBtn {
    background-color: white;
    color: #667eea;
    border: 2px solid white;
    padding: 12px 30px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#addCardBtn:hover {
    background-color: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

#addCardBtn:active {
    transform: translateY(0);
}
```

---

## 7. Border Radius

| 요소 | Radius | 이유 |
|------|--------|------|
| 카드 | 8px | 부드러운 느낌 |
| 컬럼 | 12px | 카드보다 큰 요소라 더 큰 radius |
| 버튼 | 8px | 카드와 일관성 |
| 배지 | 12px | 완전히 둥근 느낌 (pill shape) |

---

## 8. 그림자 (Shadows)

### 8.1 Shadow Scale
| 레벨 | CSS | 용도 |
|------|-----|------|
| **sm** | `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);` | 카드 기본 상태 |
| **md** | `box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);` | 컬럼, 버튼 기본 상태 |
| **lg** | `box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);` | 카드 호버 상태 |
| **xl** | `box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);` | 버튼 호버 상태 |

### 8.2 텍스트 그림자
```css
h1 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}
```
**용도**: 그라디언트 배경 위의 제목 가독성 향상

---

## 9. 애니메이션 & 트랜지션

### 9.1 트랜지션 타이밍
| 요소 | Duration | Easing | 속성 |
|------|----------|--------|------|
| 카드 호버 | 0.2s | ease | transform, opacity, box-shadow |
| 버튼 호버 | 0.3s | ease | background, color, transform |
| 컬럼 드래그 오버 | 0.3s | ease | background-color |

### 9.2 트랜지션 CSS
```css
.card {
    transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
}

#addCardBtn {
    transition: all 0.3s ease;
}

.column {
    transition: background-color 0.3s ease;
}
```

### 9.3 Transform 애니메이션
| 요소 | 효과 | CSS |
|------|------|-----|
| 카드 호버 | 위로 2px 이동 | `transform: translateY(-2px);` |
| 버튼 호버 | 위로 2px 이동 | `transform: translateY(-2px);` |
| 버튼 클릭 | 원래 위치로 복귀 | `transform: translateY(0);` |
| 카드 드래그 | 5도 회전 | `transform: rotate(5deg);` |

---

## 10. 반응형 디자인

### 10.1 브레이크포인트
| 디바이스 | Width | 레이아웃 |
|----------|-------|----------|
| **Mobile** | < 768px | 세로 스택 (flex-direction: column) |
| **Desktop** | ≥ 768px | 가로 배치 (flex-direction: row) |

### 10.2 반응형 스타일
```css
@media (max-width: 768px) {
    .board {
        flex-direction: column;
    }

    .column {
        min-height: 300px; /* 모바일에서 더 낮은 최소 높이 */
    }

    h1 {
        font-size: 2rem; /* 40px → 32px */
    }
}
```

---

## 11. 인터랙션 디자인

### 11.1 드래그 앤 드롭 시각적 피드백
| 단계 | 시각 효과 | CSS |
|------|-----------|-----|
| **드래그 시작** | 카드 반투명 + 회전 | `opacity: 0.5`, `transform: rotate(5deg)` |
| **컬럼 진입** | 컬럼 배경 변경 + 점선 테두리 | `background: #e4e6eb`, `border: 2px dashed #667eea` |
| **컬럼 이탈** | 원래 상태로 복구 | 클래스 제거 |
| **드롭** | 카드가 자연스럽게 추가됨 | DOM appendChild |
| **드래그 종료** | 모든 피드백 제거 | `.dragging`, `.drag-over` 제거 |

### 11.2 호버 효과
```css
/* 카드 호버 */
.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 버튼 호버 */
#addCardBtn:hover {
    background-color: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}
```

### 11.3 커서 스타일
```css
.card {
    cursor: move; /* 드래그 가능 표시 */
}

#addCardBtn {
    cursor: pointer;
}
```

---

## 12. 접근성 (Accessibility)

### 12.1 색상 대비
- **WCAG 2.1 AA 기준 충족**
- 텍스트와 배경 간 충분한 대비
  - 제목(#333) on 카드 배경(#fff): ✅ Pass
  - 설명(#666) on 카드 배경(#fff): ✅ Pass
  - 배지 텍스트(white) on 배지 배경(#667eea): ✅ Pass

### 12.2 포커스 스타일 (향후 개선)
```css
/* 키보드 네비게이션 지원 */
.card:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}

#addCardBtn:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}
```

### 12.3 Semantic HTML
- `<h1>`, `<h2>`, `<h3>` 계층 구조 사용
- `<button>` 요소로 버튼 구현 (div가 아닌)

---

## 13. 아이콘 시스템 (향후)

### 13.1 아이콘 스타일
- **스타일**: Outline (선 기반)
- **크기**: 16px, 24px
- **라이브러리 추천**: Heroicons, Feather Icons

### 13.2 사용 예시
```html
<!-- 우선순위 아이콘 (Phase 2) -->
<span class="icon-priority-high">🔴</span>
<span class="icon-priority-medium">🟡</span>
<span class="icon-priority-low">🟢</span>

<!-- 편집/삭제 아이콘 -->
<button class="icon-edit">✏️</button>
<button class="icon-delete">🗑️</button>
```

---

## 14. 다크 모드 (향후)

### 14.1 컬러 변수 정의
```css
:root {
    --bg-body: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --bg-column: #f4f5f7;
    --bg-card: #ffffff;
    --text-primary: #333;
    --text-secondary: #666;
}

[data-theme="dark"] {
    --bg-body: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    --bg-column: #2c2c3e;
    --bg-card: #3a3a4e;
    --text-primary: #f4f5f7;
    --text-secondary: #b0b0c0;
}
```

---

## 15. 디자인 토큰 요약

### 15.1 컬러 토큰
```json
{
  "color": {
    "primary": "#667eea",
    "secondary": "#764ba2",
    "white": "#ffffff",
    "gray-100": "#f4f5f7",
    "gray-200": "#e4e6eb",
    "gray-300": "#ddd",
    "gray-700": "#666",
    "gray-900": "#333"
  }
}
```

### 15.2 간격 토큰
```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "12px",
    "lg": "15px",
    "xl": "20px",
    "2xl": "30px"
  }
}
```

### 15.3 타이포그래피 토큰
```json
{
  "fontSize": {
    "sm": "0.9rem",
    "base": "1rem",
    "lg": "1.2rem",
    "xl": "2.5rem"
  },
  "fontWeight": {
    "normal": 400,
    "semibold": 600,
    "bold": 700
  }
}
```

---

## 16. 디자인 체크리스트

### Phase 1 (현재) ✅
- [x] 일관된 컬러 팔레트
- [x] 반응형 레이아웃 (768px 브레이크포인트)
- [x] 드래그 앤 드롭 시각적 피드백
- [x] 호버 애니메이션
- [x] 그림자 효과
- [x] 타이포그래피 계층 구조

### Phase 2 (향후)
- [ ] 다크 모드 지원
- [ ] 아이콘 통합
- [ ] 스켈레톤 로딩 상태
- [ ] 토스트 알림 디자인
- [ ] 모달 디자인 (카드 상세 보기)

### Phase 3 (접근성)
- [ ] 키보드 네비게이션
- [ ] 포커스 스타일
- [ ] ARIA 레이블
- [ ] 스크린 리더 지원

---

## 17. 디자인 파일 참조

현재 디자인 시스템은 **코드로 정의**되어 있습니다.
- `style.css`: 모든 디자인 토큰과 컴포넌트 스타일 정의
- Figma/Sketch 파일 없음 (향후 필요 시 제작)

**디자인 변경 시**:
1. 이 문서의 토큰 값 업데이트
2. `style.css`에 반영
3. `index.html`에서 시각적 확인
