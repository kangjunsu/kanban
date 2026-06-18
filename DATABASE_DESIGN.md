# Database Design
# 칸반보드 애플리케이션

## 1. 개요

### 1.1 목적
향후 MySQL 또는 PostgreSQL 같은 관계형 데이터베이스 연동을 위한 데이터베이스 스키마 설계

### 1.2 현재 상태
- Phase 1: 데이터베이스 없음 (In-Memory 상태 관리)
- Phase 2 계획: LocalStorage 활용
- Phase 3 계획: 백엔드 데이터베이스 연동

### 1.3 데이터베이스 선택 옵션
| DBMS | 장점 | 단점 | 추천 시나리오 |
|------|------|------|---------------|
| **MySQL** | 널리 사용, 성능 우수, 호스팅 저렴 | 복잡한 쿼리 시 PostgreSQL보다 느림 | 일반적인 웹 애플리케이션 |
| **PostgreSQL** | 고급 기능, JSONB, 트랜잭션 강력 | 리소스 소비 높음 | 복잡한 데이터 구조, 확장성 중요 |

**권장**: MySQL (초기 단계) → PostgreSQL (확장 시)

---

## 2. ERD (Entity Relationship Diagram)

### 2.1 기본 ERD (Phase 3)
```
┌─────────────────┐
│     users       │
│─────────────────│
│ PK id           │
│    email        │
│    password     │
│    name         │
│    created_at   │
└────────┬────────┘
         │
         │ 1:N
         │
         ↓
┌─────────────────────┐
│     boards          │
│─────────────────────│
│ PK id               │
│ FK user_id          │
│    title            │
│    description      │
│    created_at       │
│    updated_at       │
└────────┬────────────┘
         │
         │ 1:N
         │
         ↓
┌─────────────────────┐
│     columns         │
│─────────────────────│
│ PK id               │
│ FK board_id         │
│    name             │
│    position         │
│    created_at       │
└────────┬────────────┘
         │
         │ 1:N
         │
         ↓
┌─────────────────────┐
│     cards           │
│─────────────────────│
│ PK id               │
│ FK column_id        │
│    title            │
│    description      │
│    position         │
│    priority         │
│    created_at       │
│    updated_at       │
└─────────────────────┘
```

### 2.2 확장 ERD (Phase 4 - 협업 기능)
```
┌──────────────┐          ┌──────────────┐
│    users     │ N:N      │    boards    │
│──────────────│◄────────►│──────────────│
│ PK id        │  (join)  │ PK id        │
└──────────────┘          └──────┬───────┘
                                 │
                                 │
                          ┌──────▼───────┐
                          │ board_members│
                          │──────────────│
                          │ FK board_id  │
                          │ FK user_id   │
                          │    role      │
                          └──────────────┘

┌──────────────┐          ┌──────────────┐
│    cards     │ 1:N      │   comments   │
│──────────────│◄─────────│──────────────│
│ PK id        │          │ PK id        │
└──────────────┘          │ FK card_id   │
                          │ FK user_id   │
                          │    content   │
                          └──────────────┘

┌──────────────┐          ┌──────────────┐
│    cards     │ N:N      │     tags     │
│──────────────│◄────────►│──────────────│
│ PK id        │  (join)  │ PK id        │
└──────────────┘          └──────────────┘
                          ┌──────────────┐
                          │  card_tags   │
                          │──────────────│
                          │ FK card_id   │
                          │ FK tag_id    │
                          └──────────────┘
```

---

## 3. 테이블 스키마 정의

### 3.1 users 테이블
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 사용자 고유 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 로그인 이메일 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt 해시 비밀번호 |
| name | VARCHAR(100) | NOT NULL | 사용자 이름 |
| created_at | TIMESTAMP | DEFAULT NOW | 생성 시각 |
| updated_at | TIMESTAMP | AUTO UPDATE | 수정 시각 |

---

