// script.js

document.addEventListener('DOMContentLoaded', function() {
    const exampleList = document.querySelector('.example-list ul');
    const exampleContentDiv = document.getElementById('example-content');

    // 예시 데이터 (실제 메뉴얼 내용은 여기에 객체 형태로 저장)
    const examplesData = {
        'example_hq_standard': {
            title: '본사 - 표준 발급 메뉴얼',
            content: `
                <h3>본사 표준 발급 절차</h3>
                <p>본사 소속 직원의 표준 경력증명서 발급 절차입니다.</p>
                <ul>
                    <li>1. 신청서 접수: 인사팀 메일 또는 내부 시스템 통해 신청서 접수 확인.</li>
                    <li>2. 정보 확인: ERP 시스템에서 재직 기간, 직위, 부서 등 기본 정보 확인.</li>
                    <li>3. 내용 작성: 표준 양식에 따라 증명서 초안 작성 (성명, 주민등록번호, 주소, 재직 기간, 직위, 담당 업무 등).</li>
                    <li>4. 결재: 팀장 → 부서장 순으로 전자결재 진행.</li>
                    <li>5. 발급: 승인 완료 후 날인하여 PDF 파일 또는 출력물로 발급.</li>
                    <li>6. 전달: 신청자에게 등기우편 또는 이메일로 전달.</li>
                </ul>
                <p><strong>첨부 서류:</strong> 신분증 사본 (본인 확인용), 신청서 원본</p>
            `
        },
        'example_hq_resignation': {
            title: '본사 - 퇴사자 발급 메뉴얼',
            content: `
                <h3>본사 퇴사자 발급 절차</h3>
                <p>본사 퇴사 직원의 경력증명서 발급 절차입니다. 퇴직금 정산 여부 확인이 필수입니다.</p>
                <ul>
                    <li>1. 신청서 접수: 퇴사자용 신청서 접수 (퇴사 사유, 최종 직위 등 기재).</li>
                    <li>2. 정보 확인: 퇴사일, 최종 직위, 담당 업무, 퇴직금 정산 여부 확인.</li>
                    <li>3. 내용 작성: 퇴사일 기준으로 최종 경력 사항 작성.</li>
                    <li>4. 결재: 퇴사 관련 부서 (회계/재무팀) 협의 후 인사팀 최종 승인.</li>
                    <li>5. 발급: 승인 완료 후 발급.</li>
                    <li>6. 전달: 신청자에게 우편 또는 이메일로 전달.</li>
                </ul>
                <p><strong>유의사항:</strong> 퇴직금 정산이 완료된 이후에만 발급 가능합니다.</p>
            `
        },
        'example_branch_full': {
            title: '지역 - 풀타임 직원 발급 메뉴얼',
            content: `
                <h3>지역 지점 풀타임 직원 발급 절차</h3>
                <p>지역 지점 풀타임 직원의 경력증명서 발급 절차입니다. 지역 담당자 확인이 필요합니다.</p>
                <ul>
                    <li>1. 신청서 접수: 해당 지역 지점 담당자에게 신청서 접수.</li>
                    <li>2. 정보 확인: 지역 지점 담당자가 재직 정보(근무 시간, 담당 업무) 확인 후 본사 인사팀으로 공유.</li>
                    <li>3. 내용 작성: 본사 인사팀에서 해당 정보를 바탕으로 증명서 초안 작성.</li>
                    <li>4. 결재: 본사 인사팀 승인 후 지역 지점 담당자 최종 확인.</li>
                    <li>5. 발급: 본사에서 발급하여 지역 지점으로 송부.</li>
                    <li>6. 전달: 지역 지점 담당자가 신청자에게 전달.</li>
                </ul>
                <p><strong>참고:</strong> 본사 인사팀과 지역 지점 담당자 간의 긴밀한 협의가 중요합니다.</p>
            `
        },
        'example_branch_part': {
            title: '지역 - 파트타임 직원 발급 메뉴얼',
            content: `
                <h3>지역 지점 파트타임 직원 발급 절차</h3>
                <p>지역 지점 파트타임 직원의 경력증명서 발급 절차입니다. 근무 시간 명시가 중요합니다.</p>
                <ul>
                    <li>1. 신청서 접수: 파트타임 직원용 신청서 접수 (총 근무 시간, 시급 등 명시).</li>
                    <li>2. 정보 확인: 지역 지점 담당자가 근무 기록 시스템에서 정확한 근무 시간 확인.</li>
                    <li>3. 내용 작성: 총 근무 시간, 주당 근무 시간 등을 명확히 기재하여 작성.</li>
                    <li>4. 결재: 지역 지점 담당자 확인 후 본사 인사팀 승인.</li>
                    <li>5. 발급: 본사에서 발급.</li>
                    <li>6. 전달: 지역 지점 담당자가 신청자에게 전달.</li>
                </ul>
                <p><strong>특이사항:</strong> 필요 시 근무 시간 기록 시스템 증빙 자료를 첨부할 수 있습니다.</p>
            `
        }
        // 더 많은 예시 데이터 추가
    };

    // 예시 목록 아이템 클릭 이벤트 리스너
    exampleList.addEventListener('click', function(event) {
        const clickedItem = event.target;
        // li 태그를 클릭했는지 확인
        if (clickedItem.tagName === 'LI') {
            const exampleId = clickedItem.dataset.exampleId; // data-example-id 값 가져오기
            const exampleData = examplesData[exampleId]; // 해당 예시 데이터 조회

            if (exampleData) {
                // 예시 상세 내용 영역에 HTML 삽입
                exampleContentDiv.innerHTML = exampleData.content;

                // 클릭된 li에 'active' 클래스 추가 (선택된 예시 시각적 표시)
                // 기존 active 클래스 제거
                const currentActive = document.querySelector('.example-list li.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                // 새 active 클래스 추가
                clickedItem.classList.add('active');

            } else {
                exampleContentDiv.innerHTML = '<p>선택된 예시에 대한 내용을 찾을 수 없습니다.</p>';
            }
        }
    });

    // 페이지 로드 시 첫 번째 예시 내용을 기본으로 표시
    // if (exampleList.firstElementChild) {
    //     exampleList.firstElementChild.click();
    // }
});