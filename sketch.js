let fireworks = []; 
let font;
let fireworkSound;

function preload() {
  soundFormats('mp3');
  fireworkSound = loadSound('fireworks.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  fireworkSound.playMode('sustain'); 
  fireworkSound.setVolume(0.3); // Giảm âm lượng xuống 30%
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 2. MOUSE PRESSED: Tạo pháo hoa mới tại vị trí chuột
function mousePressed() {
  let f = new Firework(mouseX, mouseY);
  fireworks.push(f);
  if (fireworkSound.isLoaded()) {
    fireworkSound.rate(random(1.5, 3));
    fireworkSound.play();
  }
}

// 3. DRAW: Vòng lặp vẽ và tạo hiệu ứng pháo hoa
function draw() {
  background(0, 25); // Tạo hiệu ứng mờ dần (trails)

  // Lặp ngược mảng để an toàn khi xóa phần tử
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let f = fireworks[i];
    
    f.update();  // Tính toán vị trí
    f.show();    // Hiển thị pháo hoa

    // Xóa pháo hoa đã nổ xong để giải phóng bộ nhớ
    if (f.isFinished()) {
      fireworks.splice(i, 1);
    }
  }

  // 2. Thêm chữ hiển thị trên màn hình
  push(); // Bắt đầu trạng thái phong cách tạm thời
  translate(width / 2, height / 6); // Di chuyển đến giữa phía trên màn hình
  textAlign(CENTER, CENTER);
  textSize(30);            
  textFont('Candal');
  noFill();
  
  // Dòng chữ chính
  fill(255, 112, 193);   
  text("MỪNG TUỔI 18 HAI CHỊ ĐẸP!!!!", 0, 0); 
  text("❤️‍🔥👾❤️‍🔥", 0, 40); // Biểu tượng
  text("SU YÊU HAI CHỊ NHIỀU LẮM KKKK ☘️", 0, 80); 
  
  // Dòng chữ hướng dẫn
  textSize(20);            
  fill(200, 200, 255); 
  text("Nhấn vào bất kỳ đâu để bắn pháo hoa!", 0, 140);
  text("Chú ý: GIẢM NHỎ ÂM LƯỢNG!", 0, 180); 
  pop(); // Kết thúc trạng thái phong cách
}

// 4. THE CLASS: Bản thiết kế cho một quả pháo hoa
class Firework {
  
  constructor(targetX, targetY) {
    this.stopX = targetX;
    this.stopY = targetY;
    this.y = height; 
    this.color = color(random(255), random(255), random(255));
    
    // 1. Chọn hình dạng ngẫu nhiên
    this.shapeType = random(['circle', 'heart', 'star', 'flower']);
    
    // 2. Điều chỉnh mật độ hạt tùy theo hình dạng
    if (this.shapeType === 'circle') {
       this.scatters = int(random(1, 20)) * 4;  // Vòng tròn cần ít hạt hơn
    } else {
       this.scatters = 80; // Hình dạng phức tạp cần nhiều hạt
    }

    this.steps = 20; // Thời gian vụ nổ kéo dài
    this.angle = TWO_PI / this.scatters;
    this.currentStep = 0;
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      this.y -= 10; 
      if (this.y <= this.stopY) {
        this.exploded = true;
      }
    } else {
      if (this.currentStep < this.steps) {
        this.currentStep++;
      }
    }
  }

  show() {
    noStroke();
    fill(this.color);

    if (!this.exploded) {
      ellipse(this.stopX, this.y, 10, 40); // Quả pháo bay lên
    } else {
      push(); 
      translate(this.stopX, this.stopY);
      
      // Vẽ từng hạt trong vụ nổ
      for (let j = 0; j < this.scatters; j++) {
        
        let theta = this.angle * j; // Góc hiện tại (radians)
        let r = 10 * this.currentStep; // Bán kính nở ra
        
        let x2 = 0;
        let y2 = 0;

        // 3. ÁP DỤNG TOÁN HỌC CHO CÁC HÌNH DẠNG
        
        if (this.shapeType === 'circle') {
            // Hình tròn
            x2 = cos(theta) * r;
            y2 = sin(theta) * r;
        } 
        else if (this.shapeType === 'heart') {
            // Hình trái tim
            let scale = r / 15; 
            x2 = scale * 16 * pow(sin(theta), 3);
            y2 = -scale * (13 * cos(theta) - 5 * cos(2*theta) - 2 * cos(3*theta) - cos(4*theta)); 
        }
        else if (this.shapeType === 'star') {
            // Hình ngôi sao
            let starR = r * (0.5 + 0.5 * sin(9 * theta));
            x2 = starR * cos(theta);
            y2 = starR * sin(theta);
        }
        else if (this.shapeType === 'flower') {
            // Hình bông hoa
            let flowerR = r * (0.8 + 0.5 * sin(5 * theta));
            x2 = flowerR * cos(theta);
            y2 = flowerR * sin(theta);
        }

        ellipse(x2, y2, random(2, 4), random(2, 4));
      }
      pop();
    }
  }

  // Kiểm tra xem pháo hoa đã nổ xong chưa
  isFinished() {
    if (this.exploded && this.currentStep >= this.steps) {
      return true;
    }
    return false;
  }
}
