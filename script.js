document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-display-section');
    const exampleList = document.querySelector('.example-list ul');
    const exampleContentDiv = document.getElementById('example-content');

    // --- 내비게이션 탭 전환 ---
    navItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();

            // 기존 active 클래스 제거
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // 선택된 항목에 active 부여 및 해당 섹션 표시
            this.classList.add('active');
            const targetId = this.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // --- 예시 데이터 ---
    const examplesData = {
        'example_hq_standard': {
            title: '본사 - 표준 발급 메뉴얼',
            content: `
                <h3>본사 표준 발급 절차</h3>
                <p>본사 소속 직원의 표준 경력증명서 발급 절차입니다.</p>
                <ul>
                    <li>1. 신청서 접수: 인사팀 메일 또는 내부 시스템 통해 신청서 접수 확인.</li>
                    <li>2. 정보 확인: ERP 시스템에서 재직 기간, 직위, 부서 등 기본 정보 확인.</li>
                    <li>3. 내용 작성: 표준 양식에 따라 증명서 초안 작성.</li>
                    <li>4. 결재: 팀장 → 부서장 순으로 전자결재 진행.</li>
                    <li>5. 발급: 승인 완료 후 날인하여 PDF 파일 또는 출력물로 발급.</li>
                    <li>6. 전달: 신청자에게 등기우편 또는 이메일로 전달.</li>
                </ul>
                <p><strong>첨부 서류:</strong> 신분증 사본, 신청서 원본</p>
            `
        },
        'example_hq_resignation': {
            title: '본사 - 퇴사자 발급 메뉴얼',
            content: `
                <h3>본사 퇴사자 발급 절차</h3>
                <p>퇴직금 정산 여부 확인이 필수입니다.</p>
                <ul>
                    <li>1. 신청서 접수: 퇴사자용 신청서 접수.</li>
                    <li>2. 정보 확인: 퇴사일, 최종 직위, 담당 업무 확인.</li>
                    <li>3. 내용 작성: 퇴사일 기준으로 최종 경력 사항 작성.</li>
                    <li>4. 결재: 회계/재무팀 협의 후 인사팀 최종 승인.</li>
                    <li>5. 발급 및 전달: 승인 완료 후 이메일 또는 우편 전달.</li>
                </ul>
                <p><strong>유의사항:</strong> 퇴직금 정산 완료 후 발급 가능</p>
            `
        },
        'example_branch_full': {
            title: '지역 - 풀타임 직원 발급 메뉴얼',
            content: `
                <h3>지역 지점 풀타임 직원 발급 절차</h3>
                <p>지역 담당자 확인이 필요합니다.</p>
                <ul>
                    <li>1. 신청서 접수: 지역 지점 담당자에게 신청서 접수.</li>
                    <li>2. 정보 확인: 재직 정보 확인 후 본사 인사팀 공유.</li>
                    <li>3. 내용 작성: 본사 인사팀이 초안 작성.</li>
                    <li>4. 결재: 본사 승인 후 지역 지점 확인.</li>
                    <li>5. 발급 및 전달: 본사에서 발급 후 지점 전달.</li>
                </ul>
                <p><strong>참고:</strong> 본사-지점 간 협의 필수</p>
            `
        },
        'example_branch_part': {
            title: '지역 - 파트타임 직원 발급 메뉴얼',
            content: `
                <h3>지역 지점 파트타임 직원 발급 절차</h3>
                <p>근무 시간 명시가 중요합니다.</p>
                <ul>
                    <li>1. 신청서 접수: 총 근무 시간, 시급 등 포함된 신청서 접수.</li>
                    <li>2. 정보 확인: 근무 기록 확인.</li>
                    <li>3. 내용 작성: 총 근무 시간, 주당 시간 기재.</li>
                    <li>4. 결재: 지점 확인 후 본사 승인.</li>
                    <li>5. 발급 및 전달: 본사 발급 → 지점 통해 전달.</li>
                </ul>
                <p><strong>특이사항:</strong> 필요 시 근무기록 첨부 가능</p>
            `
        }
    };

    // --- 예시 클릭 시 내용 표시 ---
    if (exampleList) {
        exampleList.addEventListener('click', function (event) {
            const clickedItem = event.target;
            if (clickedItem.tagName === 'LI') {
                const exampleId = clickedItem.dataset.exampleId;
                const exampleData = examplesData[exampleId];

                if (exampleData) {
                    exampleContentDiv.innerHTML = exampleData.content;

                    // 이전 active 제거
                    const currentActive = document.querySelector('.example-list li.active');
                    if (currentActive) currentActive.classList.remove('active');

                    // 현재 클릭 항목 active
                    clickedItem.classList.add('active');
                } else {
                    exampleContentDiv.innerHTML = '<p>선택된 예시에 대한 내용을 찾을 수 없습니다.</p>';
                }
            }
        });
    }

    // --- 초기 탭 강제 클릭 (초기화) ---
    if (navItems.length > 0) {
        navItems[0].click();
    }
});

