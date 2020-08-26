# [before](http://before.kevinhu.io)
Archive of historically trending GitHub repositories on Hacker News. See it live at http://before.kevinhu.io.

## Overview

[Hacker News](https://news.ycombinator.com/news) is a great place to find high-quality GitHub repositories However, posted repositories are quickly pushed out by new submissions, making older ones hard to discover. This project scrapes and presents all linked GitHub repositories since inception.

## How it works

1. Hacker News posts mentioning 'github.com' are scraped from the [Algolia API](https://hn.algolia.com/api) in `scraper/1a_fetch_hackernews.py`. It takes about an hour to download every post since 2008, which is when GitHub was founded.
2. The raw JSON files from the Algolia API are consolidated and stored in `.feather` format for fast loading in `scraper/2a_convert_hackernews.py`.
3. The consolidated posts are grouped by day, sorted in descending popularity, and output to a single JSON file for the web client by `scraper/3a_aggregate_hackernews.py`.
4. The web client takes the `.json` file and uses it to render the posts. This is a standard React app that is deployed to GitHub pages. After compiling with webpack and compressing, the total size of the site is about 7 MB.

## Getting started

### Scraper

1. Install Python dependencies with `poetry install`.
2. Activate virtual environment with `poetry shell`

### Frontend

1. Install JavaScript dependencies with `yarn install`.
2. Start the client with `yarn start`.

Note that the scraper and frontend are more or less independent with the exception of the final `.json` output.

## Additional

Initially, I also intended to use Reddit posts as an orthogonal source of recommendations. However, I found that Reddit's linked repositories are usually of much lower quality and included many bots, so I no longer consider them.
