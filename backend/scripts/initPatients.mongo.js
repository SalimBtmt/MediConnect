/**
 * This script is to insert initial data inside the collection patients of the database MediConnect
 * You can use it with mongo-shell or a tool like Robo3T
 */

// Insert patients array
db.getCollection('patient').insertMany([
  {
    firstname: 'Leanne',
    lastname: 'Woodard',
    birthDate: ISODate('1974-01-01T23:00:00.000Z'),
    email: 'Leanne.Woodard@gmail.com',
    phone: '+33784112248',
    address: {
      street: 'Narrows Avenue',
      postalCode: NumberInt(70534),
      city: 'Boling',
    },
    bloodtype: 'A+',
  },
  {
    firstname: 'Castaneda',
    lastname: 'Salinas',
    birthDate: ISODate('1963-01-21T23:00:00.000Z'),
    email: 'Castaneda.Salinas@gmail.com',
    phone: '+33145652522',
    address: {
      street: 'Metrotech Courtr',
      postalCode: NumberInt(53292),
      city: 'Franklin',
    },
    bloodtype: 'A+',
  },
  {
    firstname: 'Phyllis',
    lastname: 'Donovan',
    birthDate: ISODate('1951-11-29T23:00:00.000Z'),
    email: 'Phyllis.Donovan@gmail.com',
    phone: '+33685230125',
    address: {
      street: 'Oakland Place',
      postalCode: NumberInt(40863),
      city: 'Onton',
    },
    bloodtype: 'A+',
  },
  {
    firstname: 'Erika',
    lastname: 'Guzman',
    birthDate: ISODate('1962-03-18T23:00:00.000Z'),
    email: 'Erika.Guzman@gmail.com',
    phone: '+33678412587',
    address: {
      street: 'Havemeyer Street',
      postalCode: NumberInt(76154),
      city: 'Yardville',
    },
    bloodtype: 'A+',
  },
  {
    firstname: 'Moody',
    lastname: 'Prince',
    birthDate: ISODate('1971-04-14T23:00:00.000Z'),
    email: 'Moody.Prince@gmail.com',
    phone: '+33662589632',
    address: {
      street: 'Russell Street',
      postalCode: NumberInt(51004),
      city: 'Coloma',
    },
    bloodtype: 'A+',
  },
  {
    firstname: 'Mercedes',
    lastname: 'Hebert',
    birthDate: ISODate('1947-07-19T23:00:00.000Z'),
    email: 'Mercedes.Hebert@gmail.com',
    phone: '+33125878522',
    address: {
      street: 'Laurel Avenue',
      postalCode: NumberInt(85752),
      city: 'Northchase',
    },
    bloodtype: 'A+',
  },
  {
    firstname: 'Howell',
    lastname: 'Mcknight',
    birthDate: ISODate('1979-07-17T22:00:00.000Z'),
    email: 'Howell.Mcknight@gmail.com',
    phone: '+33456987425',
    address: {
      street: 'Ford Street',
      postalCode: NumberInt(58545),
      city: 'Shindler',
    },
    bloodtype: 'A+',
  },
  {
    firstname: 'Lizzie',
    lastname: 'Morris',
    birthDate: ISODate('1981-11-14T23:00:00.000Z'),
    email: 'Lizzie.Morris@gmail.com',
    phone: '+33662259988',
    address: {
      street: 'Hall Street',
      postalCode: NumberInt(27946),
      city: 'Waverly',
    },
    bloodtype: 'A+',
  },
  {
    firstname: 'Roy',
    lastname: 'Nielsen',
    birthDate: ISODate('1951-10-20T23:00:00.000Z'),
    email: 'Roy.Nielsen@gmail.com',
    phone: '+33755669551',
    address: {
      street: 'Sumner Place',
      postalCode: NumberInt(36335),
      city: 'Glidden',
    },
    bloodtype: 'A+',
  },
  {
    firstname: 'Mclaughlin',
    lastname: 'Cochran',
    birthDate: ISODate('1973-03-18T23:00:00.000Z'),
    email: 'Mclaughlin.Cochran@gmail.com',
    phone: '+33266334856',
    address: {
      street: 'Jewel Street',
      postalCode: NumberInt(61400),
      city: 'Snelling',
    },
    bloodtype: 'A+',
  },
]);


// display the final initial data
db.getCollection('patient').find({});
