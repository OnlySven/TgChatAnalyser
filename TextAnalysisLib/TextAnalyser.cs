namespace TextAnalysisLib;

public class TextAnalyser : BaseAnalyser
{
    public TextAnalyser(string folderName) : base(ApplyFilter(
            new Extractor().GetWords(
            $"D://code stuff//Sharp//WordAnalyser//{folderName}",
            $"{folderName}_words.json")))
    { }

    private static Dictionary<string, List<string>> ApplyFilter(Dictionary<string, List<string>> input)
    {
        Filter filter = new Filter();
        return filter.RemoveCommonWords(input);
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
    public Dictionary<string, int> WordStemDetailedFrequency(string targetWord)
    {
        var allWords = data;
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
}
