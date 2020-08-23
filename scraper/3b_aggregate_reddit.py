import pandas as pd
import config
import ujson
import re

# limit top n per day
DAILY_LIMIT = 25

reddit = pd.read_feather(config.DATA_DIR / "intermediate/reddit_github.feather")

# remove bot posts
reddit = reddit[
    reddit["selftext"].apply(lambda x: "This post was created by a bot." not in x)
]

# remove posts with no url
def extract_github_link(text):
    link = re.search(r"(https?://github\.com\S+)", text)

    if link is None:

        return ""

    link = link.group()

    if "]" in link:

        link = link[: link.index("]")]

    if ")" in link:

        link = link[: link.index(")")]

    return link


reddit["text_link"] = reddit["selftext"].apply(extract_github_link)


def github_url(row):
    if "github.com" in row["url"]:
        return row["url"]
    else:
        return row["text_link"]


reddit["github_url"] = reddit.apply(github_url, axis=1)
reddit = reddit[reddit["github_url"] != ""]

# group by day
reddit["date"] = pd.to_datetime(reddit["created_utc"], unit="s")
reddit["day"] = reddit["date"].dt.floor("d").astype(str)
reddit = reddit.sort_values(by=["day", "score"], ascending=[True, False])

# filter daily ranks
reddit["daily_rank"] = reddit.groupby("day")["score"].rank(
    method="first", ascending=False
)
reddit = reddit[reddit["daily_rank"] <= DAILY_LIMIT]

# reset index
reddit.reset_index(inplace=True, drop=True)

# drop some columns
reddit = reddit[
    [
        "author",
        "full_link",
        "num_comments",
        "score",
        "subreddit",
        "title",
        "github_url",
        "date",
        "day",
        "daily_rank",
    ]
]

reddit = reddit.rename({"github_url":"url","score":"points"})

reddit.to_feather(
    config.DATA_DIR / "processed/reddit_github.feather",
    compression=config.FEATHER_COMPRESSION,
    compression_level=config.FEATHER_COMPRESSION_LEVEL,
)

reddit["date"] = reddit["date"].astype(str)
reddit_dict = dict(tuple(reddit.groupby("day")))
reddit_dict = {x: y.to_dict("records") for x, y in reddit_dict.items()}

with open("../src/assets/reddit_github.json", "w") as f:
    f.write(ujson.dumps(reddit_dict))
