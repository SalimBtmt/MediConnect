/**
 * This script is to insert initial data inside the collection doctors of the database
 * You can use it with mongo-shell or a tool like Robo3T
 */

db.getCollection('doctor').insertMany([
  {
    firstname: 'Alexander',
    lastname: 'Fleming',
    specialty: 'General',
    birthDate: ISODate('1974-01-01T23:00:00.000Z'),
    email: 'Alexander.Fleming@mediconnect.com',
    phone: '+33784112248',
    address: {
      street: 'Narrows Avenue',
      postalCode: NumberInt(70534),
      city: 'Boling',
    },
    username: 'admin',
    password: 'password'
  },
  {
    firstname: 'Paul',
    lastname: 'Revere',
    specialty: 'Dentist',
    birthDate: ISODate('1963-01-21T23:00:00.000Z'),
    email: 'Paul.SaliReverenas@mediconnect.com',
    phone: '+33145652522',
    address: {
      street: 'Metrotech Courtr',
      postalCode: NumberInt(53292),
      city: 'Franklin',
    },
    username: 'admin',
    password: 'password',
  },
  {
    firstname: 'Myriam',
    lastname: 'Amrani',
    specialty: 'Psychiatry',
    birthDate: ISODate('1951-11-29T23:00:00.000Z'),
    email: 'Myriam.Amrani@mediconnect.com',
    phone: '+33685230125',
    address: {
      street: 'Oakland Place',
      postalCode: NumberInt(40863),
      city: 'Onton',
    },
    username: 'admin',
    password: 'password',
  },
])

// display the final initial data
db.getCollection('doctor').find({});
