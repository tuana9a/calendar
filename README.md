# calendar

cấu trúc project như sau

resource/       chứa các tài nguyên để hệ thống sử dụng gồm app.conf.json, ...

webapp/         là nơi chứa source frontend

main.js         là code khởi chạy chương trình

apis.js         là nơi chứa các code xử lý khi nhận request trong mô hình mvc với các logic đơn giản thì có thể viết trực tiếp trong apis.js này

controllers/    với các nghiệp vụ phức tạp (có kết nối tới db) thì phải tạo class và viết code trong đây sau đó api.js sẽ gọi tới các class trong này

configs.js      chứa toàn bộ config của project

models/         chứa các model trong mô hình MVC gồm user, event, ...

utils.js        tập các tiện ích cho project

# coding

singpleton

MVC

express

mongodb

# how to run

npm start