### 3.2 boards 테이블
```sql
CREATE TABLE boards (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 보드 고유 ID |
| user_id | BIGINT | FK → users.id | 보드 소유자 |
| title | VARCHAR(255) | NOT NULL | 보드 제목 |
| description | TEXT | NULL | 보드 설명 |
| created_at | TIMESTAMP | DEFAULT NOW | 생성 시각 |
| updated_at | TIMESTAMP | AUTO UPDATE | 수정 시각 |

**참고**: Phase 1에서는 단일 보드만 사용 (추후 다중 보드 지원)

---

### 3.3 columns 테이블
```sql
CREATE TABLE columns (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    board_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    INDEX idx_board_id (board_id),
    INDEX idx_position (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 컬럼 고유 ID |
| board_id | BIGINT | FK → boards.id | 소속 보드 |
| name | VARCHAR(100) | NOT NULL | 컬럼 이름 (TO-DO 등) |
| position | INT | NOT NULL | 컬럼 순서 (0, 1, 2...) |
| created_at | TIMESTAMP | DEFAULT NOW | 생성 시각 |

**초기 데이터**:
```sql
INSERT INTO columns (board_id, name, position) VALUES
(1, 'TO-DO', 0),
(1, 'IN-PROGRESS', 1),
(1, 'DONE', 2);
```

---

### 3.4 cards 테이블 (핵심)
```sql
CREATE TABLE cards (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    column_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position INT NOT NULL DEFAULT 0,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE,
    INDEX idx_column_id (column_id),
    INDEX idx_position (position),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 카드 고유 ID |
| column_id | BIGINT | FK → columns.id | 소속 컬럼 |
| title | VARCHAR(255) | NOT NULL | 카드 제목 |
| description | TEXT | NULL | 카드 상세 설명 |
| position | INT | NOT NULL | 컬럼 내 카드 순서 |
| priority | ENUM | DEFAULT 'medium' | 우선순위 (Phase 2) |
| created_at | TIMESTAMP | DEFAULT NOW | 생성 시각 |
| updated_at | TIMESTAMP | AUTO UPDATE | 수정 시각 |

---

### 3.5 tags 테이블 (Phase 2)
```sql
CREATE TABLE tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL DEFAULT '#667eea',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.6 card_tags 테이블 (N:N 관계)
```sql
CREATE TABLE card_tags (
    card_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (card_id, tag_id),
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.7 comments 테이블 (Phase 3 - 협업)
```sql
CREATE TABLE comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    card_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_card_id (card_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3.8 board_members 테이블 (Phase 3 - 협업)
```sql
CREATE TABLE board_members (
    board_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role ENUM('owner', 'admin', 'member') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (board_id, user_id),
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. 인덱스 전략

### 4.1 기본 인덱스
| 테이블 | 인덱스 | 컬럼 | 이유 |
|--------|--------|------|------|
| users | PRIMARY | id | 기본키 |
| users | UNIQUE | email | 로그인 조회 |
| cards | PRIMARY | id | 기본키 |
| cards | INDEX | column_id | WHERE column_id = ? (가장 빈번) |
| cards | INDEX | position | ORDER BY position (정렬) |
| cards | INDEX | created_at | ORDER BY created_at DESC |

### 4.2 복합 인덱스 (성능 최적화 시)
```sql
-- 카드 조회 최적화 (컬럼별 + 순서)
CREATE INDEX idx_column_position ON cards(column_id, position);

-- 사용자별 보드 조회
CREATE INDEX idx_user_boards ON boards(user_id, created_at);
```

---

## 5. 주요 쿼리 예시

### 5.1 카드 조회 (컬럼별)
```sql
-- TO-DO 컬럼의 모든 카드 조회 (position 순서대로)
SELECT c.id, c.title, c.description, c.position, c.priority, c.created_at
FROM cards c
JOIN columns col ON c.column_id = col.id
WHERE col.name = 'TO-DO'
  AND col.board_id = ?
ORDER BY c.position ASC;
```

### 5.2 카드 추가
```sql
-- 새 카드를 TO-DO 컬럼 마지막에 추가
INSERT INTO cards (column_id, title, description, position)
VALUES (
    (SELECT id FROM columns WHERE name = 'TO-DO' AND board_id = ?),
    '프로젝트 기획서 작성',
    '새 프로젝트 기획서 초안 작성',
    (SELECT COALESCE(MAX(position), -1) + 1 FROM cards WHERE column_id = ?)
);
```

### 5.3 카드 이동 (드래그 앤 드롭)
```sql
-- 카드를 다른 컬럼으로 이동
UPDATE cards
SET column_id = ?,  -- 대상 컬럼 ID
    position = (SELECT COALESCE(MAX(position), -1) + 1 
                FROM cards 
                WHERE column_id = ?),
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

### 5.4 전체 보드 데이터 조회 (API 응답용)
```sql
SELECT 
    col.name AS column_name,
    c.id AS card_id,
    c.title,
    c.description,
    c.position,
    c.priority
FROM columns col
LEFT JOIN cards c ON c.column_id = col.id
WHERE col.board_id = ?
ORDER BY col.position, c.position;
```

**결과 예시**:
```json
[
  {
    "column_name": "TO-DO",
    "card_id": 1,
    "title": "프로젝트 기획서 작성",
    "description": "새 프로젝트 기획서 초안 작성",
    "position": 0,
    "priority": "medium"
  },
  {
    "column_name": "IN-PROGRESS",
    "card_id": 4,
    "title": "로그인 기능 구현",
    "description": "사용자 인증 및 로그인 기능 개발 중",
    "position": 0,
    "priority": "high"
  }
]
```

### 5.5 카드 개수 조회 (컬럼별)
```sql
SELECT 
    col.name AS column_name,
    COUNT(c.id) AS card_count
FROM columns col
LEFT JOIN cards c ON c.column_id = col.id
WHERE col.board_id = ?
GROUP BY col.id, col.name
ORDER BY col.position;
```

---

## 6. 트랜잭션 처리

### 6.1 카드 순서 재정렬 (Atomic Operation)
```sql
START TRANSACTION;

-- 1. 기존 카드들의 position을 모두 +1
UPDATE cards
SET position = position + 1
WHERE column_id = ? AND position >= ?;

-- 2. 새 카드 삽입
INSERT INTO cards (column_id, title, description, position)
VALUES (?, ?, ?, ?);

COMMIT;
```

### 6.2 카드 이동 시 양쪽 컬럼 업데이트
```sql
START TRANSACTION;

-- 1. 원래 컬럼에서 제거 (position 재정렬)
UPDATE cards
SET position = position - 1
WHERE column_id = ? AND position > ?;

-- 2. 대상 컬럼으로 이동
UPDATE cards
SET column_id = ?, position = ?
WHERE id = ?;

COMMIT;
```

---

## 7. 데이터 마이그레이션 전략

### 7.1 LocalStorage → Database 마이그레이션
**Phase 2 → Phase 3 전환 시**

1. **LocalStorage 데이터 추출**
```javascript
const localData = JSON.parse(localStorage.getItem('kanbanCards'));
// localData = [{id, title, description, column}, ...]
```

2. **일괄 INSERT**
```sql
INSERT INTO cards (column_id, title, description, position)
VALUES
    (?, '제목1', '설명1', 0),
    (?, '제목2', '설명2', 1),
    ...;
```

3. **검증**
```sql
SELECT COUNT(*) FROM cards;
-- LocalStorage 카드 개수와 비교
```

---

## 8. 백업 및 복구

### 8.1 정기 백업 전략
```bash
# MySQL 전체 덤프
mysqldump -u root -p kanban_db > backup_$(date +%Y%m%d).sql

# 특정 테이블만 백업
mysqldump -u root -p kanban_db cards columns > cards_backup.sql
```

### 8.2 복구
```bash
# 전체 복구
mysql -u root -p kanban_db < backup_20260618.sql

# 특정 테이블 복구
mysql -u root -p kanban_db < cards_backup.sql
```

---

## 9. 성능 최적화

### 9.1 쿼리 최적화
- **N+1 문제 해결**: JOIN으로 한 번에 조회
- **페이지네이션**: 카드가 많을 경우 LIMIT/OFFSET 사용
- **캐싱**: Redis로 자주 조회되는 보드 데이터 캐싱

### 9.2 인덱스 모니터링
```sql
-- 느린 쿼리 분석
EXPLAIN SELECT * FROM cards WHERE column_id = 1 ORDER BY position;

-- 인덱스 사용 확인
SHOW INDEX FROM cards;
```

### 9.3 파티셔닝 (대규모 시)
```sql
-- 생성 날짜 기준 파티셔닝 (연도별)
ALTER TABLE cards
PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

---

## 10. 보안 고려사항

### 10.1 SQL Injection 방지
- **Prepared Statements 사용** (필수)
```python
# Bad (SQL Injection 취약)
query = f"SELECT * FROM cards WHERE id = {user_input}"

# Good
query = "SELECT * FROM cards WHERE id = ?"
cursor.execute(query, (user_input,))
```

### 10.2 권한 관리
```sql
-- 애플리케이션 전용 DB 사용자 생성
CREATE USER 'kanban_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON kanban_db.* TO 'kanban_app'@'localhost';
FLUSH PRIVILEGES;
```

### 10.3 민감 데이터 암호화
- 비밀번호: bcrypt 해싱 (백엔드에서 처리)
- 개인정보: 필요 시 AES 암호화

---

## 11. 데이터베이스 스키마 버전 관리

### 11.1 마이그레이션 도구
- **Python**: Alembic (SQLAlchemy)
- **Node.js**: Knex.js, Sequelize
- **PHP**: Laravel Migrations

### 11.2 마이그레이션 파일 예시
```python
# alembic/versions/001_create_initial_tables.py
def upgrade():
    op.create_table('users',
        sa.Column('id', sa.BigInteger, primary_key=True),
        sa.Column('email', sa.String(255), unique=True),
        sa.Column('password_hash', sa.String(255)),
        sa.Column('name', sa.String(100)),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('users')
```

---

## 12. PostgreSQL 전환 시 고려사항

### 12.1 MySQL vs PostgreSQL 차이점
| 항목 | MySQL | PostgreSQL |
|------|-------|------------|
| AUTO_INCREMENT | AUTO_INCREMENT | SERIAL / IDENTITY |
| ENUM | ENUM('a','b') | CREATE TYPE 또는 CHECK 제약 |
| ON UPDATE | ON UPDATE CURRENT_TIMESTAMP | TRIGGER 필요 |
| 문자열 결합 | CONCAT() | \|\| 연산자 |

### 12.2 PostgreSQL 스키마 예시
```sql
-- AUTO_INCREMENT 대신 SERIAL
CREATE TABLE cards (
    id BIGSERIAL PRIMARY KEY,
    column_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ON UPDATE TRIGGER
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cards_updated_at
BEFORE UPDATE ON cards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 13. 초기 더미 데이터

### 13.1 샘플 데이터 INSERT
```sql
-- 1. 사용자 생성
INSERT INTO users (email, password_hash, name) VALUES
('user@example.com', '$2b$12$hash...', '홍길동');

-- 2. 보드 생성
INSERT INTO boards (user_id, title) VALUES
(1, '내 첫 칸반보드');

-- 3. 컬럼 생성
INSERT INTO columns (board_id, name, position) VALUES
(1, 'TO-DO', 0),
(1, 'IN-PROGRESS', 1),
(1, 'DONE', 2);

-- 4. 샘플 카드 생성
INSERT INTO cards (column_id, title, description, position) VALUES
(1, '프로젝트 기획서 작성', '새 프로젝트 기획서 초안 작성', 0),
(1, '디자인 시안 검토', 'UI/UX 팀의 디자인 시안 검토 및 피드백', 1),
(1, 'API 문서 작성', '백엔드 API 명세서 작성', 2),
(2, '로그인 기능 구현', '사용자 인증 및 로그인 기능 개발 중', 0),
(2, '데이터베이스 설계', 'ERD 작성 및 스키마 설계', 1),
(3, '개발 환경 설정', '프로젝트 초기 세팅 완료', 0),
(3, 'Git 저장소 생성', 'GitHub 저장소 생성 및 초기 커밋', 1);
```

---

## 14. 요약

### 14.1 핵심 테이블
1. **users**: 사용자 계정
2. **boards**: 칸반보드
3. **columns**: 컬럼 (TO-DO, IN-PROGRESS, DONE)
4. **cards**: 작업 카드 (핵심)

### 14.2 확장 테이블 (향후)
- tags, card_tags: 태그 기능
- comments: 카드 댓글
- board_members: 협업 멤버

### 14.3 마이그레이션 로드맵
- **Phase 1**: 데이터베이스 없음 ✅ (현재)
- **Phase 2**: LocalStorage
- **Phase 3**: MySQL/PostgreSQL + 단일 사용자
- **Phase 4**: 다중 사용자 + 협업 기능
