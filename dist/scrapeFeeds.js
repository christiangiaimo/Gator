import { getNextFeedToFetch } from "./lib/db/queries/getNextFeedToFetch";
import { fetchFeed } from "./fetch";
import { markFeedFetched } from "./lib/db/queries/markFeedFetched";
import { createPost } from "./lib/db/queries/createPost";
export async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed)
        return;
    await markFeedFetched(nextFeed.id);
    const fetchedFeed = await fetchFeed(nextFeed.url);
    for (const item of fetchedFeed.channel.item) {
        if (!item.link)
            continue; // or skip invalid items
        await createPost(item.title, item.link, nextFeed.id, item.description);
    }
}
