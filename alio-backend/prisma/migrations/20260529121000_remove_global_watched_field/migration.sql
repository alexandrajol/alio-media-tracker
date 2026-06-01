PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "genre" TEXT,
    "year" INTEGER,
    "rating" INTEGER,
    "review" TEXT,
    "posterUrl" TEXT,
    "director" TEXT,
    "duration" TEXT,
    "seasons" INTEGER,
    "author" TEXT,
    "pages" INTEGER,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Media_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Media" (
    "id",
    "title",
    "genre",
    "year",
    "rating",
    "review",
    "posterUrl",
    "director",
    "duration",
    "seasons",
    "author",
    "pages",
    "userId",
    "categoryId"
)
SELECT
    "id",
    "title",
    "genre",
    "year",
    "rating",
    "review",
    "posterUrl",
    "director",
    "duration",
    "seasons",
    "author",
    "pages",
    "userId",
    "categoryId"
FROM "Media";

DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
