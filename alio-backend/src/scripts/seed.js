const prisma = require('../config/prismaClient');

const items = [
  {
    title: 'Inception',
    type: 'Movie',
    director: 'Christopher Nolan',
    year: 2010,
    duration: '2h 28m',
    rating: 5,
    review: 'A layered science fiction thriller about dreams, memory, and grief.',
    genre: 'Science Fiction',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg'
  },
  {
    title: 'Dirty Dancing',
    type: 'Movie',
    director: 'Emile Ardolino',
    year: 1987,
    duration: '1h 40m',
    rating: 5,
    review: 'A comfort classic with unforgettable music.',
    genre: 'Romance',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BOWQyYjQ5ZTItYTZkNy00ZjJmLWEzYzgtODFhYmRlZGM1NjU5XkEyXkFqcGc@._V1_.jpg'
  },
  {
    title: 'The Devil Wears Prada',
    type: 'Movie',
    director: 'David Frankel',
    year: 2006,
    duration: '1h 49m',
    rating: 5,
    review: 'Sharp, stylish, and very rewatchable.',
    genre: 'Comedy',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTI3MTU1MTYwMV5BMl5BanBnXkFtZTcwMjQ2MTI0Mw@@._V1_.jpg'
  },
  {
    title: 'Dune',
    type: 'Movie',
    director: 'Denis Villeneuve',
    year: 2021,
    duration: '2h 35m',
    rating: 5,
    review: 'Massive, elegant sci-fi worldbuilding.',
    genre: 'Science Fiction',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNWIyNmU5MGYtZDZmNi00ZjAwLWJlYjgtZTc0ZGIxMDE4ZGYwXkEyXkFqcGc@._V1_.jpg'
  },
  {
    title: 'Everything Everywhere All at Once',
    type: 'Movie',
    director: 'Daniel Kwan and Daniel Scheinert',
    year: 2022,
    duration: '2h 19m',
    rating: 5,
    review: 'Chaotic, tender, and wildly inventive.',
    genre: 'Adventure',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_.jpg'
  },
  {
    title: 'Pride and Prejudice',
    type: 'Book',
    author: 'Jane Austen',
    year: 1813,
    pages: 279,
    rating: 5,
    review: 'Witty, precise, and still very alive.',
    genre: 'Classic',
    posterUrl: 'https://m.media-amazon.com/images/I/81Scutrtj4L._SL1500_.jpg'
  },
  {
    title: '1984',
    type: 'Book',
    author: 'George Orwell',
    year: 1949,
    pages: 328,
    rating: 5,
    review: 'Bleak, sharp, and hard to forget.',
    genre: 'Dystopian',
    posterUrl: 'https://m.media-amazon.com/images/I/71kxa1-0mfL._SL1500_.jpg'
  },
  {
    title: 'Dune',
    type: 'Book',
    author: 'Frank Herbert',
    year: 1965,
    pages: 412,
    rating: 5,
    review: 'A dense and rewarding science fiction landmark.',
    genre: 'Science Fiction',
    posterUrl: 'https://m.media-amazon.com/images/I/81Ua99CURsL._SL1500_.jpg'
  },
  {
    title: 'The Hobbit',
    type: 'Book',
    author: 'J.R.R. Tolkien',
    year: 1937,
    pages: 310,
    rating: 4,
    review: 'A cozy adventure with wonderful momentum.',
    genre: 'Fantasy',
    posterUrl: 'https://m.media-amazon.com/images/I/91b0C2YNSrL._SL1500_.jpg'
  },
  {
    title: 'Breaking Bad',
    type: 'TV Show',
    director: 'Vince Gilligan',
    year: 2008,
    seasons: 5,
    rating: 5,
    review: 'A masterclass in escalation and character change.',
    genre: 'Crime',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWQ0MTUtYmI2MC00NmFlLTk0YjUtNmQzM2Q2NTNlNTI0XkEyXkFqcGc@._V1_.jpg'
  },
  {
    title: 'The Office',
    type: 'TV Show',
    director: 'Greg Daniels',
    year: 2005,
    seasons: 9,
    rating: 4,
    review: 'Reliable comfort watching.',
    genre: 'Sitcom',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_.jpg'
  },
  {
    title: 'Fleabag',
    type: 'TV Show',
    director: 'Phoebe Waller-Bridge',
    year: 2016,
    seasons: 2,
    rating: 5,
    review: 'Funny, painful, and beautifully controlled.',
    genre: 'Comedy',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjA4NzA1OTUxOF5BMl5BanBnXkFtZTgwNzkxNjk4NjM@._V1_.jpg'
  },
  {
    title: 'Stranger Things',
    type: 'TV Show',
    director: 'The Duffer Brothers',
    year: 2016,
    seasons: 4,
    rating: 4,
    review: 'Energetic nostalgia with a strong ensemble.',
    genre: 'Science Fiction',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_.jpg'
  },
  {
    title: 'Arrival',
    type: 'Movie',
    director: 'Denis Villeneuve',
    year: 2016,
    duration: '1h 56m',
    rating: 5,
    review: 'Quiet, emotional science fiction with a beautiful structure.',
    genre: 'Science Fiction',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg'
  },
  {
    title: 'Knives Out',
    type: 'Movie',
    director: 'Rian Johnson',
    year: 2019,
    duration: '2h 10m',
    rating: 4,
    review: 'A playful mystery with excellent pacing.',
    genre: 'Mystery',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Knives_Out_poster.jpeg'
  },
  {
    title: 'La La Land',
    type: 'Movie',
    director: 'Damien Chazelle',
    year: 2016,
    duration: '2h 8m',
    rating: 4,
    review: 'Colorful, romantic, and bittersweet.',
    genre: 'Musical',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png'
  },
  {
    title: 'The Grand Budapest Hotel',
    type: 'Movie',
    director: 'Wes Anderson',
    year: 2014,
    duration: '1h 39m',
    rating: 5,
    review: 'Precise, funny, and beautifully composed.',
    genre: 'Comedy',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Grand_Budapest_Hotel.png'
  },
  {
    title: 'Parasite',
    type: 'Movie',
    director: 'Bong Joon Ho',
    year: 2019,
    duration: '2h 12m',
    rating: 5,
    review: 'Dark, sharp, and impossible to look away from.',
    genre: 'Thriller',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png'
  },
  {
    title: 'The Social Network',
    type: 'Movie',
    director: 'David Fincher',
    year: 2010,
    duration: '2h 0m',
    rating: 4,
    review: 'Cold, fast, and incredibly watchable.',
    genre: 'Drama',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/The_Social_Network_film_poster.png'
  },
  {
    title: 'Interstellar',
    type: 'Movie',
    director: 'Christopher Nolan',
    year: 2014,
    duration: '2h 49m',
    rating: 5,
    review: 'Huge emotions, huge space, huge organ music.',
    genre: 'Science Fiction',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg'
  },
  {
    title: 'Little Women',
    type: 'Movie',
    director: 'Greta Gerwig',
    year: 2019,
    duration: '2h 15m',
    rating: 5,
    review: 'Warm, lively, and deeply charming.',
    genre: 'Drama',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9d/Little_Women_%282019_film%29.jpeg'
  },
  {
    title: 'The Handmaiden',
    type: 'Movie',
    director: 'Park Chan-wook',
    year: 2016,
    duration: '2h 25m',
    rating: 5,
    review: 'Elegant, tense, and full of turns.',
    genre: 'Thriller',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/The_Handmaiden_film.png'
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    type: 'Movie',
    director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
    year: 2018,
    duration: '1h 57m',
    rating: 5,
    review: 'Inventive animation with a huge heart.',
    genre: 'Animation',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fa/Spider-Man_Into_the_Spider-Verse_poster.png'
  },
  {
    title: 'The Left Hand of Darkness',
    type: 'Book',
    author: 'Ursula K. Le Guin',
    year: 1969,
    pages: 304,
    rating: 5,
    review: 'A thoughtful, icy classic of speculative fiction.',
    genre: 'Science Fiction',
    posterUrl: 'https://covers.openlibrary.org/b/olid/OL26794603M-L.jpg'
  },
  {
    title: 'The Name of the Wind',
    type: 'Book',
    author: 'Patrick Rothfuss',
    year: 2007,
    pages: 662,
    rating: 4,
    review: 'Musical, atmospheric fantasy storytelling.',
    genre: 'Fantasy',
    posterUrl: 'https://covers.openlibrary.org/b/olid/OL26414787M-L.jpg'
  },
  {
    title: 'Circe',
    type: 'Book',
    author: 'Madeline Miller',
    year: 2018,
    pages: 393,
    rating: 5,
    review: 'Mythological, intimate, and beautifully written.',
    genre: 'Fantasy',
    posterUrl: 'https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg'
  },
  {
    title: 'The Seven Husbands of Evelyn Hugo',
    type: 'Book',
    author: 'Taylor Jenkins Reid',
    year: 2017,
    pages: 400,
    rating: 4,
    review: 'Glossy, dramatic, and emotionally direct.',
    genre: 'Romance',
    posterUrl: 'https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg'
  },
  {
    title: 'Normal People',
    type: 'Book',
    author: 'Sally Rooney',
    year: 2018,
    pages: 266,
    rating: 4,
    review: 'Plainspoken and painfully observant.',
    genre: 'Literary Fiction',
    posterUrl: 'https://covers.openlibrary.org/b/olid/OL28119565M-L.jpg'
  },
  {
    title: 'The Martian',
    type: 'Book',
    author: 'Andy Weir',
    year: 2011,
    pages: 369,
    rating: 4,
    review: 'Funny, technical, and surprisingly breezy.',
    genre: 'Science Fiction',
    posterUrl: 'https://covers.openlibrary.org/b/isbn/9780804139021-L.jpg'
  },
  {
    title: 'The Secret History',
    type: 'Book',
    author: 'Donna Tartt',
    year: 1992,
    pages: 559,
    rating: 5,
    review: 'Dark academia with a long shadow.',
    genre: 'Mystery',
    posterUrl: 'https://covers.openlibrary.org/b/olid/OL18531069M-L.jpg'
  },
  {
    title: 'Good Omens',
    type: 'Book',
    author: 'Terry Pratchett and Neil Gaiman',
    year: 1990,
    pages: 288,
    rating: 4,
    review: 'Witty apocalypse management.',
    genre: 'Comedy',
    posterUrl: 'https://covers.openlibrary.org/b/isbn/9780060853983-L.jpg'
  },
  {
    title: 'Educated',
    type: 'Book',
    author: 'Tara Westover',
    year: 2018,
    pages: 334,
    rating: 5,
    review: 'Clear, difficult, and powerful.',
    genre: 'Memoir',
    posterUrl: 'https://covers.openlibrary.org/b/olid/OL26826037M-L.jpg'
  },
  {
    title: 'Project Hail Mary',
    type: 'Book',
    author: 'Andy Weir',
    year: 2021,
    pages: 496,
    rating: 5,
    review: 'A joyful problem-solving space adventure.',
    genre: 'Science Fiction',
    posterUrl: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg'
  },
  {
    title: 'Succession',
    type: 'TV Show',
    director: 'Jesse Armstrong',
    year: 2018,
    seasons: 4,
    rating: 5,
    review: 'Brutal, hilarious, and surgically written.',
    genre: 'Drama',
    posterUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/SuccessionTV.png'
  },
  {
    title: 'The Bear',
    type: 'TV Show',
    director: 'Christopher Storer',
    year: 2022,
    seasons: 3,
    rating: 5,
    review: 'Anxious, tender, and full of momentum.',
    genre: 'Drama',
    posterUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Bear_Title_Card.jpg'
  },
  {
    title: 'Arcane',
    type: 'TV Show',
    director: 'Christian Linke and Alex Yee',
    year: 2021,
    seasons: 1,
    rating: 5,
    review: 'A gorgeous animated tragedy.',
    genre: 'Animation',
    posterUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Arcane_Title_Text.png'
  },
  {
    title: 'Sherlock',
    type: 'TV Show',
    director: 'Mark Gatiss and Steven Moffat',
    year: 2010,
    seasons: 4,
    rating: 4,
    review: 'Stylish mysteries with sharp performances.',
    genre: 'Mystery',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Sherlock_titlecard.jpg'
  },
  {
    title: 'Dark',
    type: 'TV Show',
    director: 'Baran bo Odar and Jantje Friese',
    year: 2017,
    seasons: 3,
    rating: 5,
    review: 'A carefully built time-travel puzzle.',
    genre: 'Science Fiction',
    posterUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dark_TV_Series_Logo.svg'
  },
  {
    title: 'Avatar: The Last Airbender',
    type: 'TV Show',
    director: 'Michael Dante DiMartino and Bryan Konietzko',
    year: 2005,
    seasons: 3,
    rating: 5,
    review: 'A beautifully paced animated adventure.',
    genre: 'Animation',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Avatar_The_Last_Airbender_logo.svg/330px-Avatar_The_Last_Airbender_logo.svg.png'
  },
  {
    title: 'The Queen\'s Gambit',
    type: 'TV Show',
    director: 'Scott Frank',
    year: 2020,
    seasons: 1,
    rating: 4,
    review: 'Elegant, focused, and satisfying.',
    genre: 'Drama',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/The_Queen%27s_Gambit_%28miniseries%29.png'
  },
  {
    title: 'Chernobyl',
    type: 'TV Show',
    director: 'Craig Mazin',
    year: 2019,
    seasons: 1,
    rating: 5,
    review: 'Terrifying and meticulously staged.',
    genre: 'History',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Chernobyl_2019_Miniseries.jpg'
  },
  {
    title: 'Parks and Recreation',
    type: 'TV Show',
    director: 'Greg Daniels and Michael Schur',
    year: 2009,
    seasons: 7,
    rating: 4,
    review: 'Optimistic sitcom comfort.',
    genre: 'Sitcom',
    posterUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Parks_and_Recreation_%28TV_series%29_logo.png'
  },
  {
    title: 'Severance',
    type: 'TV Show',
    director: 'Dan Erickson',
    year: 2022,
    seasons: 1,
    rating: 5,
    review: 'Strange, clean, and deeply unsettling.',
    genre: 'Thriller',
    posterUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Severance_textlogo.png'
  }
];

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: 'test@alio.com', username: 'AlioUser' }
    });
  }

  let created = 0;
  let skipped = 0;
  let updated = 0;

  for (const item of items) {
    let category = await prisma.category.findUnique({ where: { name: item.type } });
    if (!category) {
      category = await prisma.category.create({ data: { name: item.type } });
    }

    const existing = await prisma.media.findFirst({
      where: {
        title: item.title,
        categoryId: category.id
      }
    });

    if (existing) {
      if ((!existing.posterUrl || !existing.posterUrl.trim()) && item.posterUrl) {
        await prisma.media.update({
          where: { id: existing.id },
          data: { posterUrl: item.posterUrl }
        });
        updated += 1;
      }
      skipped += 1;
      continue;
    }

    const { type, ...data } = item;
    await prisma.media.create({
      data: {
        ...data,
        userId: user.id,
        categoryId: category.id
      }
    });
    created += 1;
  }

  console.log(`Seed complete: ${created} created, ${updated} updated, ${skipped} skipped.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
