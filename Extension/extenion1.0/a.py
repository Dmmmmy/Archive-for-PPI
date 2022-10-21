T = int(input())
stringset = []
for i in range(T):
    s_input = input()
    stringset.append(list(s_input))

#print(stringset)
m = {'1':'1','2':'5','3':'8','4':'7','5':'2','6':'9','7':'4','8':'3','9':'6'}
for i in range(T):
    s = stringset[i]
    k = 0
    j = len(s)-1
    flag = 0
    while j>=0:
        c_b = s[j]
        c_f = s[k]
        j-=1
        k+=1
        if c_f != m[c_b]:
            flag = 1
            break
    if flag==0:
        print("YES")
    else:
        print("NO")
        