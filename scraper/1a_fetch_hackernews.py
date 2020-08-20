import config

import requests
from datetime import datetime
import ujson

from ratelimit import limits, sleep_and_retry

import os
import time

# ordered by date with most recent first
HN_SEARCH_URL = "http://hn.algolia.com/api/v1/search_by_date"


@sleep_and_retry
@limits(calls=60, period=60)
def query_hn(query):

    r = requests.get(HN_SEARCH_URL, params=query)

    return r


def fetch_since(start_time, earliest, query, output_dir):

    if not os.path.exists(f"{config.DATA_DIR}{output_dir}"):
        os.makedirs(f"{config.DATA_DIR}{output_dir}")

    query[
        "numericFilters"
    ] = f"created_at_i<{start_time.timestamp()},created_at_i>{earliest.timestamp()}"

    valid_response = True
    response_idx = 0

    while valid_response:

        r = query_hn(query)

        if r.status_code == 200:

            r_json = ujson.loads(r.text)["hits"]

            if len(r_json) == 0:
                print("Empty response. Finishing")
                break

            end_timestamp = r_json[-1]["created_at_i"]
            end_time = datetime.fromtimestamp(end_timestamp)

            print(f"{len(r_json)} results between {end_time} and {start_time}")

            with open(
                f"{config.DATA_DIR}{output_dir}/{response_idx}_{end_timestamp}.json",
                "w",
            ) as f:
                f.write(ujson.dumps(r_json))

            start_time = end_time
            query[
                "numericFilters"
            ] = f"created_at_i<{end_timestamp},created_at_i>{earliest.timestamp()}"

            response_idx += 1

        else:

            print(f"Unsuccessful response: code {r.status_code}, {r.text}")
            break


earliest = datetime.strptime("2000-01-01 00:00:00", "%Y-%m-%d %H:%M:%S")
start_time = datetime.today()

query = {"query": "github.com", "hitsPerPage": 1000}

fetch_since(start_time, earliest, query, "/raw/hackernews_github")
