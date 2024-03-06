import re

import matplotlib.pyplot as plt
import numpy as np

def extract_values(filename):
    values = []
    with open(filename, 'r') as file:
        for line in file:
            # Sử dụng regular expression để tìm các giá trị số trước "MiB"
            matches = re.findall(r'(\d+(?:\.\d+)?)MiB', line)
            if matches:
                # Lấy giá trị số trước "MiB" và thêm vào list values
                values.extend(matches)
    return values

# Thay đổi đường dẫn tới file txt của bạn
filename = 'docker_stats.txt'
values = extract_values(filename)

# Chia list thành các sublist có kích thước là 10 (mỗi sublist tương ứng với 10 giá trị của mỗi giây)
sublists = [values[i:i+10] for i in range(0, len(values), 10)]

# Màu sắc cho từng node
colors = ['b', 'g', 'r', 'c', 'm', 'y', 'k', 'tab:orange', 'tab:purple', 'tab:brown']

xpoints = [i + 1 for i in range(len(sublists))]
yPoints1 = [float(slt[0]) for slt in sublists]
yPoints2 = [float(slt[1]) for slt in sublists]
yPoints3 = [float(slt[2]) for slt in sublists]
yPoints4 = [float(slt[3]) for slt in sublists]
yPoints5 = [float(slt[4]) for slt in sublists]
yPoints6 = [float(slt[5]) for slt in sublists]
yPoints7 = [float(slt[6]) for slt in sublists]
yPoints8 = [float(slt[7]) for slt in sublists]
yPoints9 = [float(slt[8]) for slt in sublists]
yPoints10 = [float(slt[9]) for slt in sublists]

plt.plot(xpoints, yPoints1, label='Node 1', color=colors[0])
plt.plot(xpoints, yPoints2, label='Node 2', color=colors[1])
plt.plot(xpoints, yPoints3, label='Node 3', color=colors[2])
plt.plot(xpoints, yPoints4, label='Node 4', color=colors[3])
plt.plot(xpoints, yPoints5, label='Node 5', color=colors[4])
plt.plot(xpoints, yPoints6, label='Node 6', color=colors[5])
plt.plot(xpoints, yPoints7, label='Node 7', color=colors[6])
plt.plot(xpoints, yPoints8, label='Node 8', color=colors[7])
plt.plot(xpoints, yPoints9, label='Node 9', color=colors[8])
plt.plot(xpoints, yPoints10, label='Node 10', color=colors[9])


#plt.yticks([50, 100, 150])

plt.xlabel('Time (s)')
plt.ylabel('Memory Usage (MiB)')
plt.title('Memory Usage Over Time')
plt.legend()
plt.grid(True)
plt.show()