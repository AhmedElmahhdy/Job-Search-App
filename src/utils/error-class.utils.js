

export class ErrorClass extends Error {
  constructor(message, status = 500) {  // Default status to 500 if not provided
    super(message);
    this.status = status;
  }
}