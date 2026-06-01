const fetch = require('node-fetch');

const PRODUCTION_API = 'https://alio-backend.onrender.com/api';

// Demo user credentials
const DEMO_USER = {
  email: 'demo@alio.com',
  username: 'demo',
  password: 'demo123456'
};

// All media from your local database (userId: 1)
const MEDIA_DATA = [
  // MOVIES
  {
    title: "Inception",
    genre: null,
    year: 2010,
    rating: 5,
    review: null,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjExMjkwNTQ0Nl5BMl5BanBnXkFtZTcwNTY0OTk1Mw@@._V1_.jpg",
    director: null,
    duration: null,
    categoryId: 1
  },
  {
    title: "Dirty Dancing",
    genre: "Romance",
    year: 1987,
    rating: 5,
    review: "A comfort classic with unforgettable music.",
    posterUrl: "https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2022/01/19173426/dvEggyDTTIBDvrUNjTEa9depT0f-scaled.jpg",
    director: "Emile Ardolino",
    duration: "1h 40m",
    categoryId: 1
  },
  {
    title: "The Devil Wears Prada",
    genre: "Comedy",
    year: 2006,
    rating: 5,
    review: "Sharp, stylish, and very rewatchable.",
    posterUrl: "https://m.media-amazon.com/images/I/61tjKyGJhYL._AC_UF1000,1000_QL80_.jpg",
    director: "David Frankel",
    duration: "1h 49m",
    categoryId: 1
  },
  {
    title: "Dune",
    genre: "Science Fiction",
    year: 2021,
    rating: 5,
    review: "Massive, elegant sci-fi worldbuilding.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNWIyNmU5MGYtZDZmNi00ZjAwLWJlYjgtZTc0ZGIxMDE4ZGYwXkEyXkFqcGc@._V1_.jpg",
    director: "Denis Villeneuve",
    duration: "2h 35m",
    categoryId: 1
  },
  {
    title: "Everything Everywhere All at Once",
    genre: "Adventure",
    year: 2022,
    rating: 5,
    review: "Chaotic, tender, and wildly inventive.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_.jpg",
    director: "Daniel Kwan and Daniel Scheinert",
    duration: "2h 19m",
    categoryId: 1
  },
  {
    title: "Arrival",
    genre: "Science Fiction",
    year: 2016,
    rating: 5,
    review: "Quiet, emotional science fiction with a beautiful structure.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg",
    director: "Denis Villeneuve",
    duration: "1h 56m",
    categoryId: 1
  },
  {
    title: "Knives Out",
    genre: "Mystery",
    year: 2019,
    rating: 4,
    review: "A playful mystery with excellent pacing.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/1f/Knives_Out_poster.jpeg",
    director: "Rian Johnson",
    duration: "2h 10m",
    categoryId: 1
  },
  {
    title: "La La Land",
    genre: "Musical",
    year: 2016,
    rating: 4,
    review: "Colorful, romantic, and bittersweet.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png",
    director: "Damien Chazelle",
    duration: "2h 8m",
    categoryId: 1
  },
  {
    title: "The Grand Budapest Hotel",
    genre: "Comedy",
    year: 2014,
    rating: 5,
    review: "Precise, funny, and beautifully composed.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Grand_Budapest_Hotel.png",
    director: "Wes Anderson",
    duration: "1h 39m",
    categoryId: 1
  },
  {
    title: "Parasite",
    genre: "Thriller",
    year: 2019,
    rating: 5,
    review: "Dark, sharp, and impossible to look away from.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    director: "Bong Joon Ho",
    duration: "2h 12m",
    categoryId: 1
  },
  {
    title: "The Social Network",
    genre: "Drama",
    year: 2010,
    rating: 4,
    review: "Cold, fast, and incredibly watchable.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/8c/The_Social_Network_film_poster.png",
    director: "David Fincher",
    duration: "2h 0m",
    categoryId: 1
  },
  {
    title: "Interstellar",
    genre: "Science Fiction",
    year: 2014,
    rating: 5,
    review: "Huge emotions, huge space, huge organ music.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    director: "Christopher Nolan",
    duration: "2h 49m",
    categoryId: 1
  },
  {
    title: "Little Women",
    genre: "Drama",
    year: 2019,
    rating: 5,
    review: "Warm, lively, and deeply charming.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/9/9d/Little_Women_%282019_film%29.jpeg",
    director: "Greta Gerwig",
    duration: "2h 15m",
    categoryId: 1
  },
  {
    title: "The Handmaiden",
    genre: "Thriller",
    year: 2016,
    rating: 5,
    review: "Elegant, tense, and full of turns.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/a2/The_Handmaiden_film.png",
    director: "Park Chan-wook",
    duration: "2h 25m",
    categoryId: 1
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    genre: "Animation",
    year: 2018,
    rating: 5,
    review: "Inventive animation with a huge heart.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/fa/Spider-Man_Into_the_Spider-Verse_poster.png",
    director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    duration: "1h 57m",
    categoryId: 1
  },

  // BOOKS
  {
    title: "Pride and Prejudice",
    genre: "Classic",
    year: 1813,
    rating: 5,
    review: "Witty, precise, and still very alive.",
    posterUrl: "https://m.media-amazon.com/images/I/81Scutrtj4L._SL1500_.jpg",
    author: "Jane Austen",
    pages: 279,
    categoryId: 2
  },
  {
    title: "1984",
    genre: "Dystopian",
    year: 1949,
    rating: 5,
    review: "Bleak, sharp, and hard to forget.",
    posterUrl: "https://m.media-amazon.com/images/I/71kxa1-0mfL._SL1500_.jpg",
    author: "George Orwell",
    pages: 328,
    categoryId: 2
  },
  {
    title: "Dune",
    genre: "Science Fiction",
    year: 1965,
    rating: 5,
    review: "A dense and rewarding science fiction landmark.",
    posterUrl: "https://m.media-amazon.com/images/I/81Ua99CURsL._SL1500_.jpg",
    author: "Frank Herbert",
    pages: 412,
    categoryId: 2
  },
  {
    title: "The Hobbit",
    genre: "Fantasy",
    year: 1937,
    rating: 4,
    review: "A cozy adventure with wonderful momentum.",
    posterUrl: "https://m.media-amazon.com/images/I/91b0C2YNSrL._SL1500_.jpg",
    author: "J.R.R. Tolkien",
    pages: 310,
    categoryId: 2
  },
  {
    title: "The Left Hand of Darkness",
    genre: "Science Fiction",
    year: 1969,
    rating: 5,
    review: "A thoughtful, icy classic of speculative fiction.",
    posterUrl: "https://covers.openlibrary.org/b/olid/OL26794603M-L.jpg",
    author: "Ursula K. Le Guin",
    pages: 304,
    categoryId: 2
  },
  {
    title: "The Name of the Wind",
    genre: "Fantasy",
    year: 2007,
    rating: 4,
    review: "Musical, atmospheric fantasy storytelling.",
    posterUrl: "https://covers.openlibrary.org/b/olid/OL26414787M-L.jpg",
    author: "Patrick Rothfuss",
    pages: 662,
    categoryId: 2
  },
  {
    title: "Circe",
    genre: "Fantasy",
    year: 2018,
    rating: 5,
    review: "Mythological, intimate, and beautifully written.",
    posterUrl: "https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg",
    author: "Madeline Miller",
    pages: 393,
    categoryId: 2
  },
  {
    title: "The Seven Husbands of Evelyn Hugo",
    genre: "Romance",
    year: 2017,
    rating: 4,
    review: "Glossy, dramatic, and emotionally direct.",
    posterUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1664458703i/32620332.jpg",
    author: "Taylor Jenkins Reid",
    pages: 400,
    categoryId: 2
  },
  {
    title: "Normal People",
    genre: "Literary Fiction",
    year: 2018,
    rating: 4,
    review: "Plainspoken and painfully observant.",
    posterUrl: "https://covers.openlibrary.org/b/olid/OL28119565M-L.jpg",
    author: "Sally Rooney",
    pages: 266,
    categoryId: 2
  },
  {
    title: "The Martian",
    genre: "Science Fiction",
    year: 2011,
    rating: 4,
    review: "Funny, technical, and surprisingly breezy.",
    posterUrl: "https://covers.openlibrary.org/b/isbn/9780804139021-L.jpg",
    author: "Andy Weir",
    pages: 369,
    categoryId: 2
  },
  {
    title: "The Secret History",
    genre: "Mystery",
    year: 1992,
    rating: 5,
    review: "Dark academia with a long shadow.",
    posterUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1751820530i/29044.jpg",
    author: "Donna Tartt",
    pages: 559,
    categoryId: 2
  },
  {
    title: "Good Omens",
    genre: "Comedy",
    year: 1990,
    rating: 4,
    review: "Witty apocalypse management.",
    posterUrl: "https://covers.openlibrary.org/b/isbn/9780060853983-L.jpg",
    author: "Terry Pratchett and Neil Gaiman",
    pages: 288,
    categoryId: 2
  },
  {
    title: "Educated",
    genre: "Memoir",
    year: 2018,
    rating: 5,
    review: "Clear, difficult, and powerful.",
    posterUrl: "https://covers.openlibrary.org/b/olid/OL26826037M-L.jpg",
    author: "Tara Westover",
    pages: 334,
    categoryId: 2
  },
  {
    title: "Project Hail Mary",
    genre: "Science Fiction",
    year: 2021,
    rating: 5,
    review: "A joyful problem-solving space adventure.",
    posterUrl: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg",
    author: "Andy Weir",
    pages: 496,
    categoryId: 2
  },

  // TV SHOWS
  {
    title: "Breaking Bad",
    genre: "Crime",
    year: 2008,
    rating: 5,
    review: "A masterclass in escalation and character change.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_.jpg",
    director: "Vince Gilligan",
    seasons: 5,
    categoryId: 3
  },
  {
    title: "The Office",
    genre: "Sitcom",
    year: 2005,
    rating: 4,
    review: "Reliable comfort watching.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_.jpg",
    director: "Greg Daniels",
    seasons: 9,
    categoryId: 3
  },
  {
    title: "Fleabag",
    genre: "Comedy",
    year: 2016,
    rating: 5,
    review: "Funny, painful, and beautifully controlled.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjA4MzU5NzQxNV5BMl5BanBnXkFtZTgwOTg3MDA5NzM@._V1_.jpg",
    director: "Phoebe Waller-Bridge",
    seasons: 2,
    categoryId: 3
  },
  {
    title: "Stranger Things",
    genre: "Science Fiction",
    year: 2016,
    rating: 4,
    review: "Energetic nostalgia with a strong ensemble.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_.jpg",
    director: "The Duffer Brothers",
    seasons: 4,
    categoryId: 3
  },
  {
    title: "Succession",
    genre: "Drama",
    year: 2018,
    rating: 5,
    review: "Brutal, hilarious, and surgically written.",
    posterUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/SuccessionTV.png",
    director: "Jesse Armstrong",
    seasons: 4,
    categoryId: 3
  },
  {
    title: "Arcane",
    genre: "Animation",
    year: 2021,
    rating: 5,
    review: "A gorgeous animated tragedy.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYjA2NzhlMDItNWRmZC00MzRjLWE3ZjAtZjBlZDAwOWY2ODdjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    director: "Christian Linke and Alex Yee",
    seasons: 1,
    categoryId: 3
  },
  {
    title: "Sherlock",
    genre: "Mystery",
    year: 2010,
    rating: 4,
    review: "Stylish mysteries with sharp performances.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/4d/Sherlock_titlecard.jpg",
    director: "Mark Gatiss and Steven Moffat",
    seasons: 4,
    categoryId: 3
  },
  {
    title: "Dark",
    genre: "Science Fiction",
    year: 2017,
    rating: 5,
    review: "A carefully built time-travel puzzle.",
    posterUrl: "https://resizing.flixster.com/lpJkDxnEFNQT1OWJjnmYfvpAHJ0=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvUlRUVjI2NjgyOS53ZWJw",
    director: "Baran bo Odar and Jantje Friese",
    seasons: 3,
    categoryId: 3
  },
  {
    title: "The Queen's Gambit",
    genre: "Drama",
    year: 2020,
    rating: 4,
    review: "Elegant, focused, and satisfying.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/12/The_Queen%27s_Gambit_%28miniseries%29.png",
    director: "Scott Frank",
    seasons: 1,
    categoryId: 3
  },
  {
    title: "Chernobyl",
    genre: "History",
    year: 2019,
    rating: 5,
    review: "Terrifying and meticulously staged.",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/a7/Chernobyl_2019_Miniseries.jpg",
    director: "Craig Mazin",
    seasons: 1,
    categoryId: 3
  }
];

