# Little Bear — demo

A demo of a personal couple's progressive web app. It has a daily message, a habit tracker (Habits),
a words page, a memories section with a gallery and a map, a dates page with countdowns, and a
birthday surprise.

All people, dates, places, texts and photos are invented. Everything is stored in the browser
(`localStorage`); there is no server and no account. The sign-in screen accepts any e-mail
address and password. The "Reset" link in the top ribbon clears the demo data.

## Open it locally

Serve the folder with any static file server, then open the address it prints:

```
python -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/`. The map tiles and the map library are loaded from the internet, so
the map needs a connection.
