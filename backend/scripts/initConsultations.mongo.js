/**
 * This script is to insert initial data inside the collection consultations of the database MediConnect
 * You can use it with mongo-shell or a tool like Robo3T
 */

// Insert consultations array

db.getCollection('consultation').insertMany([
    {
        dateStart: ISODate('2023-10-30T14:00:00.000Z'),
        dateEnd: ISODate('2023-10-30T15:00:00.000Z'),
        motive: 'control',
        comment: 'the patient has backpain',
        prescription: 'painkillers'
    },
    {
        dateStart: ISODate('2023-10-30T15:00:00.000Z'),
        dateEnd: ISODate('2023-10-30T16:00:00.000Z'),
        motive: 'general',
        comment: 'the patient has migraine',
        prescription: 'painkillers'
    },
    {
        dateStart: ISODate('2023-10-31T09:00:00.000Z'),
        dateEnd: ISODate('2023-10-31T10:00:00.000Z'),
        motive: 'general',
        comment: 'the patient has a nasty cold',
        prescription: 'antibiotics'
    },
    {
        dateStart: ISODate('2023-10-31T10:00:00.000Z'),
        dateEnd: ISODate('2023-10-31T11:00:00.000Z'),
        motive: 'general',
        comment: 'the patient wants to see a mental health professional',
        prescription: 'psychologists recommendations'
    },
    {
        dateStart: ISODate('2023-10-31T16:00:00.000Z'),
        dateEnd: ISODate('2023-10-31T17:00:00.000Z'),
        motive: 'general',
        comment: 'the patient is awakened by his coughing',
        prescription: 'cough syrup'
    },
  ]);
  
  
  // display the final initial data
  db.getCollection('consultation').find({});
  