namespace TextAnalysisLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

public class Extractor
{
    const string storageFolderPath = "D://code stuff//Sharp//WordAnalyser";
    public Dictionary<string, List<string>> ExtractMessages(JObject data)
    {
        var messages = data["messages"];
        Dictionary<string, List<string>> userMessages = new();

        foreach (var message in messages)
        {
            if (message["text"] != null && message["from"] != null)
            {
                string text = "";
                string username = message["from"].ToString();
                if (message["text"].Type == JTokenType.Array)
                {
                    foreach (var item in message["text"])
                    {
                        if (item.Type == JTokenType.String)
                            text += item.ToString();
                        else if (item["text"] != null)
                            text += item["text"].ToString() + " ";
                    }
                }
                else
                {
                    text = message["text"].ToString();
                }

                if (!userMessages.ContainsKey(username))
                    userMessages.Add(username, new List<string> { text });
                else userMessages[username].Add(text);
            }
        }

        return userMessages;
    }
    public Dictionary<string, List<string>> ExtractWords(Dictionary<string, List<string>> messages)
    {
        Dictionary<string, List<string>> userWords = new();
        var blacklist = new HashSet<string>
        {
            "text", "type", "https", "link", "int", "i", "n", "file", "photo", "service", "document", "width", "height"
        };
        foreach (var user in messages)
        {
            string text = string.Join(" ", user.Value);
            string username = user.Key;

            var words = Regex.Matches(text.ToLower(), @"\b[а-яА-ЯіїєґІЇЄҐa-zA-Z]+\b", RegexOptions.IgnoreCase)
                             .Select(m => m.Value)
                             .Where(w => !blacklist.Contains(w))
                             .ToList();

            userWords[username] = words;
        }
        return userWords;
    }
    public Dictionary<string, List<string>> ExtractReactions(string filePath)
    {
        string baseFileName = Path.GetFileNameWithoutExtension(filePath);

        string targetFolder = Path.Combine(storageFolderPath, baseFileName);

        if (!Directory.Exists(targetFolder))
            Directory.CreateDirectory(targetFolder);

        string resultFileName = $"{baseFileName}_reactions.json";
        string resultFilePath = Path.Combine(targetFolder, resultFileName);

        if (File.Exists(resultFilePath))
        {
            string cachedJson = File.ReadAllText(resultFilePath);
            return JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(cachedJson);
        }

        string json = File.ReadAllText(filePath);
        var data = JObject.Parse(json);
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

        string jsonResult = JsonConvert.SerializeObject(userReactions, Formatting.Indented);
        File.WriteAllText(resultFilePath, jsonResult);

        return userReactions;
    }
}