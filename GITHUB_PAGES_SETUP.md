# GitHub Pages 배포 가이드

## 현재 상태 ✅
- GitHub 저장소: https://github.com/kangjunsu/kanban
- Main 브랜치에 모든 파일 push 완료
- 14개 파일 (총 4,774줄) 업로드 완료

## GitHub Pages 활성화 방법

### 1단계: GitHub 저장소 설정 페이지로 이동
1. 브라우저에서 https://github.com/kangjunsu/kanban 접속
2. 상단 메뉴에서 **Settings** 클릭

### 2단계: Pages 설정
1. 왼쪽 사이드바에서 **Pages** 클릭
2. **Source** 섹션에서:
   - Branch: **main** 선택
   - Folder: **/ (root)** 선택
3. **Save** 버튼 클릭

### 3단계: 배포 확인
- 저장 후 1-2분 정도 기다리면 자동으로 배포됩니다
- 페이지 상단에 다음과 같은 메시지가 나타납니다:
  ```
  Your site is live at https://kangjunsu.github.io/kanban/
  ```

### 4단계: 접속
- 배포 완료 후 https://kangjunsu.github.io/kanban/ 에서 칸반보드를 확인할 수 있습니다

## 배포되는 파일 목록

### 핵심 파일
- `index.html` - 메인 페이지 (자동으로 루트에서 제공)
- `style.css` - 스타일시트
- `script.js` - JavaScript 로직

### 문서 파일
- `README.md` - 사용자 가이드
- `CLAUDE.md` - 개발 가이드
- `PRD.md` - 제품 요구사항
- `TRD.md` - 기술 요구사항
- `USER.md` - 사용자 페르소나
- `FLOW.md` - 플로우 다이어그램
- `DATABASE_DESIGN.md` - DB 스키마
- `DESIGN_SYSTEM.md` - 디자인 시스템
- `TASK.md` - 작업 목록
- `IMPLEMENTATION_LOG.md` - 구현 로그
- `plan.md` - 초기 계획서

## 특징

### 즉시 사용 가능
- 정적 HTML/CSS/JS만 사용하여 별도의 빌드 과정 불필요
- GitHub Pages에서 즉시 호스팅 가능

### 데이터 영속성
- LocalStorage 사용으로 브라우저에 데이터 저장
- 새로고침 후에도 데이터 유지

### 완전한 기능
- 카드 추가/편집/삭제
- 드래그 앤 드롭
- 우선순위 시스템
- 토스트 알림

## 배포 후 테스트 항목

- [ ] 페이지가 정상적으로 로드되는지 확인
- [ ] 드래그 앤 드롭이 작동하는지 확인
- [ ] 새 카드 추가가 되는지 확인
- [ ] 카드 편집이 되는지 확인
- [ ] 카드 삭제가 되는지 확인
- [ ] 새로고침 후 데이터가 유지되는지 확인
- [ ] 모바일에서 반응형 레이아웃이 작동하는지 확인

## 문제 해결

### 페이지가 404 오류를 표시하는 경우
- GitHub Pages 설정이 활성화되었는지 확인
- 브랜치가 `main`으로 설정되었는지 확인
- 5-10분 정도 기다린 후 다시 시도

### CSS/JS가 로드되지 않는 경우
- 브라우저 개발자 도구(F12)의 Console 탭 확인
- 파일 경로가 상대 경로로 올바르게 설정되어 있는지 확인
- 현재 프로젝트는 모두 상대 경로를 사용하므로 문제없음

### LocalStorage 데이터가 저장되지 않는 경우
- 브라우저의 개인정보 보호 설정 확인
- 시크릿/프라이빗 모드에서는 LocalStorage가 제한될 수 있음

## 추가 설정 (선택사항)

### 커스텀 도메인 연결
1. Settings → Pages → Custom domain에 도메인 입력
2. DNS 설정에서 CNAME 레코드 추가:
   ```
   CNAME -> kangjunsu.github.io
   ```

### HTTPS 강제 사용
- Settings → Pages → "Enforce HTTPS" 체크박스 활성화 (권장)

## 업데이트 방법

코드를 수정한 후 다시 배포하려면:

```bash
# 파일 수정 후
cd /tmp/kanban
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main
```

- Push 후 1-2분 내에 자동으로 재배포됩니다
- GitHub Actions 탭에서 배포 진행 상황 확인 가능

## 도움말

- GitHub Pages 문서: https://docs.github.com/en/pages
- 배포 상태 확인: https://github.com/kangjunsu/kanban/deployments
- Issues 리포트: https://github.com/kangjunsu/kanban/issues

---

**배포 완료 후 README.md에 배포 URL을 추가하는 것을 권장합니다!**
