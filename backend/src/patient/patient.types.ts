export type Patient = {
    id: string;
    firstname: string;
    lastname: string;
    birthDate: string;
    email: string;
    phone: string;
    address: Address;
    bloodtype: string;
    //TODO doctor: Doctor; 
  };
  
  export type Address = {
    street: string;
    postalCode: string;
    city: string;
  };
  