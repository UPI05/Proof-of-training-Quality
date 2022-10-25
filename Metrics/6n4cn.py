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
ypoints1 = np.array([5748, 3710, 5131, 5750, 6690, 5804, 9969, 4671, 8004, 10212, 8623, 7090, 10039, 7059, 11765, 7808, 9441, 8656, 9293, 9557])
ypoints2 = np.array([4110, 5657, 5644, 3060, 9954, 3966, 7004, 7053, 10482, 8511, 8787, 6542, 6960, 8206, 9059, 8129, 11594, 9652, 9663, 10221])
ypoints3 = np.array([7047, 4241, 7197, 5368, 5848, 8099, 4360, 7370, 6642, 9771, 10183, 6910, 8145, 7187, 8445, 8402, 7721, 6932, 10385, 7999])
xpoints = np.array(x)
ypoints = []

for i in range(len(xpoints)):
    ypoints.append(round((ypoints1[i] + ypoints2[i] + ypoints3[i]) / 3, 2))

plt.plot(xpoints, ypoints1, label='1st')
plt.plot(xpoints, ypoints2, label='2nd')
plt.plot(xpoints, ypoints3, label='3rd')
plt.plot(xpoints, ypoints, '-ro', label='Mean')

plt.title("NUM_OF_NODE = 6, NUM_OF_COMMITTEE_NODE = 4");
plt.xlabel("HEARTBEAT_TIMEOUT (s)")
plt.ylabel("Block_generation (ms)")
plt.legend()
plt.show()

#Two  lines to make our compiler able to draw:
plt.savefig(sys.stdout.buffer)
sys.stdout.flush()