document.querySelectorAll('.sub-tab').forEach(tab => {
    tab.addEventListener('click', function (e) {
        e.preventDefault();

        // 탭 활성화 클래스 처리
        document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const target = this.getAttribute('data-target');

        // 경력사항 영역 전환
        document.querySelectorAll('.example-content-pane').forEach(pane => pane.classList.remove('active'));
        document.querySelector(`#career-details-${target}`).classList.add('active');
        document.querySelector(`#certificate-view-${target}`).classList.add('active');
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("manualSearchInput");
    const manualItems = document.querySelectorAll("#manual-section .manual-item");
    let currentIndex = -1;   // 현재 하이라이트 인덱스
    let highlights = [];     // 현재 검색어로 생성된 하이라이트 목록

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();

            const query = this.value.trim().toLowerCase();

            // 첫 Enter → 검색 & 하이라이트 & 첫 스크롤
            if (currentIndex < 0) {
                manualItems.forEach(item => {
                    // 원본 HTML 백업
                    if (!item.hasAttribute("data-original-html")) {
                        item.setAttribute("data-original-html", item.innerHTML);
                    }
                    // 원본으로 복원
                    item.innerHTML = item.getAttribute("data-original-html");
                    // 키워드가 있으면 하이라이트 적용
                    if (query) {
                        highlightText(item, query);
                    }
                });
                // 새로 생성된 하이라이트 목록 수집
                highlights = Array.from(document.querySelectorAll("#manual-section .highlight"));
                if (highlights.length > 0) {
                    currentIndex = 0;
                    highlights[0].scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
            // 그 다음 Enter → 다음 하이라이트로 순환
            else {
                if (highlights.length > 0) {
                    currentIndex = (currentIndex + 1) % highlights.length;
                    highlights[currentIndex].scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        }
    });

    /**
     * 요소 내 텍스트 노드에 대해 검색어를 <span class="highlight">로 감싸는 함수
     * @param {HTMLElement} element - 탐색 대상 요소
     * @param {string} keyword    - 검색어 (정규식으로 사용)
     */
    function highlightText(element, keyword) {
        const regex = new RegExp(`(${keyword})`, "gi");
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];

        // 모든 텍스트 노드 수집
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        // 각 텍스트 노드에 하이라이트 태그 적용
        textNodes.forEach(node => {
            const parent = node.parentNode;
            if (parent && !parent.classList.contains("highlight")) {
                const replaced = node.nodeValue.replace(regex, '<span class="highlight">$1</span>');
                if (replaced !== node.nodeValue) {
                    const wrapper = document.createElement("span");
                    wrapper.innerHTML = replaced;
                    parent.replaceChild(wrapper, node);
                }
            }
        });
    }
});





document.addEventListener("DOMContentLoaded", function () {
    const colorPalette = [
        "#fce4ec", "#e3f2fd", "#e8f5e9", "#fff3e0", "#ede7f6",
        "#f9fbe7", "#e0f2f1", "#fbe9e7", "#f3e5f5", "#e0f7fa"
    ];

    const sections = [
        {
            certSelector: "#consolidated-career-table tbody",    // 본사 경력확인서
            rawSelector:  "#raw-career-table tbody"              // 본사 경력사항
        },
        {
            certSelector: "#consolidated-career-table-local tbody", // 지역 경력확인서
            rawSelector:  "#raw-career-table-local tbody"           // 지역 경력사항
        }
    ];

    sections.forEach(({ certSelector, rawSelector }) => {
        const certTbody = document.querySelector(certSelector);
        const rawTbody  = document.querySelector(rawSelector);
        if (!certTbody || !rawTbody) return;

        const periodColorMap = {};
        let colorIndex = 0;

        Array.from(certTbody.rows).forEach(certRow => {
            const noCell     = certRow.cells[0];
            const periodCell = certRow.cells[1];
            if (!noCell || !periodCell) return;

            const certNo    = noCell.textContent.trim();
            const periodTxt = periodCell.textContent.trim();
            if (!periodTxt.includes("~")) return;

            if (!periodColorMap[periodTxt]) {
            periodColorMap[periodTxt] = colorPalette[colorIndex++ % colorPalette.length];
            }
            const color = periodColorMap[periodTxt];
            certRow.style.backgroundColor = color;

            const [start, end] = periodTxt
            .replace(/\./g, "")
            .split("~")
            .map(s => s.trim());

            Array.from(rawTbody.rows).forEach(rawRow => {
            const dateCell = rawRow.cells[1];  // 0번째가 번호, 1번째가 날짜로 인덱스 변경
            if (!dateCell) return;
            const rawDate = dateCell.textContent.replace(/[\/\.]/g, "").trim();

            if (rawDate >= start && rawDate <= end) {
                // 배경색
                rawRow.style.backgroundColor = color;
                // 번호 채우기
                const numberCell = rawRow.querySelector('.number-cell');
                if (numberCell) {
                numberCell.textContent = certNo;
                numberCell.classList.add('number-prefix');  // 배지 스타일 적용
                }
            }
            });
        });
        });

});




// 페이지 로드 시 '본사' 탭을 기본으로 선택
document.addEventListener("DOMContentLoaded", function () {
    const defaultTab = document.querySelector('.sub-tab[data-target="hq"]');
    if (defaultTab) defaultTab.click();
});