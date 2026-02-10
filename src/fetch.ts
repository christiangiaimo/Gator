import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedUrl: string): Promise<RSSFeed> {
  const response = await fetch(feedUrl, { headers: { "User-Agent": "Gator" } });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.text();

  const parser = new XMLParser();
  const json = parser.parse(data);
  if (!json.rss.channel) {
    throw new Error("Invalid RSS feed format");
  }
  if (
    !json.rss.channel.title ||
    !json.rss.channel.link ||
    !json.rss.channel.description
  ) {
    throw new Error("Invalid RSS feed format");
  }
  const chanelTitle = json.rss.channel.title;
  const chanelLink = json.rss.channel.link;
  const chanelDescription = json.rss.channel.description;
  const items = json.rss.channel.item;

  let itemsArray = [];
  if (Array.isArray(items)) {
    itemsArray = items;
  } else {
    if (items) {
      itemsArray = [items];
    }
  }
  const filteredItems = [];
  for (const item of itemsArray) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue; // Skip items that don't have the required fields
    }
    const itemTitle = item.title;
    const itemLink = item.link;
    const itemDescription = item.description;
    filteredItems.push({
      title: itemTitle,
      link: itemLink,
      description: itemDescription,
      pubDate: item.pubDate,
    });
  }

  const result = {
    channel: {
      title: chanelTitle,
      link: chanelLink,
      description: chanelDescription,
      item: filteredItems,
    },
  };
  return result;
}
