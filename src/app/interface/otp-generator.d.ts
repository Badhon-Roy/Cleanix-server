declare module 'otp-generator' {
  interface OTPGenerateOptions {
    digits?: boolean;
    lowerCaseAlphabets?: boolean;
    upperCaseAlphabets?: boolean;
    specialChars?: boolean;
  }
  function generate(length?: number, options?: OTPGenerateOptions): string;
  export = { generate };
}
