export type Doctor = {
    id?: string;
    firstname: string;
    lastname: string;
    birthDate?: number;
    email: string;
    phone: string;
    address: Address;
    specialty: string;
    username?: string;
  };

  export type Address = {
    street: string;
    postalCode: string;
    city: string;
  };