def count_syllables(word):
    vowels = "AEIOUaeiou"
    count = 0

    prev_is_vowel = False

    for char in word:
        if char in vowels:
            if not prev_is_vowel:
                count += 1
                prev_is_vowel = True
        else:
            prev_is_vowel = False

    if word.endswith("e"):
        count -= 1

    return count if count > 0 else 1