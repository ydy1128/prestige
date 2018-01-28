export default [
    {
        writtenDate: (new Date()).getTime(),
        editedDate: (new Date()).getTime(),
        name: "손준혁",
        type: "teacher",
        id: "1234567",
        content: "준혁 선생",
        // replies: [String] // ids of comment
    },
    {
        writtenDate: (new Date()).getTime(),
        editedDate: (new Date()).getTime(),
        name: "윤대영인대영",
        type:"student",
        id: "1234565",
        content: "나는 윤대영인데영",
        // replies: [String] // ids of comment
    }
]

let CommentPoster = {
    props : {
        userId: "",
    },
    state : {
        editable : true,
    }
}

let Comment = {
    props : {
        userId: "",
        comments: [

        ]
    },
    state : {
        editable : true, // editable and removable
        content: "", // initialized with parent data 
    },
    function : {
           
    },
    render: {
    }
}

/*
comment에 replies 를 Comment component로 보여주며
새로운 Comment를 생성할수있는 기능을 넣으면 됨
db작업도 진행 필요
*/