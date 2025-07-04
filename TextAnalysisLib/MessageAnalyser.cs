namespace TextAnalysisLib;
using Newtonsoft.Json.Linq;
public class MessageAnalyser
{
    public IOrderedEnumerable<KeyValuePair<string, int>> MessagesPerHour(string filePath)
    {
        string json = File.ReadAllText(filePath);
        var data = JObject.Parse(json);
        var messages = data["messages"];
        Dictionary<string, int> messagesPerDay = new();

        foreach (var message in messages)
        {
            var dateToken = message["date"];
            if (dateToken != null)
            {
                string date = DateTime.Parse(dateToken.ToString()).ToString("HH");

                if (!messagesPerDay.ContainsKey(date))
                    messagesPerDay[date] = 1;
                else
                    messagesPerDay[date]++;
            }
        }

        return messagesPerDay.OrderBy(g => g.Key);
    }
    public Dictionary<string, int> MessagesPerMonth(string filePath)
    {
        string json = File.ReadAllText(filePath);
        var data = JObject.Parse(json);
        var messages = data["messages"];
        Dictionary<string, int> messagesPerDay = new();

        foreach (var message in messages)
        {
            var dateToken = message["date"];
            if (dateToken != null)
            {
                string date = DateTime.Parse(dateToken.ToString()).ToString("MMMM yyyy");

                if (!messagesPerDay.ContainsKey(date))
                    messagesPerDay[date] = 1;
                else
                    messagesPerDay[date]++;
            }
        }

        return messagesPerDay;
    }
    public Dictionary<string, int> MessagesPerDay(string filePath)
    {
        string json = File.ReadAllText(filePath);
        var data = JObject.Parse(json);
        var messages = data["messages"];
        Dictionary<string, int> messagesPerDay = new();

        foreach (var message in messages)
        {
            var dateToken = message["date"];
            if (dateToken != null)
            {
                string date = DateTime.Parse(dateToken.ToString()).ToString("dd MMMM yyyy");

                if (!messagesPerDay.ContainsKey(date))
                    messagesPerDay[date] = 1;
                else
                    messagesPerDay[date]++;
            }
        }

        return messagesPerDay;
    }
    public IOrderedEnumerable<KeyValuePair<string, double>> AverageMessageLength(Dictionary<string, List<string>> messages)
    {
        Dictionary<string, double> mesLen = new();
        foreach (var user in messages)
        {
            double avg = user.Value.Select(w => w.Length).Average();
            mesLen[user.Key] = Math.Round(avg, 2);
        }
        return mesLen.OrderByDescending(g => g.Value);
    }
    public int MessageCount(Dictionary<string, List<string>> messages)
    {
        return messages.SelectMany(pairs => pairs.Value).Count();
    }
    public Dictionary<string, List<string>> MessagesWithWord(Dictionary<string, List<string>> messages, string word)
    {
        Dictionary<string, List<string>> result = new();
        string trimedWord = StemUkrainian(word);
        foreach (var user in messages)
        {
            result[user.Key] = user.Value.Where(mes => mes.IndexOf(trimedWord, StringComparison.OrdinalIgnoreCase) >= 0)
                                        .ToList();
        }

        return result.Where(g => g.Value.Count() != 0).ToDictionary();
    }
    private string StemUkrainian(string word)
    {
        string[] suffixes = { "ами", "ями", "ами", "ові", "еві", "ею", "ою", "ах", "ях", "и", "і", "у", "ю", "а", "я", "о", "е", "ик", "ік" };

        foreach (var suffix in suffixes.OrderByDescending(s => s.Length))
        {
            if (word.EndsWith(suffix))
                return word.Substring(0, word.Length - suffix.Length);
        }

        return word;
    }
}