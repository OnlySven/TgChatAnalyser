namespace TextAnalysisLib;

public class TextAnalyser
{
    public string Hello() => "TextAnalyzer is working!";
    public IOrderedEnumerable<KeyValuePair<string, int>> UniqueWordCount(Dictionary<string, List<string>> words)
    {
        Dictionary<string, int> result = new();
        foreach (var user in words)
        {
            result[user.Key] = user.Value.GroupBy(w => w)
                                        .Count();
        }
        return result.OrderByDescending(g => g.Value);
    }
    public Dictionary<string, string> MostUsedWordByUsers(Dictionary<string, List<string>> words)
    {
        Dictionary<string, string> result = new();

        foreach (var user in words)
        {
            result[user.Key] = user.Value.GroupBy(w => w)
                                        .OrderByDescending(w => w.Count())
                                        .First()
                                        .Key;
        }

        return result;
    }
    public IOrderedEnumerable<KeyValuePair<string, int>> TotalWordsPerUser(Dictionary<string, List<string>> words)
    {
        Dictionary<string, int> wordTierList = new();

        foreach (var user in words)
        {
            wordTierList[user.Key] = user.Value.Count;
        }
        wordTierList["All"] = words.SelectMany(pair => pair.Value).Count();
        return wordTierList.Where(v => v.Value != 0).OrderByDescending(g => g.Value);
    }
    public IOrderedEnumerable<KeyValuePair<string, int>> WordFrequencyPerUser(Dictionary<string, List<string>> words, string word)
    {
        Dictionary<string, int> wordList = new();
        
        foreach(var user in words)
        {
            int count = user.Value.Count(w => string.Equals(w, word, StringComparison.OrdinalIgnoreCase));
            wordList[user.Key] = count;
        }
        wordList["All"] = words.SelectMany(pairs => pairs.Value)
                               .Count(w => string.Equals(w, word, StringComparison.OrdinalIgnoreCase));
        return wordList.Where(v => v.Value != 0).OrderByDescending(g => g.Value);
    }
    public int WordCountByUser(Dictionary<string, List<string>> words, string user)
    {
        if (!words.ContainsKey(user))
            return -1;
        return words[user].Count();
    }
    public IEnumerable<IGrouping<string,string>> Top(Dictionary<string, List<string>> allWords, int top = int.MaxValue)
    {
        var topWords = allWords.SelectMany(pairs => pairs.Value)
                                .GroupBy(w => w)
                                .OrderByDescending(g => g.Count())
                                .Take(top);
        return topWords;
    }
    public IEnumerable<IGrouping<string, string>> Top(Dictionary<string, List<string>> allWords, string username, int top = int.MaxValue)
    {
        if (!allWords.ContainsKey(username))
        {
            Console.WriteLine("User Not Found");
            return Enumerable.Empty<IGrouping<string, string>>();
        }
        var topWords = allWords[username]
                                .GroupBy(w => w)
                                .OrderByDescending(g => g.Count())
                                .Take(top);
        return topWords;
    }
}
