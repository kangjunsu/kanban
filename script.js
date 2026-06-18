// 칸반보드 애플리케이션 (Phase 2)
// LocalStorage, 편집, 삭제 기능 포함

const KanbanBoard = (function() {
    // 상태 관리
    let draggedCard = null;
    let currentEditingCardId = null;
    let cards = [];

    // DOM 요소
    const elements = {
        columns: null,
        addCardBtn: null,
        clearDataBtn: null,
        editModal: null,
        editForm: null,
        cancelEditBtn: null,
        toast: null
    };

    // 초기 샘플 데이터
    const defaultCards = [
        { id: generateId(), title: '프로젝트 기획서 작성', description: '새 프로젝트 기획서 초안 작성', column: 'todo', priority: 'high', position: 0 },
        { id: generateId(), title: '디자인 시안 검토', description: 'UI/UX 팀의 디자인 시안 검토 및 피드백', column: 'todo', priority: 'medium', position: 1 },
        { id: generateId(), title: 'API 문서 작성', description: '백엔드 API 명세서 작성', column: 'todo', priority: 'medium', position: 2 },
        { id: generateId(), title: '로그인 기능 구현', description: '사용자 인증 및 로그인 기능 개발 중', column: 'in-progress', priority: 'high', position: 0 },
        { id: generateId(), title: '데이터베이스 설계', description: 'ERD 작성 및 스키마 설계', column: 'in-progress', priority: 'medium', position: 1 },
        { id: generateId(), title: '개발 환경 설정', description: '프로젝트 초기 세팅 완료', column: 'done', priority: 'low', position: 0 },
        { id: generateId(), title: 'Git 저장소 생성', description: 'GitHub 저장소 생성 및 초기 커밋', column: 'done', priority: 'low', position: 1 }
    ];

    // ID 생성 함수
    function generateId() {
        return 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 초기화
    function init() {
        cacheDOMElements();
        loadFromLocalStorage();
        renderAllCards();
        attachEventListeners();
        updateCardCounts();
    }

    // DOM 요소 캐싱
    function cacheDOMElements() {
        elements.columns = document.querySelectorAll('.column');
        elements.addCardBtn = document.getElementById('addCardBtn');
        elements.clearDataBtn = document.getElementById('clearDataBtn');
        elements.editModal = document.getElementById('editModal');
        elements.editForm = document.getElementById('editForm');
        elements.cancelEditBtn = document.getElementById('cancelEdit');
        elements.toast = document.getElementById('toast');
    }

    // LocalStorage에서 데이터 로드
    function loadFromLocalStorage() {
        try {
            const savedCards = localStorage.getItem('kanbanCards');
            if (savedCards) {
                cards = JSON.parse(savedCards);
                showToast('데이터를 불러왔습니다', 'success');
            } else {
                // 첫 방문 시 샘플 데이터 사용
                cards = defaultCards;
                saveToLocalStorage();
            }
        } catch (error) {
            console.error('LocalStorage 로드 실패:', error);
            cards = defaultCards;
            showToast('데이터 로드 중 오류 발생', 'error');
        }
    }

    // LocalStorage에 데이터 저장
    function saveToLocalStorage() {
        try {
            localStorage.setItem('kanbanCards', JSON.stringify(cards));
        } catch (error) {
            console.error('LocalStorage 저장 실패:', error);
            showToast('데이터 저장 실패', 'error');
        }
    }

    // 모든 카드 렌더링
    function renderAllCards() {
        // 모든 컬럼의 카드 컨테이너 비우기
        elements.columns.forEach(column => {
            const container = column.querySelector('.card-container');
            container.innerHTML = '';
        });

        // 컬럼별로 카드 정렬 및 렌더링
        ['todo', 'in-progress', 'done'].forEach(columnName => {
            const columnCards = cards
                .filter(card => card.column === columnName)
                .sort((a, b) => a.position - b.position);

            const column = document.querySelector(`[data-column="${columnName}"]`);
            const container = column.querySelector('.card-container');

            if (columnCards.length === 0) {
                container.innerHTML = '<div class="empty-message">카드를 드래그하여 이동하세요</div>';
            } else {
                columnCards.forEach(cardData => {
                    const cardElement = createCardElement(cardData);
                    container.appendChild(cardElement);
                });
            }
        });
    }

    // 카드 DOM 요소 생성
    function createCardElement(cardData) {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.dataset.cardId = cardData.id;
        card.dataset.priority = cardData.priority;

        const priorityText = {
            high: 'High',
            medium: 'Medium',
            low: 'Low'
        };

        card.innerHTML = `
            <h3>
                ${escapeHtml(cardData.title)}
                <span class="priority-badge priority-${cardData.priority}">${priorityText[cardData.priority]}</span>
            </h3>
            <p>${escapeHtml(cardData.description || '설명 없음')}</p>
            <div class="card-actions">
                <button class="card-btn edit-btn" onclick="KanbanBoard.editCard('${cardData.id}')">✏️ 편집</button>
                <button class="card-btn delete-btn" onclick="KanbanBoard.deleteCard('${cardData.id}')">🗑️ 삭제</button>
            </div>
        `;

        attachCardEventListeners(card);
        return card;
    }

    // HTML 이스케이프 (XSS 방지)
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 카드 이벤트 리스너 등록
    function attachCardEventListeners(card) {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    }

    // 전역 이벤트 리스너 등록
    function attachEventListeners() {
        // 컬럼 이벤트
        elements.columns.forEach(column => {
            column.addEventListener('dragover', handleDragOver);
            column.addEventListener('dragenter', handleDragEnter);
            column.addEventListener('dragleave', handleDragLeave);
            column.addEventListener('drop', handleDrop);
        });

        // 버튼 이벤트
        elements.addCardBtn.addEventListener('click', addNewCard);
        elements.clearDataBtn.addEventListener('click', clearAllData);

        // 모달 이벤트
        elements.editForm.addEventListener('submit', saveCardEdit);
        elements.cancelEditBtn.addEventListener('click', closeEditModal);
        elements.editModal.addEventListener('click', (e) => {
            if (e.target === elements.editModal) {
                closeEditModal();
            }
        });
    }

    // 드래그 시작
    function handleDragStart(e) {
        draggedCard = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    // 드래그 종료
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        elements.columns.forEach(column => {
            column.classList.remove('drag-over');
        });
    }

    // 드래그 오버
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    // 드래그 진입
    function handleDragEnter(e) {
        this.classList.add('drag-over');
    }

    // 드래그 이탈
    function handleDragLeave(e) {
        if (e.target.classList.contains('column')) {
            this.classList.remove('drag-over');
        }
    }

    // 드롭
    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        this.classList.remove('drag-over');

        if (draggedCard) {
            const targetColumn = this.dataset.column;
            const cardId = draggedCard.dataset.cardId;

            // 카드 데이터 업데이트
            const card = cards.find(c => c.id === cardId);
            if (card) {
                card.column = targetColumn;

                // 같은 컬럼 내 카드들의 position 재계산
                const columnCards = cards.filter(c => c.column === targetColumn);
                columnCards.forEach((c, index) => {
                    c.position = index;
                });

                saveToLocalStorage();
                renderAllCards();
                updateCardCounts();
                showToast('카드를 이동했습니다', 'success');
            }
        }

        return false;
    }

    // 새 카드 추가
    function addNewCard() {
        const title = prompt('카드 제목을 입력하세요:');
        if (!title || title.trim() === '') {
            showToast('제목을 입력해주세요', 'error');
            return;
        }

        const description = prompt('카드 설명을 입력하세요 (선택사항):');

        const newCard = {
            id: generateId(),
            title: title.trim(),
            description: description ? description.trim() : '',
            column: 'todo',
            priority: 'medium',
            position: cards.filter(c => c.column === 'todo').length
        };

        cards.push(newCard);
        saveToLocalStorage();
        renderAllCards();
        updateCardCounts();
        showToast('새 카드를 추가했습니다', 'success');
    }

    // 카드 편집
    function editCard(cardId) {
        const card = cards.find(c => c.id === cardId);
        if (!card) return;

        currentEditingCardId = cardId;

        // 모달에 현재 값 설정
        document.getElementById('editTitle').value = card.title;
        document.getElementById('editDescription').value = card.description;
        document.getElementById('editPriority').value = card.priority;

        // 모달 표시
        elements.editModal.classList.add('active');
    }

    // 카드 편집 저장
    function saveCardEdit(e) {
        e.preventDefault();

        const card = cards.find(c => c.id === currentEditingCardId);
        if (!card) return;

        const title = document.getElementById('editTitle').value.trim();
        if (!title) {
            showToast('제목을 입력해주세요', 'error');
            return;
        }

        card.title = title;
        card.description = document.getElementById('editDescription').value.trim();
        card.priority = document.getElementById('editPriority').value;

        saveToLocalStorage();
        renderAllCards();
        updateCardCounts();
        closeEditModal();
        showToast('카드를 수정했습니다', 'success');
    }

    // 모달 닫기
    function closeEditModal() {
        elements.editModal.classList.remove('active');
        currentEditingCardId = null;
        elements.editForm.reset();
    }

    // 카드 삭제
    function deleteCard(cardId) {
        const card = cards.find(c => c.id === cardId);
        if (!card) return;

        if (!confirm(`"${card.title}" 카드를 삭제하시겠습니까?`)) {
            return;
        }

        cards = cards.filter(c => c.id !== cardId);
        saveToLocalStorage();
        renderAllCards();
        updateCardCounts();
        showToast('카드를 삭제했습니다', 'success');
    }

    // 모든 데이터 초기화
    function clearAllData() {
        if (!confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return;
        }

        cards = defaultCards;
        saveToLocalStorage();
        renderAllCards();
        updateCardCounts();
        showToast('데이터를 초기화했습니다', 'success');
    }

    // 카드 개수 업데이트
    function updateCardCounts() {
        elements.columns.forEach(column => {
            const columnName = column.dataset.column;
            const cardCount = cards.filter(c => c.column === columnName).length;
            const countElement = column.querySelector('.card-count');
            countElement.textContent = cardCount;
        });
    }

    // 토스트 알림 표시
    function showToast(message, type = 'success') {
        elements.toast.textContent = message;
        elements.toast.className = `toast ${type}`;
        elements.toast.classList.add('show');

        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    }

    // Public API
    return {
        init: init,
        editCard: editCard,
        deleteCard: deleteCard
    };
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', KanbanBoard.init);
