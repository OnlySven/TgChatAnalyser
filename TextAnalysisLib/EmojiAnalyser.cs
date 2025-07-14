namespace TextAnalysisLib;

public class EmojiAnalyser : BaseAnalyser
{
    public EmojiAnalyser(string folderName) : base(new Extractor().GetWords(
        $"D://code stuff//Sharp//WordAnalyser//{folderName}",
        $"{folderName}_emojis.json"))
    { }
}
