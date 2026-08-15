/**
 * Кастомная ошибка обрабатывается в хуке `useInput`.
 */
export class SyntheticChangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SyntheticChangeError";
  }
}
