export class ReservationNotFoundException extends Error {
  constructor(message = 'Parking reservation not found') {
    super(message);
  }
}

export class ReservationAlreadyLeftException extends Error {
  constructor(message = 'Parking reservation already left') {
    super(message);
  }
}

export class ReservationNotPaidException extends Error {
  constructor(message = 'Parking reservation not paid') {
    super(message);
  }
}

export class ReservationAlreadyPaidException extends Error {
  constructor(message = 'Parking reservation already paid') {
    super(message);
  }
}

export class ReservationAlreadyExistsException extends Error {
  constructor(message = 'Parking reservation already exists') {
    super(message);
  }
}
