#Three lines to make our compiler able to draw:
import sys
import matplotlib

import matplotlib.pyplot as plt
import numpy as np

x = []
i = 0.05

while round(i, 2) <= 1:
    x.append(round(i, 2))
    i += 0.05
ypoints1 = np.array([49474, 64293, 46996, 39407, 30532, 32400, 27024, 46019, 35976, 30444, 57406, 68232, 58739, 46205, 52839, 34082, 35989, 59654, 59916, 94880])
ypoints2 = np.array([30981, 29977, 32198, 32359, 42491, 51327, 62972, 58680, 68814, 33469, 47081, 56914, 58298, 40574, 56735, 58973, 55633, 45498, 49177, 90014])
ypoints3 = np.array([34840, 16687, 37043, 23668, 45789, 43190, 32086, 36181, 64273, 54568, 37790, 35032, 31671, 47687, 45477, 62425, 82273, 53731, 52808, 58187])
xpoints = np.array(x)
ypoints = []

for i in range(len(xpoints)):
    ypoints.append(round((ypoints1[i] + ypoints2[i] + ypoints3[i]) / 3, 2))

plt.plot(xpoints, ypoints1, label='1st')
plt.plot(xpoints, ypoints2, label='2nd')
plt.plot(xpoints, ypoints3, label='3rd')
plt.plot(xpoints, ypoints, '-ro', label='Mean')

plt.title("NUM_OF_NODE = 12, NUM_OF_COMMITTEE_NODE = 10");
plt.xlabel("HEARTBEAT_TIMEOUT (s)")
plt.ylabel("Block_generation (ms)")
plt.legend()
plt.show()

#Two  lines to make our compiler able to draw:
plt.savefig(sys.stdout.buffer)
sys.stdout.flush()

