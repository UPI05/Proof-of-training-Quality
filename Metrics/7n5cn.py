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
ypoints1 = np.array([10705, 7937, 6126, 12310, 13024, 10310, 11180, 13780, 11296, 13461, 17315, 9842, 20148, 11167, 18587, 15842, 16804, 22539, 11304, 12761])
ypoints2 = np.array([7447, 12574, 5671, 8555, 11250, 8304, 8067, 9073, 11588, 7510, 13804, 18109, 17012, 13791, 12501, 17024, 13596, 18222, 9556, 17876])
ypoints3 = np.array([6513, 7593, 9020, 6667, 17404, 11841, 11242, 17578, 9768, 11238, 10957, 11912, 22077, 11287, 8093, 18377, 13996, 23746, 11840, 12921])
xpoints = np.array(x)
ypoints = []

for i in range(len(xpoints)):
    ypoints.append(round((ypoints1[i] + ypoints2[i] + ypoints3[i]) / 3, 2))

plt.plot(xpoints, ypoints1, label='1st')
plt.plot(xpoints, ypoints2, label='2nd')
plt.plot(xpoints, ypoints3, label='3rd')
plt.plot(xpoints, ypoints, '-ro', label='Mean')

plt.title("NUM_OF_NODE = 7, NUM_OF_COMMITTEE_NODE = 5");
plt.xlabel("HEARTBEAT_TIMEOUT (s)")
plt.ylabel("Block_generation (ms)")
plt.legend()
plt.show()

#Two  lines to make our compiler able to draw:
plt.savefig(sys.stdout.buffer)
sys.stdout.flush()

