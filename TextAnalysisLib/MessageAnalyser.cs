namespace TextAnalysisLib;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

public class MessageAnalyser
{
    private readonly string storageFolderPath;
    private readonly string lastFileName;

    public MessageAnalyser(string folderName)
    {
        storageFolderPath = $"D://code stuff//Sharp//WordAnalyser//{folderName}";
        lastFileName = $"{folderName}_messages.json";
    }

    private Dictionary<string, List<DatedMessage>> GetMessages()
    {
        string filePath = Path.Combine(storageFolderPath, lastFileName);

        if (!File.Exists(filePath))
            throw new FileNotFoundException($"Файл не знайдено: {filePath}");

        string json = File.ReadAllText(filePath);

        var data = JsonConvert.DeserializeObject<Dictionary<string, List<DatedMessage>>>(json);

        if (data == null)
            throw new InvalidDataException("Не вдалося розпарсити файл як словник користувачів");

        return data;
    }
    public Dictionary<string, int> ActivityPerHour()
    {
        var allMessages = GetMessages();
        Dictionary<string, int> activityPerHour = new();

        foreach (var userMessages in allMessages.Values)
        {
            foreach (var msg in userMessages)
            {
                if (msg?.Date != null)
                {
                    string hour = msg.Date.ToString("HH");

                    if (!activityPerHour.ContainsKey(hour))
                        activityPerHour[hour] = 1;
                    else
                        activityPerHour[hour]++;
                }
            }
        }

        return activityPerHour.OrderBy(g => g.Key).ToDictionary();
    }
    public Dictionary<string, int> ActivityPerDay()
    {
        var allMessages = GetMessages();
        Dictionary<string, int> activityPerDayOfWeek = new();

        foreach (var userMessages in allMessages.Values)
        {
            foreach (var msg in userMessages)
            {
                if (msg?.Date != null)
                {
                    string dayOfWeek = msg.Date.ToString("dddd", new System.Globalization.CultureInfo("uk-UA"));

                    if (!activityPerDayOfWeek.ContainsKey(dayOfWeek))
                        activityPerDayOfWeek[dayOfWeek] = 1;
                    else
                        activityPerDayOfWeek[dayOfWeek]++;
                }
            }
        }
        string[] orderedDays = new[] { "понеділок", "вівторок", "середа", "четвер", "пʼятниця", "субота", "неділя" };

        return activityPerDayOfWeek
            .OrderBy(kvp => Array.IndexOf(orderedDays, kvp.Key.ToLower()))
            .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
    }
    public Dictionary<string, int> MessagesPerMonth()
    {
        var allMessages = GetMessages();
        var culture = new System.Globalization.CultureInfo("uk-UA");
        Dictionary<string, int> messagesPerMonth = new();

        foreach (var userMessages in allMessages.Values)
        {
            foreach (var msg in userMessages)
            {
                if (msg?.Date != null)
                {
                    string month = msg.Date.ToString("MMMM yyyy", culture);

                    if (!messagesPerMonth.ContainsKey(month))
                        messagesPerMonth[month] = 1;
                    else
                        messagesPerMonth[month]++;
                }
            }
        }

        return messagesPerMonth
            .OrderBy(p => DateTime.ParseExact(p.Key, "MMMM yyyy", culture))
            .ToDictionary(p => p.Key, p => p.Value);
    }
    public Dictionary<string, int> MessagesPerWeek()
    {
        var allMessages = GetMessages();
        var culture = new System.Globalization.CultureInfo("uk-UA");
        Dictionary<string, int> messagesPerWeek = new();

        foreach (var userMessages in allMessages.Values)
        {
            foreach (var msg in userMessages)
            {
                if (msg?.Date != null)
                {
                    DateTime date = msg.Date.Date;
                    int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
                    DateTime startOfWeek = date.AddDays(-diff);
                    DateTime endOfWeek = startOfWeek.AddDays(6);

                    string weekKey = $"{startOfWeek:dd.MM.yyyy} – {endOfWeek:dd.MM.yyyy}";

                    if (!messagesPerWeek.ContainsKey(weekKey))
                        messagesPerWeek[weekKey] = 1;
                    else
                        messagesPerWeek[weekKey]++;
                }
            }
        }

        return messagesPerWeek
            .OrderBy(p => DateTime.ParseExact(p.Key.Substring(0, 10), "dd.MM.yyyy", culture))
            .ToDictionary(p => p.Key, p => p.Value);
    }
    public Dictionary<string, int> MessagesPerDay()
    {
        var allMessages = GetMessages();
        var culture = new System.Globalization.CultureInfo("uk-UA");
        Dictionary<string, int> messagesPerDay = new();

        foreach (var userMessages in allMessages.Values)
        {
            foreach (var msg in userMessages)
            {
                if (msg?.Date != null)
                {
                    string day = msg.Date.ToString("dd MMMM yyyy", culture);

                    if (!messagesPerDay.ContainsKey(day))
                        messagesPerDay[day] = 1;
                    else
                        messagesPerDay[day]++;
                }
            }
        }

        return messagesPerDay
            .OrderBy(p => DateTime.ParseExact(p.Key, "dd MMMM yyyy", culture))
            .ToDictionary(p => p.Key, p => p.Value);
    }
    public Dictionary<string, double> AverageMessageLength()
    {
        var messages = GetMessages();
        Dictionary<string, double> mesLen = new();
        foreach (var user in messages)
        {
            double avg = user.Value.Select(w => w.Text.Length).Average();
            mesLen[user.Key] = Math.Round(avg, 2);
        }
        return mesLen.OrderByDescending(g => g.Value).ToDictionary();
    }
    public Dictionary<string, int> MessageCount()
    {
        var messages = GetMessages();
        Dictionary<string, int> messageCount = new();
        foreach (var user in messages)
        {
            messageCount[user.Key] = user.Value.Count;
        }
        return messageCount.OrderByDescending(g => g.Value).ToDictionary();
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