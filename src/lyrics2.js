// Lời bài hát "Tình Yêu Giữa Mùa Đông" - Phan Mạnh Quỳnh
// LRC đồng bộ theo timestamps chuẩn

const RAW = [
  [18.50, 'Hòa vào dòng người vội vàng trên phố đông'],
  [22.00, 'Em đang bên anh yêu thương ấm nồng'],
  [26.50, 'Sau biết bao những tháng ngày chờ trông, và mơ mộng.'],
  [35.00, 'Ngập ngừng rồi chợt em nắm lấy tay anh'],
  [39.00, 'Ngỡ như mùa đông đã không còn lạnh'],
  [43.50, 'Ngỡ như đêm nay là đêm xuân xanh đầy an lành.'],
  [50.00, 'Vì tình yêu sẽ xóa tan giá băng'],
  [53.00, 'Mỗi khi em ôm chặt anh môi hôn nồng nàn'],
  [58.50, 'Và trong anh chợt ngỡ như sống trong giấc mơ'],
  [62.00, 'Bấy lâu anh mơ hạnh phúc ngập tràn.'],
  [67.00, 'Cuộc đời anh dành để yêu sẽ yêu mỗi em và mãi mãi yêu em hoài'],
  [75.00, 'Chẳng cần chi sao băng vì anh luôn ước bên em lâu dài.'],
  [96.50, 'Nụ cười là điều anh muốn thấy nơi em'],
  [100.00, 'Điều anh mang cảm giác êm đềm'],
  [105.00, 'Khiến cho anh phải nhớ nhung ngày đêm dù kề bên.'],
  [113.00, 'Đừng vội giận hờn khi anh lỡ sai'],
  [117.30, 'Có khi đang yêu làm ta khờ dại'],
  [121.00, 'Cách xa đôi khi nhưng rồi hiện tại mình quay lại đấy thôi.'],
  [128.70, 'Vì tình yêu sẽ xóa tan giá băng'],
  [132.00, 'Mỗi khi em ôm chặt anh môi hôn nồng nàn'],
  [137.50, 'Và trong anh chợt ngỡ như sống trong giấc mơ'],
  [140.50, 'Bấy lâu anh mơ hạnh phúc ngập tràn.'],
  [146.00, 'Cuộc đời anh dành để yêu sẽ yêu mỗi em và mãi mãi yêu em hoài'],
  [153.00, 'Chẳng cần chi sao băng vì anh luôn ước bên em lâu dài.'],
  [162.00, 'Vì tình yêu sẽ xóa tan giá băng'],
  [164.40, 'Mỗi khi em ôm chặt anh môi hôn nồng nàn'],
  [170.60, 'Và trong anh chợt ngỡ như sống trong giấc mơ'],
  [175.00, 'Bấy lâu anh mơ hạnh phúc ngập tràn.'],
  [179.00, 'Cuộc đời anh dành để yêu sẽ yêu mỗi em và mãi mãi yêu em hoài'],
  [186.60, 'Chẳng cần chi sao băng vì anh luôn ước bên em lâu dài.'],
]

export default RAW.map(([time, text]) => ({ time, text }))
