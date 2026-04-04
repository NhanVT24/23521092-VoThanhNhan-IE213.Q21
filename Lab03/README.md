# Mục tiêu bài thực hành
- hiểu các phần kết nối Controller, Router, DAO trong việc xây dựng mã nguồn
- Tạo các tệp tin controller, router và DAO cho review

# Công cụ và môi trường thực hiện
- cài đặt nodejs - nodejs.org
- sử dụng công cụ visual studio code
- cài đặt cây thư mục: Lab3/backend

# Cách chạy
- đi vào thử mục Lab03
cd Lab03
- vào tiếp thư mục backend nơi lưu dự án
cd backend
- chạy với lệnh
npm run dev 

# Kết quả đầu ra

Câu 1: Thiết lập định tuyến cho các thao tác của reviews
![alt text](router.png)

Câu 2: Thiết lập controller cho reviews

- Tạo tệp reviews.controller.js với lớp ReviewsController
![alt text](reviewsController.png)

- Tạo phương thức apiUpdateReview() để quản lý yêu cầu gửi từ khách
![alt text](apiUpdateReview.png)

- Tạo phương thức có tên apiDeleteReview() để quản lý các yêu cầu được gửi từ máy khách
![alt text](apiDeleteReview.png)

Câu 3: Thiết lập DAO cho reviews

- Tạo phương thức injectDB() giúp kết nối tới collection tương ứng trên db
![alt text](injectDB.png)

- Điều chỉnh việc gọi injectDB trên index
![alt text](index.png)

- Tạo phương thức addReview() để thêm review vào db
![alt text](addReview.png)

- Tạo phương thức updateReview() để sửa review trên db
![alt text](updateReview.png)

- Tạo phương thức deleteReview() để thêm review vào db
![alt text](deleteReview.png)

- Thử nghiệm API:

    - Thêm reviews
    ![alt text](addreviews.png)

    - Sửa reviews
    ![alt text](updatereviews.png)

    - Xóa reviews
    ![alt text](dlreviews.png)

Câu 4: Hoàn thành thiết lập BE

- Thêm 2 định tuyến
![alt text](dinhtuyen.png)

- Thêm phương thức apiGetMovieById
![alt text](apiGetMovieById.png)

- Thêm phương thức apiGetRatings
![alt text](apiGetRatings.png)

- Thêm phương thức DAO getRatings
![alt text](getRatings.png)

- Thêm phương thức DAO getMovieById
![alt text](getMovieById.png)

- Test API getRatings
![alt text](apigetRatings2.png)

- Test API getMovieById
![alt text](getMovieById2.png)

# Trình bày ngắn gọn phần chính đã thực hiện
- Thiết được được các file Controller, Dao để xây dựng API kết nối tới MongoDB cho review
- Cấu trúc hoạt động: Route → Controller → DAO → Database
- Công cụ hỗ trợ:
    - ChatGPT: Hỗ trợ việc code 
    - Lỗi API getMovieById