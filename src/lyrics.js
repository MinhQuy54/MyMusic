// Lời bài hát "Gửi Anh Xa Nhớ" - Bích Phương (Sáng tác: Tiên Cookie)
// Đồng bộ chính xác dựa trên database LRCLIB
// Dịch +34.0s để khớp với bản MV dài 4:49 (giọng hát chính bắt đầu ở giây thứ 50.2)
const SHIFT = 34.0

const RAW = [
  [16.16, 'Anh xa nhớ anh có khỏe không'],
  [20.24, 'Em lâu lắm không viết thư tay'],
  [24.15, 'Đầu thư em chẳng biết nói gì'],
  [27.12, 'Ngoài câu em ở đây nhớ anh vơi đầy'],
  [32.18, 'Anh hãy cứ yên tâm công tác'],
  [36.44, 'Em da diết thủy chung một lòng'],
  [40.55, 'Ngày em nghĩ về anh thật nhiều'],
  [43.30, 'Để đêm đêm nằm mơ về anh'],
  
  [49.40, 'Anh đi hoài đường xa'],
  [53.71, 'Em vẫn chờ nơi ấy'],
  [57.45, 'Em yêu lắm đấy'],
  [59.48, 'Em thương lắm đấy'],
  [61.57, 'Em lo cho anh nhiều đấy'],
  [65.89, 'Mong đến ngày gặp nhau'],
  [69.85, 'Dẫu cách trở bao lâu'],
  [73.57, 'Mua bao thuốc lá'],
  [75.64, 'Mua dăm gói bánh'],
  [77.78, 'Anh sang thưa chuyện cùng em'],
  [81.77, 'Nghe anh'],
  
  [121.83, 'Anh xa nhớ anh có khỏe không'],
  [125.79, 'Em lâu lắm không viết thư tay'],
  [129.94, 'Đầu thư em chẳng biết nói gì'],
  [132.95, 'Ngoài câu em ở đây nhớ anh vơi đầy'],
  [138.20, 'Anh hãy cứ yên tâm công tác'],
  [142.12, 'Em da diết thủy chung một lòng'],
  [146.11, 'Ngày em nghĩ về anh thật nhiều'],
  [149.21, 'Để đêm đêm nằm mơ về anh'],
  
  [155.36, 'Anh đi hoài đường xa'],
  [159.41, 'Em vẫn chờ nơi ấy'],
  [163.34, 'Em yêu lắm đấy'],
  [165.28, 'Em thương lắm đấy'],
  [167.30, 'Em lo cho anh nhiều đấy'],
  [171.31, 'Mong đến ngày gặp nhau'],
  [175.67, 'Dẫu cách trở bao lâu'],
  [179.45, 'Mua bao thuốc lá'],
  [181.63, 'Mua dăm gói bánh'],
  [183.55, 'Anh sang thưa chuyện cùng em'],
  [187.86, 'Nghe anh'],
  
  [192.17, 'Anh đi hoài đường xa'],
  [196.15, 'Em vẫn chờ nơi ấy'],
  [199.90, 'Yêu xa khó lắm'],
  [201.95, 'Yêu xa nhớ lắm'],
  [203.95, 'Yêu xa cô đơn nhiều lắm'],
  [208.27, 'Mong đến ngày gặp nhau'],
  [212.12, 'Dẫu cách trở bao lâu'],
  [216.08, 'Mua bao thuốc lá'],
  [218.00, 'Mua dăm gói bánh'],
  [220.05, 'Anh sang thưa chuyện cùng em'],
  [224.41, 'Nghe anh']
]

export default RAW.map(([time, text]) => ({ time: time + SHIFT, text }))
