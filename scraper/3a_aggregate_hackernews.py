import pandas as pd
import config
import ujson

# limit top n per day
DAILY_LIMIT = 100

hackernews = pd.read_feather(config.DATA_DIR / "intermediate/hackernews_github.feather")

# remove posts with no points
hackernews = hackernews[~hackernews["points"].isna()]

# remove posts with no url
hackernews = hackernews[hackernews["url"].apply(lambda x: "github.com" in x)]

# group by day
hackernews["date"] = pd.to_datetime(hackernews["created_at_i"], unit="s")
hackernews["day"] = hackernews["date"].dt.floor("d").astype(str)
hackernews = hackernews.sort_values(by=["day", "points"], ascending=[True, False])

# filter daily ranks
hackernews["daily_rank"] = hackernews.groupby("day")["points"].rank(
    method="first", ascending=False
)
hackernews = hackernews[hackernews["daily_rank"] <= DAILY_LIMIT]

# reset index
hackernews.reset_index(inplace=True, drop=True)

# drop some columns
hackernews = hackernews[
    ["title", "url", "author", "points", "date", "day", "objectID", "daily_rank"]
]

hackernews.to_feather(
    config.DATA_DIR / "processed/hackernews_github.feather",
    compression=config.FEATHER_COMPRESSION,
    compression_level=config.FEATHER_COMPRESSION_LEVEL,
)

hackernews["date"] = hackernews["date"].astype(str)
hackernews_dict = dict(tuple(hackernews.groupby("day")))
hackernews_dict = {x: y.to_dict("records") for x, y in hackernews_dict.items()}

with open("../src/assets/hackernews_github.json", "w") as f:
    f.write(ujson.dumps(hackernews_dict))
