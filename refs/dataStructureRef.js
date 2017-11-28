let Assignments = [
  {
    _id: "id",
    index: null, // class 안에서 추가된 순서
    title: null, // text
    content: null, // text
    downloads: [ ...urls ],
    uploads: {
      [STUDENT_ID]: [ ...urls ],
    }, // 학생이 제출한 파일
    accomplishments: ["studentId"], // 수행한 학생 id list
    dueDate: null,
    writtenDate: null,
    modifiedDate: null,
    /* TODO 추후 추가
    comments: [
      {
        id: "",
        contents: "",
        date: null,
      }
    ]
    */
  }
]

/*
강사
  시나리오
    > 수업 게시판 클릭
    > 해당 선생님의 class list 불러오기

    > 클래스(all or 선택)별 자신이 출제한 숙제 리스트가 보여짐
    > 기본적으로 리스트엔
      클래스(c) & title & 제출자/수강인원(c) & due date가 보여짐
    > 해당 assignment Click시 & assignment 추가 버튼 클릭 시
      > edit modal이 뜸
        > 필수 입력 항목 : title
        > 선택 입력 항목 : content | dueDate | attatchment (upload section을 통해 upload, download, delete)
        > 정보 제공 항목 : complishmentList | uploadedFiles | // TODO comments
학생
  시나리오
    > 수업 게시판 클릭
    > 클래스(선택 가능하지만 보통 1개)별 자신이 해야 할 숙제 리스트가 보여짐 class.assignments
    > 보여지는 list 방식은 강사와 동일
    > 해당 assignment Click시
      > 숙제 modal이 뜸
        > 정보 제공 항목 : title | content | dueDate | attatchment
        > 선택 입력 항목 : checkDone | upload (강사의 attatchment와 동일한 component) | complishmentList

*/
