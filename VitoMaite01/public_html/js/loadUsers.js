// TODO: coordinate info is missing for the users, that will be added towards the end with Google Maps API
// User table data
const users = [
    {email: "inigo4592@gmail.com", password: "a3f1g2k8", nick: "Iñigo", city: "Donostia", age: 34, gender: "H", latitde: 0, longitude: 0, image: ""},
    {email: "ane7281@gmail.com", password: "w8d4k1j3", nick: "Ane", city: "Vitoria", age: 26, gender: "M", latitde: 0, longitude: 0,  image: ""},
    {email: "jon6328@gmail.com", password: "t4k9f1d8", nick: "Jon", city: "Bilbo", age: 41, gender: "H", latitde: 0, longitude: 0,  image: ""},
    {email: "nerea9104@gmail.com", password: "g2h8k3l7", nick: "Nerea", city: "Donostia", age: 41, gender: "M", latitde: 0, longitude: 0,  image: ""},
    {email: "markel2845@gmail.com", password: "z9r3h2k1", nick: "Markel", city: "Vitoria", age: 50, gender: "H", latitde: 0, longitude: 0,  image: ""},
    {email: "amaia1738@gmail.com", password: "p8q2d3k6", nick: "Amaia", city: "Bilbo", age: 31, gender: "M", latitde: 0, longitude: 0,  image: ""},
    {email: "aitor3871@gmail.com", password: "k2l7q8h4", nick: "Aitor", city: "Donostia", age: 47, gender: "H", latitde: 0, longitude: 0,  image: ""},
    {email: "maite5824@gmail.com", password: "b7n4j3k9", nick: "Maite", city: "Vitoria", age: 22, gender: "M", latitde: 0, longitude: 0,  image: ""},
    {email: "ander4910@gmail.com", password: "n5h8r2k3", nick: "Ander", city: "Bilbo", age: 36, gender: "H", latitde: 0, longitude: 0,  image: ""},
    {email: "leire8937@gmail.com", password: "q9k2p1g4", nick: "Leire", city: "Donostia", age: 27, gender: "M", latitde: 0, longitude: 0,  image: ""},
    {email: "unai1427@gmail.com", password: "w6f9k3r2", nick: "Unai", city: "Vitoria", age: 60, gender: "H", latitde: 0, longitude: 0,  image: ""},
    {email: "miren3478@gmail.com", password: "t3j2k9h8", nick: "Miren", city: "Bilbo", age: 33, gender: "M", latitde: 0, longitude: 0,  image: ""},
    {email: "mikel2593@gmail.com", password: "q4p8k1r7", nick: "Mikel", city: "Donostia", age: 44, gender: "H", latitde: 0, longitude: 0,  image: ""},
    {email: "irati6725@gmail.com", password: "z1h9l3k8", nick: "Irati", city: "Vitoria", age: 21, gender: "M", latitde: 0, longitude: 0,  image: ""},
    {email: "asier8034@gmail.com", password: "b2k7g3r9", nick: "Asier", city: "Bilbo", age: 39, gender: "H", latitde: 0, longitude: 0,  image: ""},
    {email: "uxue5367@gmail.com", password: "p3h4k8r2", nick: "Uxue", city: "Donostia", age: 25, gender: "M", latitde: 0, longitude: 0,  image: ""}
];

// Hobby table data
// hobbyId will be autoIncrement
const hobbyNames = [
    "Leer", 
    "Fotografía", 
    "Videojuegos",
    "Meditación", 
    "Pasear", 
    "Senderismo",
    "Ajedrez", 
    "Fútbol", 
    "Tenis de mesa",
    "Frontenis",
    "Baloncesto",
    "Música",
    "Bailar",
    "Poesía",
    "Cantar"
];

// Likes table data
const likes = [
    {email1: "inigo4592@gmail.com", email2: "ane7281@gmail.com"},
    {email1: "inigo4592@gmail.com", email2: "miren3478@gmail.com"},
    {email1: "ane7281@gmail.com", email2: "inigo4592@gmail.com"},
    {email1: "ane7281@gmail.com", email2: "aitor3871@gmail.com"},
    {email1: "ane7281@gmail.com", email2: "irati6725@gmail.com"},
    {email1: "aitor3871@gmail.com", email2: "miren3478@gmail.com"},
    {email1: "irati6725@gmail.com", email2: "asier8034@gmail.com"},
    {email1: "asier8034@gmail.com", email2: "irati6725@gmail.com"},
    {email1: "leire8937@gmail.com", email2: "ander4910@gmail.com"},
    {email1: "leire8937@gmail.com", email2: "markel2845@gmail.com"}
];

// UserHobby table data
// Random hobbies, between 3 and 5
const userHobby = [];
for (let i = 0; i < users.length; i++) {
    const hobbyCount = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    for(let j = 0; i < hobbyCount; j++) {
        const randomHobby = Math.floor(Math,random() * (15 - 0 + 1)) + 0;
        userHobby.push({userEmail: users[i].email, hobbyId: randomHobby});
    }
}

// Load the data into the database with indexedDB