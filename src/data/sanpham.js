const sanpham = [
  {
    ten: "iPhone 13",
    hang: "Apple",
    bonho: [
      "128GB",
      "256GB",
      "512GB"
    ],
    mau: [
      "Đỏ",
      "Ánh Sao",
      "Đêm Xanh Thẳm",
      "Xanh Dương",
      "Hồng",
      "Xanh Lá"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip13-1.png",
    hinhAnh: [
      "/images/ip13-1.png",
      "/images/ip13-2.png",
      "/images/ip13-3.png",
      "/images/ip13-4.png"
    ],
    mota: `iPhone 13 sở hữu màn hình Super Retina XDR OLED 6,1 inch,
chip A15 Bionic và thiết kế nhôm kết hợp mặt trước Ceramic Shield.
Máy được trang bị hệ thống camera kép 12MP với camera Chính và Ultra Wide,
hỗ trợ Chế độ Ban Đêm, Photographic Styles và quay video Dolby Vision 4K.
iPhone 13 có khả năng chống nước và bụi IP68, Face ID và hỗ trợ MagSafe.`
  },

  {
    ten: "iPhone 15",
    hang: "Apple",
    bonho: [
      "128GB",
      "256GB",
      "512GB"
    ],
    mau: [
      "Đen",
      "Xanh Dương",
      "Xanh Lá",
      "Vàng",
      "Hồng"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip15-1.png",
    hinhAnh: [
      "/images/ip15-1.png",
      "/images/ip15-2.png",
      "/images/ip15-3.png",
      "/images/ip15-4.png"
    ],
    mota: `iPhone 15 nổi bật với màn hình Super Retina XDR OLED 6,7 inch
và Dynamic Island. Máy sử dụng chip A16 Bionic, camera chính 48MP
kết hợp camera Ultra Wide 12MP, hỗ trợ chụp ảnh độ phân giải cao,
Chế độ Ban Đêm và quay video 4K Dolby Vision. Thiết bị có thiết kế nhôm,
mặt trước Ceramic Shield, cổng USB-C và khả năng chống nước IP68.`
  },

  {
    ten: "iPhone 16",
    hang: "Apple",
    bonho: [
      "128GB",
      "256GB",
      "512GB"
    ],
    mau: [
      "Đen",
      "Trắng",
      "Hồng",
      "Xanh Mòng Két",
      "Xanh Lưu Ly"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip16-1.png",
    hinhAnh: [
      "/images/ip16-1.png",
      "/images/ip16-2.png",
      "/images/ip16-3.png",
      "/images/ip16-4.png"
    ],
    mota: `iPhone 16 sở hữu màn hình Super Retina XDR OLED 6,1 inch,
Dynamic Island và chip A18. Hệ thống camera kép gồm camera chính
48MP Fusion và camera Ultra Wide 12MP, hỗ trợ chụp ảnh macro,
Chế độ Ban Đêm và quay video 4K Dolby Vision. Máy có nút Tác Vụ,
Điều Khiển Camera, USB-C, hỗ trợ Apple Intelligence và chuẩn IP68.`
  },

  {
    ten: "iPhone 16 Plus",
    hang: "Apple",
    bonho: [
      "128GB",
      "256GB",
      "512GB"
    ],
    mau: [
      "Đen",
      "Trắng",
      "Hồng",
      "Xanh Mòng Két",
      "Xanh Lưu Ly"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip16plus-1.png",
    hinhAnh: [
      "/images/ip16plus-1.png",
      "/images/ip16plus-2.png",
      "/images/ip16plus-3.png",
      "/images/ip16plus-4.png"
    ],
    mota: `iPhone 16 Plus mang đến màn hình Super Retina XDR OLED 6,7 inch
với Dynamic Island và chip A18. Máy có hệ thống camera kép tiên tiến
với camera chính 48MP Fusion và camera Ultra Wide 12MP,
hỗ trợ chụp ảnh macro, Chế độ Ban Đêm và quay video 4K Dolby Vision.
Thiết bị hỗ trợ Apple Intelligence, Điều Khiển Camera, USB-C và chống nước IP68.`
  },

  {
    ten: "iPhone 16 Pro Max",
    hang: "Apple",
    bonho: [
      "256GB",
      "512GB",
      "1TB"
    ],
    mau: [
      "Titan Đen",
      "Titan Trắng",
      "Titan Tự Nhiên",
      "Titan Sa Mạc"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip16prm-1.png",
    hinhAnh: [
      "/images/ip16prm-1.png",
      "/images/ip16prm-2.png",
      "/images/ip16prm-3.png",
      "/images/ip16prm-4.png"
    ],
    mota: `iPhone 16 Pro Max sở hữu màn hình Super Retina XDR OLED 6,9 inch
với ProMotion lên đến 120Hz và thiết kế titan. Máy được trang bị
chip A18 Pro cùng hệ thống camera Pro với camera Fusion 48MP,
Ultra Wide 48MP và Telephoto 12MP. Thiết bị hỗ trợ Apple Intelligence,
quay video chuyên nghiệp, USB-C và chống nước IP68.`
  },

  {
    ten: "iPhone 17",
    hang: "Apple",
    bonho: [
      "256GB",
      "512GB"
    ],
    mau: [
      "Đen",
      "Trắng",
      "Xanh Lam Khói",
      "Xanh Lá Xô Thơm",
      "Tím Oải Hương"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip17-1.png",
    hinhAnh: [
      "/images/ip17-1.png",
      "/images/ip17-2.png",
      "/images/ip17-3.png",
      "/images/ip17-4.png"
    ],
    mota: `iPhone 17 sở hữu màn hình Super Retina XDR OLED 6,3 inch,
Dynamic Island, màn hình Luôn Bật và ProMotion thích ứng lên đến 120Hz.
Máy sử dụng hệ thống camera 48MP Dual Fusion, hỗ trợ chụp ảnh macro 48MP,
Apple Intelligence và khả năng chống nước IP68.
Thiết kế sử dụng khung nhôm và mặt sau bằng kính pha màu.`
  },

  {
    ten: "iPhone 17e",
    hang: "Apple",
    bonho: [
      "256GB",
      "512GB"
    ],
    mau: [
      "Đen",
      "Trắng",
      "Hồng Phai"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip17e-1.png",
    hinhAnh: [
      "/images/ip17e-1.png",
      "/images/ip17e-2.png",
      "/images/ip17e-3.png",
      "/images/ip17e-4.png"
    ],
    mota: `iPhone 17e sở hữu màn hình Super Retina XDR OLED 6,1 inch
và chip A19. Máy có camera 48MP Fusion với khả năng hỗ trợ Telephoto 2x,
camera trước 12MP TrueDepth và quay video 4K Dolby Vision.
Thiết bị sử dụng Ceramic Shield 2 ở mặt trước, hỗ trợ Apple Intelligence
và đạt chuẩn chống nước IP68.`
  },

  {
    ten: "iPhone 17 Pro Max",
    hang: "Apple",
    bonho: [
      "256GB",
      "512GB",
      "1TB",
      "2TB"
    ],
    mau: [
      "Bạc",
      "Cam Vũ Trụ",
      "Xanh Đậm"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip17prm-1.png",
    hinhAnh: [
      "/images/ip17prm-1.png",
      "/images/ip17prm-2.png",
      "/images/ip17prm-3.png",
      "/images/ip17prm-4.png"
    ],
    mota: `iPhone 17 Pro Max được thiết kế với khung nhôm nguyên khối,
mặt trước Ceramic Shield 2 và màn hình Super Retina XDR OLED 6,9 inch
với ProMotion lên đến 120Hz. Máy sử dụng chip A19 Pro và hệ thống
camera 48MP Pro Fusion với camera Telephoto hỗ trợ zoom chất lượng
quang học lên đến 8x. Thiết bị hỗ trợ quay video chuyên nghiệp,
Apple Intelligence, USB-C và chống nước IP68.`
  },

  {
    ten: "iPhone 18 Pro Max",
    hang: "Apple",
    bonho: [
      "256GB",
      "512GB",
      "1TB",
      "2TB"
    ],
    mau: [
      "Đen",
      "Bạc",
      "Băng Thanh",
      "Đỏ Burgundy"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip18prm-1.png",
    hinhAnh: [
      "/images/ip18prm-1.png",
      "/images/ip18prm-2.png",
      "/images/ip18prm-3.png",
      "/images/ip18prm-4.png"
    ],
    mota: `iPhone 18 Pro Max sở hữu màn hình Super Retina XDR OLED 6,9 inch
với thiết kế nguyên khối nhôm và Ceramic Shield 2. Máy sử dụng chip A20 Pro
và hệ thống camera 48MP Pro Fusion với camera chính khẩu độ thay đổi,
Ultra Wide và Telephoto. Hệ thống camera hỗ trợ zoom chất lượng quang học
lên đến 8x. Máy có camera trước 18MP Center Stage, hỗ trợ Apple Intelligence,
quay video chuyên nghiệp và sạc nhanh.`
  },

  {
    ten: "iPhone 18 Pro",
    hang: "Apple",
    bonho: [
      "256GB",
      "512GB",
      "1TB",
      "2TB"
    ],
    mau: [
      "Đen",
      "Bạc",
      "Băng Thanh",
      "Đỏ Burgundy"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ip18pro-1.png",
    hinhAnh: [
      "/images/ip18pro-1.png",
      "/images/ip18pro-2.png",
      "/images/ip18pro-3.png",
      "/images/ip18pro-4.png"
    ],
    mota: `iPhone 18 Pro sở hữu màn hình Super Retina XDR OLED 6,3 inch
và thiết kế nguyên khối nhôm. Máy sử dụng chip A20 Pro cùng hệ thống
camera 48MP Pro Fusion với camera chính khẩu độ thay đổi, Ultra Wide
và Telephoto. Camera trước 18MP Center Stage hỗ trợ các tính năng
chụp ảnh và gọi video linh hoạt. Thiết bị hỗ trợ Apple Intelligence
và các tính năng quay video chuyên nghiệp.`
  },

  {
    ten: "iPhone Air",
    hang: "Apple",
    bonho: [
      "256GB",
      "512GB",
      "1TB"
    ],
    mau: [
      "Đen Không Gian",
      "Trắng Mây",
      "Vàng Nhạt",
      "Xanh Da Trời"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ipair-1.png",
    hinhAnh: [
      "/images/ipair-1.png",
      "/images/ipair-2.png",
      "/images/ipair-3.png",
      "/images/ipair-4.png"
    ],
    mota: `iPhone Air nổi bật với thiết kế titan mỏng 5,64 mm,
màn hình Super Retina XDR OLED 6,5 inch và ProMotion lên đến 120Hz.
Máy sử dụng chip A19 Pro, camera 48MP Fusion và camera trước
18MP Center Stage. Thiết bị hỗ trợ Apple Intelligence, Wi-Fi 7,
Bluetooth 6, USB-C và chuẩn chống nước IP68.`
  },

  {
    ten: "iPhone Duo",
    hang: "Apple",
    bonho: [
      "256GB",
      "512GB",
      "1TB",
      "2TB"
    ],
    mau: [
      "Trời Đêm",
      "Trắng Ánh Sao"
    ],
    baohanh: "12 tháng",
    hinh: "/images/ipduo-1.png",
    hinhAnh: [
      "/images/ipduo-1.png",
      "/images/ipduo-2.png"

    ],
    mota: `iPhone Duo là mẫu iPhone gập đầu tiên của Apple.
Thiết bị có màn hình Super Retina XDR OLED 7,6 inch khi mở và
màn hình ngoài 5,4 inch khi đóng. Máy sử dụng chip A20 Pro,
hệ thống camera 48MP Dual Fusion và camera trước 12MP Center Stage.
Thiết kế sử dụng titan, hỗ trợ Apple Pencil USB-C, Wi-Fi 7,
Bluetooth 6 và chống nước, chống bụi IP68.`
  }
];

export default sanpham;