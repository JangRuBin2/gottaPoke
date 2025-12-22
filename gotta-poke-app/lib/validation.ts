export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email) {
    return { valid: false, error: "이메일을 입력해주세요" };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: "올바른 이메일 형식이 아닙니다" };
  }

  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: "비밀번호를 입력해주세요" };
  }

  if (password.length < 8) {
    return { valid: false, error: "비밀번호는 최소 8자 이상이어야 합니다" };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

  if (strength < 3) {
    return {
      valid: false,
      error: "비밀번호는 영문 대소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다"
    };
  }

  return { valid: true };
};

export const validateName = (name: string): { valid: boolean; error?: string } => {
  if (!name) {
    return { valid: false, error: "이름을 입력해주세요" };
  }

  if (name.length < 2) {
    return { valid: false, error: "이름은 최소 2자 이상이어야 합니다" };
  }

  return { valid: true };
};
