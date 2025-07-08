using Newtonsoft.Json;

namespace TextAnalysisLib;

public class TextAnalyser
{
    private readonly string storageFolderPath;
    private readonly string lastFileName;

    public TextAnalyser(string folderName)
    {
        storageFolderPath = $"D://code stuff//Sharp//WordAnalyser//{folderName}";
        lastFileName = $"{folderName}_words.json";
    }

    private Dictionary<string, List<string>> GetWords()
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

    public IOrderedEnumerable<KeyValuePair<string, int>> UniqueWordCount()
    {
        var words = GetWords();
        return words.ToDictionary(
                user => user.Key,
                user => user.Value.GroupBy(w => w).Count()
            )
            .OrderByDescending(g => g.Value);
    }

    public Dictionary<string, string> MostUsedWordByUsers()
    {
        var words = GetWords();
        Dictionary<string, string> result = new();

        foreach (var user in words)
        {
            result[user.Key] = user.Value.GroupBy(w => w)
                                         .OrderByDescending(w => w.Count())
                                         .First().Key;
        }

        return result;
    }

    public Dictionary<string, int> TotalWordsPerUser()
    {
        var words = GetWords();
        Dictionary<string, int> wordTierList = new();

        foreach (var user in words)
        {
            wordTierList[user.Key] = user.Value.Count;
        }

        return wordTierList.Where(v => v.Value != 0)
                            .OrderByDescending(g => g.Value)
                            .ToDictionary(g => g.Key, g => g.Value);
    }

    public Dictionary<string, int> WordFrequencyPerUser(string word)
    {
        var words = GetWords();
        Dictionary<string, int> wordList = new();

        foreach (var user in words)
        {
            int count = user.Value.Count(w => string.Equals(w, word, StringComparison.OrdinalIgnoreCase));
            wordList[user.Key] = count;
        }

        return wordList.Where(v => v.Value != 0)
                        .OrderByDescending(g => g.Value)
                        .ToDictionary(g => g.Key, g => g.Value);
    }

    public int WordCountByUser(string user)
    {
        var words = GetWords();
        if (!words.ContainsKey(user))
            return -1;
        return words[user].Count;
    }

    public Dictionary<string, int> Top(int top = int.MaxValue)
    {
        var allWords = GetWords();
        Dictionary<string, int> wordCount = new();
        foreach (var pair in allWords)
        {
            foreach (var word in pair.Value)
            {
                wordCount[word] = wordCount.GetValueOrDefault(word, 0) + 1;
            }
        }
        return wordCount.OrderByDescending(g => g.Value)
                        .Take(top).ToDictionary(g => g.Key, g => g.Value);
    }

    public Dictionary<string, int> Top(string username, int top = int.MaxValue)
    {
        var allWords = GetWords();

        if (!allWords.ContainsKey(username))
            return new Dictionary<string, int>();

        return allWords[username]
                       .GroupBy(w => w)
                       .OrderByDescending(g => g.Count())
                       .Take(top)
                       .ToDictionary(g => g.Key, g => g.Count());
    }
    public Dictionary<string, int> WordStemDetailedFrequency(string targetWord)
    {
        var allWords = GetWords();
        string stem = StemUkrainian(targetWord);

        Dictionary<string, string> stemCache = new();

        Dictionary<string, int> wordCounts = new();

        foreach (var pair in allWords)
        {
            foreach (var word in pair.Value)
            {
                if (!stemCache.TryGetValue(word, out string wordStem))
                {
                    wordStem = StemUkrainian(word);
                    stemCache[word] = wordStem;
                }

                if (wordStem.Equals(stem, StringComparison.OrdinalIgnoreCase))
                {
                    wordCounts[word] = wordCounts.GetValueOrDefault(word, 0) + 1;
                }
            }
        }

        return wordCounts.OrderByDescending(kvp => kvp.Value)
                        .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
    }
    public List<string> GetUsers()
    {
        var words = GetWords();
        return words.Keys.OrderBy(user => user)
                        .ToList();
    }

    public string StemUkrainian(string word)
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