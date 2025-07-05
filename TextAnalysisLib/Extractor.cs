namespace TextAnalysisLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

public class Extractor
{
    const string storageFolderPath = "D://code stuff//Sharp//WordAnalyser";

    public Dictionary<string, List<DatedMessage>> ExtractMessages(JObject data)
    {
        var messages = data["messages"];
        Dictionary<string, List<DatedMessage>> userMessages = new();

        foreach (var message in messages)
        {
            if (message["text"] != null && message["from"] != null && message["date"] != null)
            {
                string username = message["from"]!.ToString();
                string text = "";

                if (message["text"]!.Type == JTokenType.Array)
                {
                    foreach (var item in message["text"]!)
                    {
                        if (item.Type == JTokenType.String)
                            text += item.ToString();
                        else if (item["text"] != null)
                            text += item["text"]!.ToString() + " ";
                    }
                }
                else
                {
                    text = message["text"]!.ToString();
                }

                DateTime date;
                if (!DateTime.TryParse(message["date"]!.ToString(), out date))
                    continue;

                var datedMessage = new DatedMessage
                {
                    Date = date,
                    Text = text.Trim()
                };

                if (!userMessages.ContainsKey(username))
                    userMessages[username] = new List<DatedMessage>();

                userMessages[username].Add(datedMessage);
            }
        }

        return userMessages;
    }

    public Dictionary<string, List<string>> ExtractWords(Dictionary<string, List<DatedMessage>> messages)
    {
        Dictionary<string, List<string>> userWords = new();
        var blacklist = new HashSet<string>
        {
            "text", "type", "https", "link", "int", "i", "n", "file", "photo", "service", "document", "width", "height"
        };

        foreach (var user in messages)
        {
            string username = user.Key;

            // Об'єднуємо всі повідомлення користувача в один великий текст
            string combinedText = string.Join(" ", user.Value.Select(m => m.Text));

            var words = Regex.Matches(combinedText.ToLower(), @"\b[а-яА-ЯіїєґІЇЄҐa-zA-Z]+\b", RegexOptions.IgnoreCase)
                            .Select(m => m.Value)
                            .Where(w => !blacklist.Contains(w))
                            .ToList();

            userWords[username] = words;
        }

        return userWords;
    }

    public Dictionary<string, List<string>> ExtractReactions(JObject data)
    {
        var messages = data["messages"];
        var userReactions = new Dictionary<string, List<string>>();

        foreach (var message in messages)
        {
            if (message["reactions"] != null)
            {
                foreach (var reaction in message["reactions"])
                {
                    string emoji = reaction["emoji"]?.ToString() ?? "";

                    if (reaction["recent"] != null)
                    {
                        foreach (var r in reaction["recent"])
                        {
                            string user = r["from"]?.ToString() ?? "Unknown";

                            if (!userReactions.ContainsKey(user))
                                userReactions[user] = new List<string>();

                            userReactions[user].Add(emoji);
                        }
                    }
                }
            }
        }
        return userReactions;
    }
}