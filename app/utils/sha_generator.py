def cycle_shift(data, n:int):
    n %= 64
    return ((data << n) | (data >> (64-n))) & MASK

def rotate_martix(matrix:list) -> list:
    r = [[0]*5 for _ in range(5)]
    x,y = 1,0
    for i in range(24):
        r[x][y] = ((i+1) * (i+2) // 2) % 64

        x,y = y, (2*x + 3*y) % 5

    return r

def keccak_f(state:list) -> list:
    for rnd in range(24):
        C = [0] *5
        for x in range(5):
            C[x] = state[x] ^ state[x+5] ^ state[x+10] ^ state[x+15] ^ state[x+20]
        for x in range(5):
            D = C[(x-1) % 5] ^ cycle_shift(C[(x+1) % 5], 1)
            for y in range(5):
                state[x + 5*y] ^= D

        B = [0] * 25
        for x in range(5):
            for y in range(5):
                B[y+5*((2*x + 3*y) % 5)] = cycle_shift(state[x + 5*y], ROTATIONS[x][y])

        for x in range(5):
            for y in range(5):
                state[x + 5*y] = (B[x+5*y] ^ 
                                  (((~B[(x+1) % 5 + 5*y]) & MASK) & 
                                   B[(x+2) % 5 + 5*y])) & MASK
        state[0] ^= RC[rnd]

    return state

def keccak(r,c, data, output_lenght, padding=0x06) -> bytes:
    state = [0] * 25
    r_bytes = r // 8

    msg = bytearray(data)
    msg.append(padding)

    # Дополняем массив байт до нужной длины
    while len(msg) % r_bytes != 0:
        msg.append(0x00)

    msg[-1] |= 0x80

    # Впитывание губочной функции
    for i in range(0, len(msg), r_bytes):
        block = msg[i:i + r_bytes] # формируем блок по N байт
        for j in range(r_bytes):
            state[j//8] ^= block[j] << (8 * (j % 8))

        state = keccak_f(state)

    # Выжимка губочной функции
    result = bytearray()
    while len(result) < output_lenght:
        for i in range(r_bytes):
            if len(result) >= output_lenght:
                break

            result.append((state[i//8] >> (8 * (i % 8))) & 0xFF)

        # Если результативная длина не достаточна, то вызываем функцию повторно
        if len(result) < output_lenght:
            state = keccak_f(state) 

    return bytes(result)

MASK = (1 << 64) - 1

RC = [
    0x0000000000000001, 0x0000000000008082, 0x800000000000808A, 0x8000000080008000,
    0x000000000000808B, 0x0000000080000001, 0x8000000080008081, 0x8000000000008009,
    0x000000000000008A, 0x0000000000000088, 0x0000000080008009, 0x000000008000000A,
    0x000000008000808B, 0x800000000000008B, 0x8000000000008089, 0x8000000000008003,
    0x8000000000008002, 0x8000000000000080, 0x000000000000800A, 0x800000008000000A,
    0x8000000080008081, 0x8000000000008080, 0x0000000080000001, 0x8000000080008008
]

ROTATIONS = rotate_martix(RC)

def sha_256(data): return keccak(1088, 512, data, 32, 0x06)

if __name__ == "__main__":
    from hashlib import sha3_256

    h1 = sha3_256(b'test').hexdigest()
    h2 = sha_256(b'test').hex()

    print(h1)
    print('='*64)
    print(h2)

    if h1 == h2: print("OK")
    else: print("ERROR")