async function seedProduction() {
  console.log('🚀 Starting production database seeding...\n');

  try {
    // Step 1: Register demo user
    console.log('👤 Creating demo user...');
    const registerRes = await fetch(`${PRODUCTION_API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEMO_USER)
    });

    let token;
    if (registerRes.ok) {
      const data = await registerRes.json();
      token = data.token;
      console.log('✅ Demo user created successfully!');
    } else if (registerRes.status === 409) {
      // User already exists, try to login
      console.log('ℹ️  Demo user already exists, logging in...');
      const loginRes = await fetch(`${PRODUCTION_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: DEMO_USER.email,
          password: DEMO_USER.password
        })
      });

      if (loginRes.ok) {
        const data = await loginRes.json();
        token = data.token;
        console.log('✅ Logged in successfully!');
      } else {
        throw new Error('Failed to login to existing demo user');
      }
    } else {
      const error = await registerRes.text();
      throw new Error(`Failed to create user: ${error}`);
    }

    // Step 2: Add all media
    console.log(`\n📚 Adding ${MEDIA_DATA.length} media items...`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < MEDIA_DATA.length; i++) {
      const media = MEDIA_DATA[i];

      // Convert categoryId to type string
      const categoryMap = { 1: 'Movie', 2: 'Book', 3: 'TV Show' };
      const mediaPayload = {
        ...media,
        type: categoryMap[media.categoryId]
      };
      delete mediaPayload.categoryId;

      try {
        const res = await fetch(`${PRODUCTION_API}/media`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(mediaPayload)
        });

        if (res.ok) {
          successCount++;
          process.stdout.write(`\r✓ Added ${successCount}/${MEDIA_DATA.length} media items`);
        } else {
          errorCount++;
          const error = await res.text();
          console.error(`\n❌ Failed to add "${media.title}": ${error}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`\n❌ Error adding "${media.title}": ${error.message}`);
      }

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n\n🎉 Seeding complete!`);
    console.log(`   ✅ Successfully added: ${successCount} items`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed: ${errorCount} items`);
    }
    console.log(`\n📧 Demo account: ${DEMO_USER.email}`);
    console.log(`🔑 Password: ${DEMO_USER.password}`);

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seeder
seedProduction();
