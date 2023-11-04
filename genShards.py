import random

numOfNode = 5
numOfShard = 2

vals = [i +1 for i in range(numOfNode)]

k = numOfNode // numOfShard

r = numOfNode % numOfShard

pos = 0

random.shuffle(vals)

with open('shards.config', 'w') as f:

    f.write(str(numOfNode))
    f.write('\n')
    f.write(str(numOfShard))
    f.write('\n')

    for i in range(r):
        for j in range(k + 1):
            f.write(str(vals[pos]))
            f.write(', ')
            pos += 1
        f.write('\n')

    for i in range(numOfShard - r):
        for j in range(k):
            f.write(str(vals[pos]))
            f.write(', ')
            pos += 1
        f.write('\n')


f.close()