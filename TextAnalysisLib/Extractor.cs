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

    public (Dictionary<string, List<string>> given, Dictionary<string, List<string>> received) ExtractReactionsFull(JObject data)
    {
        var messages = data["messages"];
        var givenReactions = new Dictionary<string, List<string>>();
        var receivedReactions = new Dictionary<string, List<string>>();

        foreach (var message in messages)
        {
            string? author = message["from"]?.ToString();

            if (message["reactions"] == null)
                continue;

            foreach (var reaction in message["reactions"])
            {
                string emoji = reaction["emoji"]?.ToString() ?? "";
                if (string.IsNullOrWhiteSpace(emoji))
                    continue;

                // Отримані реакції — до автора повідомлення
                if (!string.IsNullOrWhiteSpace(author))
                {
                    if (!receivedReactions.ContainsKey(author))
                        receivedReactions[author] = new List<string>();
                    receivedReactions[author].Add(emoji);
                }

                // Поставлені реакції — від recent/from
                if (reaction["recent"] != null)
                {
                    foreach (var r in reaction["recent"])
                    {
                        string user = r["from"]?.ToString() ?? "Unknown";
                        if (!givenReactions.ContainsKey(user))
                            givenReactions[user] = new List<string>();
                        givenReactions[user].Add(emoji);
                    }
                }
            }
        }

        return (givenReactions, receivedReactions);
    }

    public Dictionary<string, List<string>> ExtractEmojis(Dictionary<string, List<DatedMessage>> messages)
    {
        Dictionary<string, List<string>> userEmojis = new();
        var emojiRegex = new Regex(
            @"(\uD83C[\uDFFB-\uDFFF])|" +                        // tone modifiers окремо
            @"(\uD83C[\uDF00-\uDFFF])|" +                        // емоджі базові 1 діапазон
            @"(\uD83D[\uDC00-\uDE4F])|" +                        // емоджі базові 2 діапазон
            @"(\uD83E[\uDD00-\uDDFF])|" +                        // емоджі базові 3 діапазон
            @"(\uD83D[\uDFFB-\uDFFF])",                          // tone modifiers в діапазоні D83D
            RegexOptions.Compiled);

        foreach (var user in messages)
        {
            string username = user.Key;
            string combinedText = string.Join(" ", user.Value.Select(m => m.Text));

            var emojis = emojiRegex.Matches(combinedText)
                                .Select(m => m.Value)
                                .Where(e => !string.IsNullOrWhiteSpace(e))
                                .ToList();

            userEmojis[username] = emojis;
        }
        return userEmojis;
    }

    public Dictionary<string, List<string>> GetWords(string storageFolderPath, string lastFileName)
    {
        string filePath = Path.Combine(storageFolderPath, lastFileName);

        if (!File.Exists(filePath))
            throw new FileNotFoundException($"Файл не знайдено: {filePath}");

        string json = File.ReadAllText(filePath);

        var data = JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(json);

        if (data == null)
            throw new InvalidDataException("Не вдалося розпарсити файл як словник слів користувачів");

        return data;
    }
}