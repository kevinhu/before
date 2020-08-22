import pandas as pd
import config

# limit top n per day
DAILY_LIMIT = 16

hackernews = pd.read_feather(config.DATA_DIR / "intermediate/hackernews_github.feather")

# remove posts with no points
hackernews = hackernews[~hackernews["points"].isna()]

# remove posts with no url
hackernews = hackernews[hackernews["url"].apply(lambda x: "github.com" in x)]

# group by day
hackernews["date"] = pd.to_datetime(hackernews["created_at_i"],unit='s')
hackernews["day"] = hackernews["date"].dt.floor('d')
hackernews = hackernews.sort_values(by=["day","points"],ascending=[True,False])

# filter daily ranks
hackernews["daily_rank"] = hackernews.groupby("day")["points"].rank(method="first",ascending=False)
hackernews = hackernews[hackernews["daily_rank"] <= DAILY_LIMIT]

# reset index
hackernews.reset_index(inplace=True,drop=True)

hackernews.to_feather(
    config.DATA_DIR / "processed/hackernews_github.feather",
    compression=config.FEATHER_COMPRESSION,
    compression_level=config.FEATHER_COMPRESSION_LEVEL,
)