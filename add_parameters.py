import random
import sys
from cryptography.hazmat.primitives.asymmetric import dh
from datetime import datetime


def generate_g_and_p():
    g = random.choice([2, 5])
    parameters = dh.generate_parameters(generator=g, key_size=2048)
    numbers = parameters.parameter_numbers()
    return str(numbers.g), str(numbers.p)


def main():
    length = int(sys.argv[1])
    for i in range(length):
        print(f'{i + 1}/{length}')
        start = datetime.now()
        g, p = generate_g_and_p()
        with open('DHParameters_2048bit.min.js', 'r') as f:
            text = f.read()
        with open('DHParameters_2048bit.min.js', 'w') as f:
            new = f",[{g},'{p}']];"
            result = text[:len(text) - 2] + new
            f.write(result)
        end = datetime.now()
        print(f'Added: {g}, {p}')
        print(f'Length: {len(g)}, {len(p)}')
        print(f'Time: {end - start}\n')


if __name__ == '__main__':
    main()
