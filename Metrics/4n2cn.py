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
ypoints1 = np.array([1165, 1694, 1688, 1779, 2026, 1742, 1607, 1851, 2100, 2525, 2278, 2947, 3138, 2694, 3614, 3863, 4064, 4229, 4346, 4556])
ypoints2 = np.array([1486, 1696, 1896, 1616, 1652, 1907, 2035, 2006, 2039, 2509, 2718, 2642, 2523, 2571, 2878, 3816, 4094, 3314, 4416, 4645])
ypoints3 = np.array([1642, 1208, 1355, 1628, 1782, 1885, 1683, 1829, 2006, 2184, 2781, 2333, 2577, 2637, 3636, 3783, 4074, 4162, 3448, 3642])
xpoints = np.array(x)
ypoints = []

for i in range(len(xpoints)):
    ypoints.append(round((ypoints1[i] + ypoints2[i] + ypoints3[i]) / 3, 2))

plt.plot(xpoints, ypoints1, label='1st')
plt.plot(xpoints, ypoints2, label='2nd')
plt.plot(xpoints, ypoints3, label='3rd')
plt.plot(xpoints, ypoints, '-ro', label='Mean')

plt.title("NUM_OF_NODE = 4, NUM_OF_COMMITTEE_NODE = 2");
plt.xlabel("HEARTBEAT_TIMEOUT (s)")
plt.ylabel("Block_generation (ms)")
plt.legend()
plt.show()

#Two  lines to make our compiler able to draw:
plt.savefig(sys.stdout.buffer)
sys.stdout.flush()

