namespace TextAnalysisLib;

public class ReactionAnalyser : BaseAnalyser
{
    public ReactionAnalyser(string folderName) : base(new Extractor().GetWords(
        $"D://code stuff//Sharp//WordAnalyser//{folderName}",
        $"{folderName}_reactions.json"))
    { }
}
