import wave
import struct
import math

def check_timestamps(filepath, shift):
    # These are the standard LRC timestamps in seconds (relative to 00:00.00)
    std_times = [
        (16.16, "Anh xa nhớ anh có khỏe không"),
        (20.30, "Em lâu lắm không viết thư tay"),
        (24.40, "Đầu thư em chẳng biết nói gì"),
        (28.10, "Ngoài câu em ở đây nhớ anh vơi đầy"),
        (33.30, "Anh hãy cứ yên tâm công tác"),
        (37.30, "Em da diết thủy chung một lòng"),
        (41.20, "Ngày em nghĩ về anh thật nhiều"),
        (45.00, "Để đêm đêm nằm mơ về anh"),
        (49.20, "Anh đi hoài đường xa"),
        (52.40, "Em vẫn chờ nơi ấy"),
        (54.40, "Em yêu lắm đấy"),
        (56.50, "Em thương lắm đấy"),
        (58.50, "Em lo cho anh nhiều đấy"),
        (62.40, "Mong đến ngày gặp nhau"),
        (66.00, "Dẫu cách trở bao lâu"),
        (69.10, "Mua bao thuốc lá"),
        (71.10, "Mua dăm gói bánh"),
        (73.20, "Anh sang thưa chuyện cùng em nghe anh")
    ]
    
    w = wave.open(filepath, 'rb')
    frame_rate = w.getframerate()
    
    print(f"{'Text':<40} | {'Std Time':<10} | {'Shifted':<10} | {'Volume (RMS)':<15}")
    print("-" * 85)
    
    for t_std, text in std_times:
        t_shifted = t_std + shift
        # Read a 0.2s chunk starting 0.1s before the timestamp
        start_frame = int((t_shifted - 0.1) * frame_rate)
        w.setpos(start_frame)
        
        frames = w.readframes(int(frame_rate * 0.2))
        count = len(frames) // 2
        fmt = f"<{count}h"
        samples = struct.unpack(fmt, frames)
        rms = math.sqrt(sum(s**2 for s in samples)/count) if count > 0 else 0
        
        print(f"{text:<40} | {t_std:8.2f}s | {t_shifted:8.2f}s | {rms:12.2f}")
        
    w.close()

if __name__ == "__main__":
    check_timestamps("/Users/minhquy54/Desktop/MusicYum/song_temp.wav", 27.54)
