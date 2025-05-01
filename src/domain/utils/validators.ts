const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string): boolean => {
    return emailRegex.test(email);
};

export const isValidPassword = (password: string, minLength: number = 6): boolean => {
    return password.length >= minLength;
};

export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0;
}; 