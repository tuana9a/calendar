/* 
startTime   thời gian bắt đầu theo milisecond
startDate   ngày bắt đầu (mục đích check trùng lặp)
finishTime  thời gian kết thúc
finishDate  ngày kết thúc (mục đích check trùng lặp)
duration    khoảng thời gian xảy ra sự kiện
title       tên event
contentHtml nội dung của content với html
repeat      lặp lại cái này khi submit sẽ được xử lý      
remind      lời nhắc
note        user có thể ghi note lại
finished    đã kết thúc, xong hay chưa
deleted     đã xóa hay chưa
userId      id của user

có thể nếu sau này rảnh có thể làm thêm cái location nữa
*/
class UserEvent {
    id;
    startTime;
    startDate;
    finishTime;
    finishDate;
    duration;
    title;
    contentHtml;
    repeat;
    remind;
    note;
    finished;
    deleted;
    userId;
}

module.exports = {
    UserEvent: UserEvent,
};
