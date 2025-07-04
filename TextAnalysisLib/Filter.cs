namespace TextAnalysisLib;
public class Filter
{
    public HashSet<string> defaultIgnoreList = new HashSet<string>
    {
        "не",
        "я",
        "в",
        "і",
        "на",
        "а",
        "це",
        "у",
        "з",
        "ну",
        "що",
        "так",
        "та",
        "як",
        "мене",
        "то",
        "ще",
        "там",
        "ти",
        "він",
        "до",
        "за",
        "бо",
        "при",
        "зі",
        "по",
        "для",
        "від",
        "про",
        "який",
        "яка",
        "яке",
        "її",
        "їм",
        "його",
        "їх",
        "ми",
        "ви",
        "вона",
        "вони",
        "або",
        "але",
        "чи",
        "десь",
        "ось",
        "ось",
        "десь",
        "десь",
        "коли",
        "куди",
        "чому",
        "хоч",
        "себе",
        "свій",
        "мій",
        "твої",
        "й",
        "такий",
        "такі",
        "тут",
        "вже",
        "свої",
        "був",
        "була",
        "було",
        "були",
        "є",
        "ще",
        "дуже",
        "там",
        "теж"
    };
    public int AddToIgnoreList(string word)
    {
        if (defaultIgnoreList.Contains(word))
            return -1;
        defaultIgnoreList.Add(word);
        return 0;
    }
    public int RemoveFromIgnoreList(string word)
    {
        if (!defaultIgnoreList.Contains(word))
        {
            Console.WriteLine("Слова немає в словнику.");
            return -1;
        }
        defaultIgnoreList.Remove(word);
        return 0;

    }
    public Dictionary<string, List<string>> RemoveCommonWords(Dictionary<string, List<string>> words, HashSet<string> ignoreList = null)
    {
        HashSet<string> actualIgnoreList = ignoreList != null
            ? new(ignoreList)
            : new(defaultIgnoreList);
        Dictionary<string, List<string>> result = new();
        foreach (var user in words)
        {
            result[user.Key] = user.Value.Where(w => !actualIgnoreList.Contains(w.ToLower()))
                                        .ToList();
        }
        return result;
    }
}