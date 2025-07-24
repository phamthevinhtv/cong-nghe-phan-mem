const app = require("./server");
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Lỗi khi khởi động server: ${err.message}`);
  } else {
    console.log(`Server đang chạy trên: http://localhost:${PORT}`);
  }
});
