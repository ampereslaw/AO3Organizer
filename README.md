# AO3 Organizer

Currently:
- Scrapes fic metadata from a given link and its following/previous pages
- Allows users to manually enter new fic into the same archive with the scraped fic
- Has a search feature that displays filtered fic from the archive and links to it
- Displays graphs of archive statistics (based on most occuring fandom/tag/rating/etc)

To-do:
- Access fic history by using mechanize to login to a user account
- Search through fic history for fics that have been kudosed by user to aggregate them (Note to self 1: requires hitting 'show more' an undetermined number of times because you cannot unkudos fic) (Note to self 2: since checking for kudos requires opening fic, there must be a substantial delay between queries as to not accidentally ddos the server)
