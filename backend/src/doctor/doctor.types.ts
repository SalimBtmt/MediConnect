export type Doctor = {
    id: string;
    firstname: string;
    lastname: string;
    specialty: string;
    birthDate: string;
    email: string;
    phone: string;
    address: Address;
    username: string;
    password: string;
  };
  
  export type Address = {
    street: string;
    postalCode: string;
    city: string;
  };
  