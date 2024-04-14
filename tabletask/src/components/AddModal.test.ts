import { validateIBAN } from "./AddModal";

test(`validateIBAN must validate IBAN`, () => {
    expect(validateIBAN('IT60 X054 2811 1010 0000 0123 456')).toBe(true)
    expect(validateIBAN('SE45 5000 0000 0583 9825 7466')).toBe(true)
    expect(validateIBAN('EE38 2200 2210 2014 5685')).toBe(true)
    expect(validateIBAN('EE38 2200 2210 2014 5683')).toBe(false)
    expect(validateIBAN('SE45 5000 0000 0583 3325 7466')).toBe(false)
})