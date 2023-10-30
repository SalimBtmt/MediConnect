export type Patient = {
    id?: string;
    firstname: string;
    lastname: string;
    birthDate?: number;
    email: string;
    phone: string;
    address: Address;
    bloodtype: string;
    doctor?: string;
  };
  
  export type Address = {
    street: string;
    postalCode: string;
    city: string;
  };