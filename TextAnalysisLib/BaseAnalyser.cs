namespace TextAnalysisLib;
public class BaseAnalyser
{
    protected readonly Dictionary<string, List<string>> data;

    public BaseAnalyser(Dictionary<string, List<string>> data)
    {
        this.data = data;
    }

    public IOrderedEnumerable<KeyValuePair<string, int>> UniqueItemCount()
    {
        return data.ToDictionary(
                user => user.Key,
                user => user.Value.Distinct().Count()
            )
            .OrderByDescending(g => g.Value);
    }

    public Dictionary<string, string> MostUsedItemByUsers()
    {
        Dictionary<string, string> result = new();

        foreach (var user in data)
        {
            result[user.Key] = user.Value.GroupBy(w => w)
                                         .OrderByDescending(w => w.Count())
                                         .First().Key;
        }

        return result;
    }

    public Dictionary<string, int> TotalItemsPerUser()
    {
        return data.ToDictionary(
            user => user.Key,
            user => user.Value.Count
        ).Where(x => x.Value > 0)
         .OrderByDescending(x => x.Value)
         .ToDictionary(x => x.Key, x => x.Value);
    }

    public Dictionary<string, int> ItemFrequencyPerUser(string item)
    {
        return data
            .ToDictionary(user => user.Key,
                          user => user.Value.Count(x => string.Equals(x, item, StringComparison.OrdinalIgnoreCase)))
            .Where(x => x.Value > 0)
            .OrderByDescending(x => x.Value)
            .ToDictionary(x => x.Key, x => x.Value);
    }

    public int ItemCountByUser(string user)
    {
        if (!data.ContainsKey(user))
            return -1;
        return data[user].Count;
    }

    public Dictionary<string, int> Top(int top = int.MaxValue)
    {
        Dictionary<string, int> counts = new();

        foreach (var user in data)
        {
            foreach (var item in user.Value)
            {
                counts[item] = counts.GetValueOrDefault(item, 0) + 1;
            }
        }

        return counts.OrderByDescending(x => x.Value)
                     .Take(top)
                     .ToDictionary(x => x.Key, x => x.Value);
    }

    public Dictionary<string, int> Top(string user, int top = int.MaxValue)
    {
        if (!data.ContainsKey(user))
            return new();

        return data[user]
            .GroupBy(x => x)
            .OrderByDescending(g => g.Count())
            .Take(top)
            .ToDictionary(g => g.Key, g => g.Count());
    }

    public List<string> GetUsers()
    {
        return data.Keys.OrderBy(k => k).ToList();
    }
}
