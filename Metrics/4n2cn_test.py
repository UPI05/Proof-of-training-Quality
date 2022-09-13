#Three lines to make our compiler able to draw:
import sys
import matplotlib

import matplotlib.pyplot as plt
import numpy as np

matrix = [[1199, 0.02],
[826, 0.04],
[2230, 0.06],
[6971, 0.08],
[1171, 0.10],
[3052, 0.12],
[5902, 0.14],
[8457, 0.16],
[6061, 0.18],
[6609, 0.20],
[7182, 0.22],
[1643, 0.24],
[2527, 0.26],
[1718, 0.28],
[2211, 0.30],
[3438, 0.32],
[7431, 0.34],
[6392, 0.36],
[3837, 0.38],
[4651, 0.40],
[5931, 0.42],
[9590, 0.44],
[12603, 0.46],
[2204, 0.48],
[2328, 0.50],
[2722, 0.52],
[2418, 0.54],
[2170, 0.56],
[2368, 0.58],
[2658, 0.60],
[2425, 0.62],
[2719, 0.64],
[2907, 0.66],
[2360, 0.68],
[2624, 0.70],
[2566, 0.72],
[3045, 0.74],
[3319, 0.76],
[2926, 0.78],
[3895, 0.80],
[3688, 0.82],
[2911, 0.84],
[3843, 0.86],
[3183, 0.88],
[2960, 0.90],
[3761, 0.92],
[3786, 0.94],
[3668, 0.96],
[3682, 0.98],
[4013, 1.00]]

x = []
i = 0.05

while round(i, 2) <= 1:
    x.append(round(i, 2))
    i += 0.05

y = [1679, 1516, 2557, 1834, 2152, 2176, 1674, 1825, 2137, 2513, 2674, 2440, 3097, 2889, 2894, 2987, 3808, 4232, 4322, 4405]

matrix = np.transpose(matrix).tolist()
xpoints = np.array(matrix[1])
ypoints = np.array(matrix[0])

xpoints2 = np.array(x)
ypoints2 = np.array(y)

plt.plot(xpoints, ypoints)
plt.plot(xpoints2, ypoints2)

plt.title("NUM_OF_NODE = 4, NUM_OF_COMMITTEE_NODE = 2");
plt.xlabel("HEARTBEAT_TIMEOUT (s)")
plt.ylabel("Block_generation (ms)")

plt.show()

#Two  lines to make our compiler able to draw:
plt.savefig(sys.stdout.buffer)
sys.stdout.flush()

